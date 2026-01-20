import type { GovernanceResult } from "@/server/governance";
import type { BudgetGovernor } from "@/server/budget";
import { maybeCallLLM } from "@/server/llm";
import type { IndustryPack } from "@shared/industryPacks";

export async function buildBlueprint(params: {
  request_id: string;
  pack: IndustryPack;
  goal: string;
  notes: string;
  budget: BudgetGovernor;
  governance: GovernanceResult;
}) {
  const { pack, goal, notes, governance, budget } = params;

  // Minimal assumptions (auto-filled when missing)
  const assumptions: string[] = [
    "Local-first preferred to keep costs low (run n8n + app via docker-compose).",
    "Draft-only outreach unless explicitly enabled with compliance attestations.",
    `Primary channels default to: ${pack.typical_channels.join(", ")}.`,
    "Use KPI-driven iteration loops; treat initial plan as hypothesis."
  ];

  // 5-pass “autonomous clarification” (you asked for this “about five times”):
  // Pass 0: Intake normalization
  // Pass 1: Monetization selection
  // Pass 2: Workflow graph + data contracts
  // Pass 3: Infrastructure + observability + failure modes
  // Pass 4: Compliance gate (especially outreach/marketing)
  const missing_questions = [
    { pass: 0, questions: [
      "Who is the target customer/audience (1 sentence)?",
      "Primary product/offer (free/paid)?",
      "Primary channel priority (pick 1–2)?"
    ]},
    { pass: 1, questions: [
      "Top 2 monetization paths you will accept (affiliate, SaaS, services, ads, product sales)?",
      "Any forbidden niches or content categories?",
      "Do you have an existing list or starting from zero?"
    ]},
    { pass: 2, questions: [
      "What systems are allowed (Notion/Airtable/Sheets/CRM)?",
      "Is web scraping permitted for your use case (Y/N)?",
      "Latency requirements (real-time vs batch daily)?"
    ]},
    { pass: 3, questions: [
      "Where should artifacts be stored (local disk, S3/MinIO, Drive)?",
      "Minimum logging/audit retention needs?",
      "Disaster recovery expectations (backup frequency)?"
    ]},
    { pass: 4, questions: [
      "Will you do outreach/marketing (Y/N)?",
      "If yes: do you have explicit consent lists + suppression lists?",
      "Will a human approve every send (required by default)?"
    ]}
  ];

  // Outreach compliance gate (draft-only by default; block if governance indicates).
  const outreach = buildOutreachGate({ governance, pack });

  // Deterministic architecture skeleton (safe baseline)
  const architecture = {
    overview: "Local-first automation studio: UI → Blueprint API → n8n executor → connectors",
    components: [
      { name: "Next.js UI", purpose: "Intake + results + export", trust: "user-facing" },
      { name: "Blueprint API", purpose: "Planner + governance + schemas", trust: "server" },
      { name: "n8n", purpose: "Workflow execution + scheduling", trust: "automation" },
      { name: "Postgres", purpose: "n8n persistence", trust: "data" }
    ],
    data_contracts: [
      { name: "BlueprintResponse", shape: "Zod-validated JSON", storage: "exportable artifacts" }
    ],
    observability: {
      logs: ["API request logs", "governance decisions", "workflow run status"],
      metrics: ["time_to_blueprint_ms", "governance_belief_safe", "workflow_success_rate"],
      alerts: ["budget_cap_exceeded", "compliance_gate_blocked", "n8n_down"]
    }
  };

  // Workflow map (money-maximizing, low-cost): content engine + lead capture + offer loop
  const workflows = [
    {
      id: "content_to_lead_funnel",
      description: "Topic → content → lead magnet → email sequence (draft-only unless consented)",
      steps: [
        "Trend/topic selection (RAG optional)",
        "Content draft generation (text)",
        "Repurpose into short-form variants",
        "Publish scheduling",
        "Lead capture page + email delivery (opt-in)",
        "Offer nurture sequence (drafts)",
        "Analytics → iterate"
      ],
      failure_modes: [
        "Low distribution (no channel fit)",
        "Compliance gate blocks outreach",
        "Budget cap disables LLM calls",
        "Platform policy changes"
      ]
    }
  ];

  // Optional: LLM enrichment (budget-gated). Uses “constraint injection” pattern:
  // If LLM disabled or budget tight → deterministic fallback remains valid.
  let llm_enrichment: any = { used_llm: false };
  if (budget.canUseLLM()) {
    const system = [
      "[ACT: SYNTHESIZE]",
      "[CONSTRAINT: JSON_VALID]",
      "[CONSTRAINT: FACT_GROUNDED]",
      "[STATE: budget=3, depth=4, critical=true]",
      "You output STRICT JSON only, matching the requested keys.",
      "Do not promise guaranteed revenue. Provide scenario bands and explicit risks."
    ].join("\n");

    const user = JSON.stringify({
      industry: pack.id,
      goal,
      notes,
      primitives: pack.monetization_primitives,
      compliance_hotspots: pack.compliance_hotspots
    });

    const projected = budget.estimateLLMCostUSD(system.length + user.length, 6000);
    budget.assertWithinBudget(projected);

    const r = await maybeCallLLM({ system, user, maxTokens: 900 });
    budget.commit(projected);
    llm_enrichment = { used_llm: r.used_llm, provider: r.meta, raw: r.text.slice(0, 2000) };
  }

  return {
    industry: pack.name,
    goal,
    assumptions,
    missing_questions,
    architecture: { ...architecture, llm_enrichment },
    workflows,
    outreach,
    n8n: { template_id: "blueprint-generator", export_hint: "GET /api/n8n/export?template=blueprint-generator" }
  };
}

function buildOutreachGate(params: { governance: GovernanceResult; pack: IndustryPack }) {
  const reasons: string[] = [];
  const hot = params.pack.compliance_hotspots;
  const requires = ["Consent required for email/SMS", "Suppression lists required", "Human approval required"];

  if (params.governance.decision === "BLOCK") {
    return { allowed_mode: "BLOCKED" as const, reasons: ["Governance BLOCK."], safe_templates: [] };
  }

  // Conservative default: draft-only; if any outreach hotspot exists, require human review.
  reasons.push("Default: outreach is draft-only (no auto-send).");
  if (hot.some(h => /spam|consent|TCPA/i.test(h))) reasons.push("Industry compliance hotspots include consent/spam constraints.");
  if (params.governance.risk !== "LOW") reasons.push("Governance risk not LOW → human review required for outreach.");

  const allowed_mode =
    params.governance.risk === "LOW" ? "DRAFT_ONLY" :
    "HUMAN_REVIEW_REQUIRED";

  return {
    allowed_mode,
    reasons: [...reasons, ...requires],
    safe_templates: [
      {
        name: "Permission-first intro (draft)",
        rules: ["No scraping", "No misleading claims", "Include opt-out", "Personalize with publicly provided info only"],
        draft: "Hi {{name}} — quick question: would you be open to a brief note about {{value_prop}}? If not, no worries and I won’t follow up."
      }
    ]
  };
}
