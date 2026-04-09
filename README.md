# Aurora Autonomous Blueprint Studio (Local-first, budget-gated)
This repo provides a production-lean reference implementation of:
- A minimal intake UI (Industry + Goal + Budget)
- A deterministic, governance-aware blueprint generator (5-pass refinement)
- Scenario bands (best/base/worst) + cost governor
- Outreach/marketing compliance gate (draft-only unless explicitly enabled)
- n8n workflow template + exporter
- OCI-friendly docker-compose

## 1) Quick start (Docker)
1. Copy env:
   - cp .env.example .env
2. Start:
   - docker compose up -d --build
3. Open:
   - UI: http://localhost:3000
   - n8n: http://localhost:5678

## 2) LLM configuration (optional)
Default behavior is deterministic “blueprint synthesis” without calling an LLM (safe baseline).
To enable an LLM:
- Set LLM_PROVIDER to one of: `openai_compatible | ollama`
- Provide the endpoint + key if required.

Examples:
- OpenAI-compatible proxy (OpenRouter / LM Studio / vLLM / etc):
  LLM_PROVIDER=openai_compatible
  LLM_BASE_URL=https://your-openai-compatible-host/v1
  LLM_API_KEY=...
  LLM_MODEL=...

- Ollama local:
  LLM_PROVIDER=ollama
  LLM_BASE_URL=http://ollama:11434
  LLM_MODEL=llama3.1:8b-instruct

## 3) Budget guardrails
- Hard weekly/monthly caps in `.env`
- API refuses to execute LLM calls if projected cost exceeds cap.

## 4) n8n exporter
- `pnpm export:n8n` creates a stamped workflow JSON you can import into n8n.

## 5) What to customize next
- Add industry packs (knowledge primitives) under `/packages/shared/industryPacks`
- Add connectors to your tooling (Notion, Airtable, Sheets, CRM) as separate gated actions
- Add an “Earnings Simulator” with your real conversion rates & constraints
