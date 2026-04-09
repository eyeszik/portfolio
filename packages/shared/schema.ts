import { z } from "zod";

export const IndustryId = z.string().min(1).max(64);

export const GovernanceDecision = z.object({
  risk: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  decision: z.enum(["APPROVE", "ESCALATE", "BLOCK"]),
  belief_safe: z.number().min(0).max(1),
  findings: z.array(z.object({
    auditor: z.string(),
    pass: z.boolean(),
    confidence: z.number().min(0).max(1),
    notes: z.array(z.string())
  }))
});

export const ScenarioBands = z.object({
  best: z.object({ revenue_range_usd_month: z.tuple([z.number(), z.number()]), notes: z.array(z.string()) }),
  base: z.object({ revenue_range_usd_month: z.tuple([z.number(), z.number()]), notes: z.array(z.string()) }),
  worst: z.object({ revenue_range_usd_month: z.tuple([z.number(), z.number()]), notes: z.array(z.string()) })
});

export const Blueprint = z.object({
  industry: z.string(),
  goal: z.string(),
  assumptions: z.array(z.string()),
  missing_questions: z.array(z.object({ pass: z.number().int().min(0).max(5), questions: z.array(z.string()) })),
  architecture: z.unknown(),
  workflows: z.array(z.unknown()),
  outreach: z.object({
    allowed_mode: z.enum(["DRAFT_ONLY", "HUMAN_REVIEW_REQUIRED", "BLOCKED"]),
    reasons: z.array(z.string()),
    safe_templates: z.array(z.unknown())
  }),
  n8n: z.object({ template_id: z.string(), export_hint: z.string() })
});

export const BlueprintResponse = z.object({
  request_id: z.string(),
  governance: GovernanceDecision,
  scenario_bands: ScenarioBands,
  blueprint: Blueprint
});

export type BlueprintResponseT = z.infer<typeof BlueprintResponse>;
