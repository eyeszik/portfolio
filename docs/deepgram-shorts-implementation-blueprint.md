# Deepgram→Shorts App Implementation Blueprint (Jan 2026)

## 1) Product Targets and Stack

### Build targets
- **CLI** for deterministic, scriptable batch runs.
- **Local web app** for review, edit, and export workflows.
- **Single-machine local-first default** with optional LAN sharing later.

### Language and runtime split
- **TypeScript-first monorepo** (Node.js + React).
- **Node.js/TypeScript**: API, worker, CLI, shared pipeline core.
- **React/TypeScript**: UI.
- **SQLite + SQL migrations**: metadata/event state.
- **Python plugin path (optional)**: advanced segmentation (e.g., PySceneDetect), feature-flagged.

### Design constraints
- CPU-first performance with graceful degradation.
- Deterministic artifacts (`JSON`, `YAML`, `CSV`).
- No secret persistence: `DEEPGRAM_API_KEY` from env or OS keychain only.
- Strict subprocess hardening (`args[]`, no shell interpolation).
- Path traversal controls and artifact validation gates.
- Governance gates (ToS acknowledgment, retention controls, warning review requirement).

---

## 2) Monorepo Layout and Module Responsibilities

```text
apps/
  api/        # REST + SSE job API
  worker/     # background stage runner + concurrency governor
  cli/        # terminal UX, can call API or local core
  web/        # React review UI

packages/
  core/           # stage orchestrator and job state transitions
  schemas/        # zod models + jsonschema export + validators
  ffmpeg/         # ffprobe/ffmpeg safe wrappers
  deepgram/       # STT client + retries + response normalization
  scoring/        # candidate generation, features, ranking, dedupe
  captions/       # SRT generation + burn-in wrappers
  governance/     # policy engine and decision outputs
  observability/  # structured logs, metrics, traces

plugins/
  segmentation-py/ # optional Python bridge for scene segmentation

data/
  migrations/      # SQLite schema migration files

docs/
  api_spec.md
  ui_ux_spec.md
  threat_model.md
```

### Public package interfaces (TypeScript)
- `@app/schemas`
  - `PipelineConfig`, `Job`, `JobStatus`, `TranscriptNormalized`, `FinalClip`, `ValidationReport`, `GovernanceDecision`.
- `@app/core`
  - `runJob(jobId, workspaceDir, config): Promise<JobResult>`
  - `resumeJob(jobId): Promise<JobResult>`
  - `cancelJob(jobId): Promise<void>`
- `@app/ffmpeg`
  - `probe(path)`, `normalizeVideo(input, output, opts)`, `extractAudio(input, output, opts)`, `clip(input, output, opts)`
- `@app/deepgram`
  - `transcribeWav(path, options): Promise<TranscriptNormalized>`
- `@app/scoring`
  - `buildCandidates(transcript, cfg)`, `scoreCandidates(candidates, cfg)`, `selectFinal(scored, cfg): FinalClip[]`
- `@app/captions`
  - `makeSrt(transcript, clipWindow)`, `burnIn(videoIn, srtPath, videoOut, styleOpts)`
- `@app/governance`
  - `runGate(context): GovernanceDecision`
- `@app/observability`
  - `logEvent(jobId, type, payload)`, `traceSpan(name, fn)`, `metric(name, value, tags)`

---

## 3) Data Model, Schemas, and Deterministic Artifact Contracts

## SQLite schema

```sql
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  input_json TEXT NOT NULL,
  config_json TEXT NOT NULL,
  workspace_dir TEXT NOT NULL,
  governance_json TEXT,
  metrics_json TEXT
);

CREATE TABLE job_events (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  level TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  FOREIGN KEY(job_id) REFERENCES jobs(id)
);

CREATE TABLE job_artifacts (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  path TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  bytes INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(job_id) REFERENCES jobs(id)
);

CREATE TABLE job_errors (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  code TEXT NOT NULL,
  message TEXT NOT NULL,
  detail_json TEXT,
  FOREIGN KEY(job_id) REFERENCES jobs(id)
);
```

### Validation policy
- Zod as source-of-truth for all DTOs.
- JSON Schema exported from Zod for artifact contract checks.
- Job may only enter `succeeded` when every required JSON/YAML/CSV artifact validates.
- CSV parser/writer must be RFC4180-compliant and deterministic (sorted rows and stable quoting).

### Workspace-per-job structure

```text
workspace/<jobId>/
  input.mp4
  normalized.mp4
  audio.wav
  transcript_raw.json
  transcript.normalized.json
  clips.csv
  clips/
    clip001_16x9.mp4
    clip001_9x16.mp4
    clip001_1x1.mp4
    clip001.srt
    clip001_captioned.mp4
  governance_decisions.json
  constraint_ledger.yaml
  validation_report.json
  approval_decision.json
  observability_hooks.yaml
  execution_trace.json
  README.md
  scoring_rules.md
```

---

## 4) Pipeline Engine (S1–S9) and Algorithm Details

Each stage exposes:
- `run(ctx): Promise<{ ok: boolean; outputs?: Record<string, unknown>; warnings?: Warning[]; errors?: StageError[] }>`
- Atomic file output (`.tmp` → `rename`) to prevent partial artifacts.
- Stage checkpoints for resume logic (`stage.done.json` with checksums).

### S1 Acquire
- Input types: local file path, URL (where legally allowed).
- URL ingest via `yt-dlp` using **argument arrays only**.
- Persist ToS acknowledgment and source metadata.
- Controls: max size/duration guard, path normalization, traversal rejection.

### S2 Normalize
- `ffprobe` capability + stream validation.
- Transcode to baseline (`H.264`, `AAC`, `yuv420p`) when needed.
- Verify duration and playability before continuing.

### S3 Extract Audio
- Audio extraction profile: `pcm_s16le`, mono, 16kHz.
- Validate extracted duration against normalized video within tolerance.

### S4 Transcribe (Deepgram)
- Retry policy: up to 3 retries on `429`/`5xx` with capped exponential backoff.
- Track request IDs in trace logs.
- Normalize vendor-specific response into stable `TranscriptNormalized` contract.
- Handle no-speech as successful but warning-bearing outcome.

### S5 Candidate Generation + Scoring + Selection
1. **Windowing**
   - Merge adjacent transcript segments into candidate windows constrained by `[minSec, maxSec]` and semantic breaks.
2. **Feature extraction**
   - `keyword_density` (preset + user keyword hits / words)
   - `speech_density` (words/sec)
   - `speaker_turns` (if diarization enabled)
   - `sentiment_intensity` (lightweight punctuation/intensifier heuristic)
   - `novelty_overlap` (TF-IDF cosine or n-gram Jaccard vs already selected clips)
3. **Scoring**
   - Weighted sum, configurable by preset.
4. **Selection**
   - Greedy by score under constraints:
     - minimum spacing between clip starts
     - overlap threshold
     - target clip count and duration bounds
5. **Optional snapping**
   - Snap cut points to nearby scene boundaries within ±1.0s when available.
6. **Output contract**
   - `clips.csv` with rationale fields (`feature_breakdown`, `selection_reason`, `confidence`).

### S6 Export
- Clip trim via `ffmpeg -ss/-to`.
- Aspect exports:
  - `16:9` pass-through/letterbox as configured
  - `9:16` center crop initially (subject tracking plugin later)
  - `1:1` center crop
- Validate clip duration tolerance and file integrity.

### S7 Captions (optional)
- Generate SRT by intersecting transcript timestamps with clip windows.
- Optional burn-in with fallback font configuration.

### S8 Validate
- Validate every required schema/artifact.
- Check checksums and expected artifact counts.
- Compute `overall_confidence` using transcript coverage, clip target fulfillment, dedupe ratio, and validation pass score.
- Emit routing suggestion: `AUTO_APPROVE | STANDARD_REVIEW | ESCALATE`.

### S9 Package
- Render execution README + scoring rules + constraint ledger.
- Emit sanitized command trace with tool versions.
- Final artifact index persisted to DB + `job_artifacts.json`.

---

## 5) API, Worker, Concurrency, and Recovery

## API surface (REST + SSE)
- `POST /v1/jobs` — create and queue job.
- `GET /v1/jobs/:id` — status, stage, summary metrics.
- `POST /v1/jobs/:id/cancel` — cooperative cancellation.
- `GET /v1/jobs/:id/events` — SSE stream for stage progress/logs.
- `GET /v1/jobs/:id/artifacts` — indexed outputs.
- `GET /v1/jobs/:id/artifacts/:kind` — stream/download artifact.

### Worker behavior
- Poll queued jobs and move through finite state machine.
- Persist event stream for replay and UI history.
- Checkpoint-aware resume: skip completed, validated stages.
- Concurrency governors:
  - global `MAX_PARALLEL_JOBS`
  - ffmpeg semaphore per host
  - optional STT request rate limiter

### Cancellation/resume
- Stage boundaries are safe cancellation points.
- Long-running ffmpeg subprocesses receive graceful stop then kill timeout.
- Resume verifies stage outputs by checksum + schema before skipping.

---

## 6) UI/UX Implementation Blueprint

### Main screens
- **Job Create**: source input, presets, advanced options, governance reminder.
- **Job Progress**: stage timeline, live logs, performance metrics.
- **Review**: timeline overlays, clip cards, “Why this clip?” rationale.
- **Export**: aspect/caption presets, naming templates, open-folder action.
- **History**: prior jobs, clone config, replay artifacts.
- **Privacy**: workspace retention/deletion controls.

### Core components
- `JobCreateForm`
- `JobProgressTimeline`
- `LiveLogPanel`
- `ClipReviewTimeline`
- `ClipCard`
- `ExportPanel`
- `HistoryList`
- `PrivacyPanel`

### Interaction model and trust UX
- Force review when confidence < `0.85` or governance notes exist.
- Always show rationale metadata and confidence per clip.
- Editing clip boundaries triggers partial re-export for impacted clip only.
- Show visible governance badges: `PASS`, `PASS_WITH_NOTES`, `FAIL`.

### Accessibility baseline
- Full keyboard controls for timeline scrubbing and boundary nudges.
- Captions preview enabled in all preview players.
- Contrast-safe tokens and focus-visible states.

---

## 7) Security, Governance, and Observability

### Security-by-construction checklist
- No `shell:true`; subprocesses invoked with fixed executable + arg arrays.
- Canonicalize workspace paths and reject escape attempts.
- Strict output filename sanitizer (`[a-zA-Z0-9_-]`).
- Secrets sourced from env/keychain only; redact in logs and traces.
- Never store API keys in DB, artifacts, or crash dumps.

### Governance controls
- URL ingestion requires explicit ToS acknowledgment.
- Enforce retention policy defaults; user-controlled delete flow.
- `PASS_WITH_NOTES` requires explicit user acknowledgment in UI before export.

### Observability
- Structured JSON logs: `job_id`, `stage`, `event_type`, `latency_ms`.
- Core KPIs: `clip_count`, `runtime_ms`, `stt_latency_ms`, `failure_rate`.
- Per-stage trace spans with sanitized command metadata.

---

## 8) Testing, Validation, and Packaging Plan

### Test matrix
- **Unit**
  - scoring/selection/dedupe behavior
  - transcript normalization
  - schema validation and CSV determinism
- **Integration**
  - ffmpeg preflight/probe
  - normalize/extract/export duration correctness
  - caption generation and burn-in
- **E2E**
  - full sample job emits validated artifacts
  - cancellation and resume from checkpoint
  - fallback behavior for no-speech transcript

### Packaging strategy
- CLI as npm package with preflight checks (`ffmpeg`, `ffprobe`, disk, workspace perms).
- Local API + static web bundle for browser UI.
- Optional desktop wrapper (Tauri) after core maturity.

### Delivery milestones
- **M1**: core pipeline + CLI skeleton.
- **M2**: Deepgram integration + transcript normalization.
- **M3**: scoring/selection/dedupe + `clips.csv`.
- **M4**: multi-aspect export + captions.
- **M5**: API + worker + SSE.
- **M6**: review UI + edit loop.
- **M7**: governance/privacy polish + packaging.

---

## 9) Risks and Built-in Guardrails

### Known failure modes
- `ENV-1`: missing binaries/codec incompatibility.
- `STT-2`: transcript has no useful speech.
- `SEL-3`: over-strict dedupe under-selects clips.
- `UX-4`: naive `9:16` crop quality mismatch.
- `CAP-5`: subtitle burn-in font/path issues.

### Guardrails
- Runtime preflight and fail-fast diagnostics.
- Fallback candidate generation from scene/audio peaks when transcript is sparse.
- Bounded auto-relaxation of selection constraints when target clip count is missed.
- Mandatory review mode under low-confidence or governance-noted runs.

---

## 10) Suggested Implementation Sequence (p2→p1)

1. Build deterministic CLI + artifacts first.
2. Add robust STT normalization and scoring reliability.
3. Layer API/worker around same core.
4. Add UI for review/edit/export.
5. Introduce optional Python plugins only after schema and checkpoint stability.

This sequence optimizes reliability and keeps architecture extensible without blocking initial delivery.
