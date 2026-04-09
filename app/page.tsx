"use client";

import * as React from "react";
import { Badge, Button, Card, CardBody, CardHeader, Divider, Input, Label, Select, Textarea } from "@/components/ui";

type Result = {
  request_id: string;
  governance: {
    risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    decision: "APPROVE" | "ESCALATE" | "BLOCK";
    belief_safe: number;
    findings: Array<{ auditor: string; pass: boolean; notes: string[]; confidence: number }>;
  };
  scenario_bands: {
    best: { revenue_range_usd_month: [number, number]; notes: string[] };
    base: { revenue_range_usd_month: [number, number]; notes: string[] };
    worst: { revenue_range_usd_month: [number, number]; notes: string[] };
  };
  blueprint: {
    industry: string;
    goal: string;
    assumptions: string[];
    missing_questions: Array<{ pass: number; questions: string[] }>;
    architecture: any;
    workflows: any[];
    outreach: {
      allowed_mode: "DRAFT_ONLY" | "HUMAN_REVIEW_REQUIRED" | "BLOCKED";
      reasons: string[];
      safe_templates: any[];
    };
    n8n: { template_id: string; export_hint: string };
  };
};

export default function Page() {
  const [industry, setIndustry] = React.useState("creator-economy");
  const [goal, setGoal] = React.useState("Build an automated content + lead funnel that maximizes revenue with minimal cost.");
  const [budgetWeek, setBudgetWeek] = React.useState("15");
  const [notes, setNotes] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [res, setRes] = React.useState<Result | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function run() {
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/blueprint", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ industry, goal, budget: { max_usd_per_week: Number(budgetWeek) }, notes })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error ?? "Request failed");
      setRes(j);
    } catch (e: any) {
      setErr(e?.message ?? "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <div className="text-2xl font-semibold">Aurora Blueprint Studio</div>
        <div className="text-zinc-400 text-sm">Minimal intake → governance-gated autonomous blueprint → n8n export</div>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="font-medium">Start</div>
            <div className="text-sm text-zinc-400">Keep it minimal. The system will auto-generate missing questions and assumptions.</div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setRes(null); setErr(null); }}>Reset</Button>
            <Button onClick={run} disabled={busy}>Generate</Button>
          </div>
        </CardHeader>

        <CardBody className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="creator-economy">Creator economy</option>
              <option value="local-services">Local services</option>
              <option value="ecommerce">E-commerce</option>
              <option value="b2b-saas">B2B SaaS</option>
              <option value="recruiting">Recruiting</option>
              <option value="education">Education</option>
              <option value="health-fitness">Health & Fitness</option>
              <option value="real-estate">Real estate</option>
              <option value="general">General</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Budget cap (USD / week)</Label>
            <Input inputMode="numeric" value={budgetWeek} onChange={(e) => setBudgetWeek(e.target.value)} />
            <div className="text-xs text-zinc-500">Hard-capped in API; LLM calls may be disabled if projected cost exceeds.</div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Goal</Label>
            <Textarea value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Optional notes (constraints, tools, audience)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional: existing stack, channels, compliance constraints, etc." />
          </div>
        </CardBody>
      </Card>

      {err && (
        <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/30 p-4 text-sm text-red-200">{err}</div>
      )}

      {res && (
        <div className="mt-6 grid gap-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Governance decision</div>
                <div className="text-sm text-zinc-400">Non-overridable gating; escalation required for medium/high-risk tasks.</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Risk: {res.governance.risk}</Badge>
                <Badge>Decision: {res.governance.decision}</Badge>
                <Badge>Belief safe: {Math.round(res.governance.belief_safe * 100)}%</Badge>
              </div>
            </CardHeader>
            <CardBody className="grid gap-3 md:grid-cols-2">
              {res.governance.findings.map((f, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{f.auditor}</div>
                    <Badge>{f.pass ? "PASS" : "FAIL"} · {Math.round(f.confidence * 100)}%</Badge>
                  </div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-zinc-300">
                    {f.notes.map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Scenario bands</div>
                <div className="text-sm text-zinc-400">Best/Base/Worst projections (heuristic unless you connect analytics).</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => navigator.clipboard.writeText(JSON.stringify(res, null, 2))}>Copy JSON</Button>
                <Button variant="ghost" onClick={() => window.open("/api/n8n/export?template=blueprint-generator", "_blank")}>Export n8n</Button>
              </div>
            </CardHeader>
            <CardBody className="grid gap-4 md:grid-cols-3">
              {(["best","base","worst"] as const).map((k) => (
                <div key={k} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium capitalize">{k}</div>
                    <Badge>${res.scenario_bands[k].revenue_range_usd_month[0]}–${res.scenario_bands[k].revenue_range_usd_month[1]}/mo</Badge>
                  </div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-zinc-300">
                    {res.scenario_bands[k].notes.map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="font-medium">Blueprint (high-level)</div>
              <div className="text-sm text-zinc-400">Architecture + workflows + compliance-gated outreach drafts.</div>
            </CardHeader>
            <CardBody className="grid gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Outreach mode</div>
                  <Badge>{res.blueprint.outreach.allowed_mode}</Badge>
                </div>
                <div className="text-sm text-zinc-300 mt-2">
                  Reasons:
                  <ul className="list-disc pl-5">
                    {res.blueprint.outreach.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>

              <Divider />

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="font-medium">Auto-assumptions</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-zinc-300">
                    {res.blueprint.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="font-medium">Missing questions (5-pass)</div>
                  <div className="text-xs text-zinc-500 mt-1">You can later answer these in a “guided mode” screen.</div>
                  <ul className="mt-2 space-y-2 text-sm text-zinc-300">
                    {res.blueprint.missing_questions.map((mq, i) => (
                      <li key={i} className="rounded-lg border border-zinc-800 p-2">
                        <div className="text-xs text-zinc-400">Pass {mq.pass}</div>
                        <ul className="list-disc pl-5">
                          {mq.questions.map((q, j) => <li key={j}>{q}</li>)}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Divider />

              <details className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <summary className="cursor-pointer text-sm text-zinc-200">Show full blueprint JSON</summary>
                <pre className="mt-3 overflow-auto text-xs text-zinc-300">{JSON.stringify(res.blueprint, null, 2)}</pre>
              </details>
            </CardBody>
          </Card>
        </div>
      )}
    </main>
  );
}
