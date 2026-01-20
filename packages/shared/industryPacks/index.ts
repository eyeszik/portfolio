export type IndustryPack = {
  id: string;
  name: string;
  monetization_primitives: string[];
  typical_channels: string[];
  default_kpis: string[];
  compliance_hotspots: string[];
};

export const industryPacks: IndustryPack[] = [
  {
    id: "creator-economy",
    name: "Creator economy",
    monetization_primitives: [
      "Affiliate content engine (SEO + short-form repurposing)",
      "Digital product funnel (lead magnet → email → offer)",
      "Sponsored placements (after baseline traction)"
    ],
    typical_channels: ["YouTube", "TikTok", "Instagram", "Email", "Blog/SEO"],
    default_kpis: ["CTR", "CVR", "RPM", "Subscriber growth", "CAC:LTV"],
    compliance_hotspots: ["copyright", "endorsement disclosures", "spam/unsolicited outreach"]
  },
  {
    id: "local-services",
    name: "Local services",
    monetization_primitives: [
      "Local lead capture + booking pipeline",
      "Review generation loop (post-service)",
      "Upsell automation (maintenance plans)"
    ],
    typical_channels: ["Google Business Profile", "Local SEO", "SMS (opt-in)", "Email"],
    default_kpis: ["Call-to-book rate", "No-show rate", "Review velocity", "Cost per lead"],
    compliance_hotspots: ["TCPA/SMS consent", "spam", "PII handling"]
  },
  {
    id: "general",
    name: "General",
    monetization_primitives: [
      "Content → lead capture → consult/offer",
      "Marketplace arbitrage (where permitted)",
      "Micro-SaaS automation (niche ops)"
    ],
    typical_channels: ["Email", "SEO", "Paid ads (if budget allows)"],
    default_kpis: ["Lead quality", "Conversion rate", "Churn"],
    compliance_hotspots: ["outreach compliance", "data privacy"]
  }
];

export function getIndustryPack(id: string): IndustryPack {
  return industryPacks.find(p => p.id === id) ?? industryPacks.find(p => p.id === "general")!;
}
