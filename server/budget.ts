export class BudgetGovernor {
  private maxWeek: number;
  private maxMonth: number;
  private llmEnabled: boolean;
  private spentWeek = 0;
  private spentMonth = 0;

  constructor(opts: { max_usd_per_week: number; max_usd_per_month: number; llm_enabled: boolean }) {
    this.maxWeek = opts.max_usd_per_week;
    this.maxMonth = opts.max_usd_per_month;
    this.llmEnabled = opts.llm_enabled;
  }

  canUseLLM() { return this.llmEnabled; }

  // Very conservative placeholder estimator; in production: use provider pricing tables + token counts.
  estimateLLMCostUSD(inputChars: number, outputChars: number) {
    // Default: assume $0.20 / 1M chars (rough heuristic). Tune per provider.
    const unit = 0.20 / 1_000_000;
    return (inputChars + outputChars) * unit;
  }

  assertWithinBudget(projectedCostUSD: number) {
    if ((this.spentWeek + projectedCostUSD) > this.maxWeek) {
      throw new Error(`BudgetGovernor: projected weekly cost exceeds cap (${this.maxWeek}).`);
    }
    if ((this.spentMonth + projectedCostUSD) > this.maxMonth) {
      throw new Error(`BudgetGovernor: projected monthly cost exceeds cap (${this.maxMonth}).`);
    }
  }

  commit(costUSD: number) {
    this.spentWeek += costUSD;
    this.spentMonth += costUSD;
  }
}
