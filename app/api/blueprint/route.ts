import { NextResponse } from "next/server";
import { BlueprintResponse, type BlueprintResponseT } from "@shared/schema";
import { getIndustryPack } from "@shared/industryPacks";
import { governanceEvaluate, type GovernanceInput } from "@/server/governance";
import { buildBlueprint } from "@/server/planner";
import { BudgetGovernor } from "@/server/budget";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const industry = String(body.industry ?? "general");
  const goal = String(body.goal ?? "");
  const notes = String(body.notes ?? "");
  const maxUsdPerWeek = Number(body?.budget?.max_usd_per_week ?? 15);

  if (!goal || goal.trim().length < 8) return NextResponse.json({ error: "Goal is too short" }, { status: 400 });
  if (!Number.isFinite(maxUsdPerWeek) || maxUsdPerWeek <= 0) return NextResponse.json({ error: "Invalid budget" }, { status: 400 });

  const request_id = crypto.randomUUID();
  const pack = getIndustryPack(industry);

  // Budget governor (LLM calls optional; deterministic fallback)
  const budget = new BudgetGovernor({
    max_usd_per_week: maxUsdPerWeek,
    max_usd_per_month: Number(process.env.MAX_USD_PER_MONTH ?? 60),
    llm_enabled: (process.env.LLM_ENABLED ?? "false") === "true"
  });

  const governanceIn: GovernanceInput = {
    request_id,
    industry: pack.id,
    goal,
    notes,
    budget: { max_usd_per_week: maxUsdPerWeek },
    intents: ["EXECUTION_PATH", "HYBRID_PATH"] // conservative: assume it will generate actionable automation
  };

  const governance = governanceEvaluate(governanceIn);

  // Hard-block critical
  if (governance.decision === "BLOCK") {
    const resp: BlueprintResponseT = {
      request_id,
      governance,
      scenario_bands: buildScenarioBands(pack.id, "blocked"),
      blueprint: {
        industry: pack.name,
        goal,
        assumptions: ["Request blocked by governance."],
        missing_questions: [{ pass: 0, questions: ["Clarify a safer, non-automated alternative."] }],
        architecture: { status: "blocked" },
        workflows: [],
        outreach: { allowed_mode: "BLOCKED", reasons: ["Governance BLOCK."], safe_templates: [] },
        n8n: { template_id: "blueprint-generator", export_hint: "Not available when blocked." }
      }
    };
    return NextResponse.json(resp, { status: 200 });
  }

  // Build blueprint (5-pass). If escalated, still produce “draft” with explicit cautions.
  const blueprint = await buildBlueprint({
    request_id,
    pack,
    goal,
    notes,
    budget,
    governance
  });

  const resp: BlueprintResponseT = {
    request_id,
    governance,
    scenario_bands: buildScenarioBands(pack.id, "ok"),
    blueprint
  };

  // Validate output shape (hard correctness gate)
  const parsed = BlueprintResponse.safeParse(resp);
  if (!parsed.success) {
    return NextResponse.json({ error: "Internal validation error", issues: parsed.error.issues }, { status: 500 });
  }

  return NextResponse.json(resp, { status: 200 });
}

function buildScenarioBands(industryId: string, status: "ok" | "blocked") {
  // Heuristic bands; replace with real analytics + conversion inputs when available.
  if (status === "blocked") {
    return {
      best: { revenue_range_usd_month: [0, 0], notes: ["Blocked."] },
      base: { revenue_range_usd_month: [0, 0], notes: ["Blocked."] },
      worst: { revenue_range_usd_month: [0, 0], notes: ["Blocked."] }
    };
  }

  const base = industryId === "creator-economy" ? [250, 2500] : industryId === "local-services" ? [500, 5000] : [200, 2000];
  return {
    best: { revenue_range_usd_month: [base[0] * 2, base[1] * 3], notes: ["Strong niche fit + consistent execution + low churn."] },
    base: { revenue_range_usd_month: [base[0], base[1]], notes: ["Reasonable execution with some iteration cycles."] },
    worst: { revenue_range_usd_month: [0, Math.max(200, base[0])], notes: ["Weak offer-market fit; compliance friction; poor distribution."] }
  };
}
