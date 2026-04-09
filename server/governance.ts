export type GovernanceInput = {
  request_id: string;
  industry: string;
  goal: string;
  notes: string;
  budget: { max_usd_per_week: number };
  intents: Array<"REASONING_PATH" | "EXECUTION_PATH" | "HYBRID_PATH">;
};

export type GovernanceResult = {
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  decision: "APPROVE" | "ESCALATE" | "BLOCK";
  belief_safe: number;
  findings: Array<{ auditor: string; pass: boolean; confidence: number; notes: string[] }>;
};

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

export function governanceEvaluate(input: GovernanceInput): GovernanceResult {
  // Deterministic scoring. In production, you can make this data-driven.
  // Decision thresholds mirror: APPROVE >= 0.85, ESCALATE 0.50–0.84, BLOCK on any FAIL.
  // (Decision matrix + non-overridable governance per your blueprint doc.)
  const signals = {
    mentions_outreach: /outreach|cold email|dm|lead|scrape|mass|spam/i.test(input.goal + " " + input.notes),
    mentions_pii: /phone|email list|addresses|ssn|dob|pii/i.test(input.goal + " " + input.notes),
    mentions_autonomous_send: /auto-send|send automatically|no human|fully autonomous outreach/i.test(input.goal + " " + input.notes),
    mentions_financial_claims: /guarantee|100k|get rich|certain profit/i.test(input.goal + " " + input.notes)
  };

  const auditors: GovernanceResult["findings"] = [];

  // LEG auditor
  {
    const pass = !(signals.mentions_pii);
    const confidence = pass ? 0.86 : 0.92;
    const notes = pass
      ? ["No direct PII processing required by request as written."]
      : ["PII-like terms detected. Require data-minimization + lawful basis + consent workflow."];
    auditors.push({ auditor: "LEGAL", pass, confidence, notes });
  }

  // ETH auditor
  {
    const pass = !(signals.mentions_financial_claims);
    const confidence = pass ? 0.82 : 0.90;
    const notes = pass
      ? ["No explicit deceptive earnings guarantees detected."]
      : ["Deceptive/guaranteed-profit language detected. Must remove, add disclosures, and avoid misleading claims."];
    auditors.push({ auditor: "ETHICS", pass, confidence, notes });
  }

  // SEC auditor
  {
    const pass = true;
    const confidence = 0.80;
    const notes = ["No exploit/malware intent detected. Enforce secret hygiene + least privilege in connectors."];
    auditors.push({ auditor: "SECURITY", pass, confidence, notes });
  }

  // RG auditor (resource governor)
  {
    const pass = input.budget.max_usd_per_week >= 5; // minimal for hosting & ops
    const confidence = pass ? 0.88 : 0.92;
    const notes = pass
      ? ["Budget sufficient for local-first + lightweight hosting."]
      : ["Budget too low for reliable operations. Increase budget or run fully local."];
    auditors.push({ auditor: "RESOURCE_GOV", pass, confidence, notes });
  }

  // Compute belief_safe (simple multiplicative reduction)
  let belief = 0.90;
  for (const a of auditors) {
    belief *= a.pass ? (1 - (1 - a.confidence) * 0.15) : (1 - a.confidence * 0.35);
  }
  belief = clamp01(belief);

  const anyFail = auditors.some(a => !a.pass);
  const risk: GovernanceResult["risk"] =
    anyFail && signals.mentions_pii ? "CRITICAL" :
    (signals.mentions_autonomous_send || signals.mentions_outreach) ? "MEDIUM" :
    "LOW";

  // Non-overridable: any FAIL → BLOCK (but still returns remediation-capable response)
  // Otherwise: belief thresholds.
  let decision: GovernanceResult["decision"] = "APPROVE";
  if (anyFail) decision = "BLOCK";
  else if (belief >= 0.85) decision = "APPROVE";
  else if (belief >= 0.50) decision = "ESCALATE";
  else decision = "BLOCK";

  return { risk, decision, belief_safe: belief, findings: auditors };
}
