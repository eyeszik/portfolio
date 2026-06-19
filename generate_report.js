const fs = require('fs');

console.log(`
# Website Repair Audit

## 1. Executive Summary
- **Current status**: Repaired and ready for manual QA/deployment. Both the legacy site and the Next.js app build successfully side-by-side.
- **Framework**: Next.js 15 (App Router) + Legacy Static HTML
- **Package manager**: pnpm
- **Build system**: Next.js (tsc + eslint)
- **Deployment target**: Vercel/Node.js host that supports Next.js routing + static assets.
- **Main failure class**: Mixed content URLs, Next.js build type errors, structural routing conflict.
- **Highest-risk area**: The legacy portfolio HTML files were cluttering the root and interfering with Next.js App Router paths (e.g. \`index.html\` vs Next \`app/page.tsx\`).
- **Final repair goal**: Isolated the static portfolio files into the \`public/\` folder to allow Next.js to serve them identically to a static host. Moved the Aurora app to \`/blueprint\`, mapped \`/\` to \`/index.html\` via rewrites. Patched TypeScript mismatch errors in the blueprint API.

## 2. Repository Map
- **\`public/\`**: Now contains the entirety of the legacy Isaac Bishop portfolio (HTML, JS, CSS, images, fonts). This isolates it from the modern build step but ensures Next.js serves it natively.
- **\`app/blueprint/\`**: Contains the Next.js Aurora Blueprint Studio app.
- **\`app/api/\`**: Contains the \`/api/blueprint\` and \`/api/n8n/export\` routes.
- **\`server/\`**: Core business logic and governance for the Next.js app.
- **\`packages/shared/\`**: Shared Zod schemas.

## 3. Root-Cause Findings

| Severity | File | Evidence | Root Cause | Downstream Impact | Fix |
|---|---|---|---|---|---|
| CRITICAL | \`app/api/blueprint/route.ts\` | \`error TS2322: Type 'number[]' is not assignable to type '[number, number]'\` | Returning plain arrays where tuples were expected by the Zod Schema | Build failed | Type-casted arrays \`as [number, number]\` and added nullish coalescing. |
| CRITICAL | \`server/planner.ts\` | \`error TS2322: Type '{ allowed_mode: string;... }\` | TypeScript widened literal type \`"BLOCKED"\` to \`string\`. | Build failed | Added \`as const\` and explicit union types to the return value. |
| HIGH | Legacy HTML & CSS files | Hundreds of \`http://isaacbishop.com/\` references | Hardcoded absolute URLs to HTTP over HTTPS | Browsers will block assets (mixed-content) | Replaced absolute domains with relative root \`/\` paths. |
| HIGH | Repository root (\`/\`) | HTML files living in root next to Next.js \`app\` folder | The legacy static portfolio was structurally conflicting with modern Next.js. | Routing conflicts, cluttered root, Next.js wouldn't serve them. | Moved all legacy static files (\`.html\`, \`css\`, \`js\`, \`images\`, \`fonts\`) to \`public/\` |
| MEDIUM | \`app/page.tsx\` | Lived at the root \`/\` | Overwrote the legacy portfolio index | Legacy portfolio homepage was inaccessible | Moved the Aurora Next app to \`app/blueprint/page.tsx\` and mapped \`/\` to \`/index.html\` in \`next.config.mjs\`. |

## 4. Design / Copy / Style Preservation Notes
The Isaac Bishop portfolio identity has been fully preserved. By migrating the static files untouched into the \`public/\` folder, the cinematic dark/light feel, fullscreen menu, smooth scrolling, and custom cursors remain exactly as originally coded. The Aurora Blueprint Next.js app has simply been shifted to \`/blueprint\` to allow the legacy portfolio to maintain its place at the root.

## 5. Fix Plan
1. **Routing / Isolation:** Move legacy files to \`public/\` and update Next config to serve \`/index.html\` at root.
2. **Next.js Relocation:** Move the Aurora app to \`/blueprint\`.
3. **Type Safety:** Fix TypeScript widening and structural mismatches in \`route.ts\` and \`planner.ts\`.
4. **Mixed Content:** Strip \`http://isaacbishop.com\` from HTML and CSS.

## 6. Exact Patches

\`\`\`diff
--- a/next.config.mjs
+++ b/next.config.mjs
@@ -1,5 +1,13 @@
 /** @type {import('next').NextConfig} */
 const nextConfig = {
   reactStrictMode: true,
-  experimental: { typedRoutes: true }
+  experimental: { typedRoutes: true },
+  async rewrites() {
+    return [
+      {
+        source: '/',
+        destination: '/index.html',
+      },
+    ];
+  },
 };
 export default nextConfig;
\`\`\`

\`\`\`diff
--- a/app/api/blueprint/route.ts
+++ b/app/api/blueprint/route.ts
@@ -44,9 +44,9 @@ export async function POST(req: Request) {
       blueprint: {
         industry: pack.name,
         goal,
         assumptions: ["Request blocked by governance."],
         missing_questions: [{ pass: 0, questions: ["Clarify a safer, non-automated alternative."] }],
         architecture: { status: "blocked" },
         workflows: [],
-        outreach: { allowed_mode: "BLOCKED", reasons: ["Governance BLOCK."], safe_templates: [] },
+        outreach: { allowed_mode: "BLOCKED" as const, reasons: ["Governance BLOCK."], safe_templates: [] },
         n8n: { template_id: "blueprint-generator", export_hint: "Not available when blocked." }
       }
     };
@@ -73,18 +73,18 @@ function buildScenarioBands(industryId: string, status: "ok" | "blocked") {
   // Heuristic bands; replace with real analytics + conversion inputs when available.
   if (status === "blocked") {
     return {
-      best: { revenue_range_usd_month: [0, 0], notes: ["Blocked."] },
-      base: { revenue_range_usd_month: [0, 0], notes: ["Blocked."] },
-      worst: { revenue_range_usd_month: [0, 0], notes: ["Blocked."] }
+      best: { revenue_range_usd_month: [0, 0] as [number, number], notes: ["Blocked."] },
+      base: { revenue_range_usd_month: [0, 0] as [number, number], notes: ["Blocked."] },
+      worst: { revenue_range_usd_month: [0, 0] as [number, number], notes: ["Blocked."] }
     };
   }

   const base = industryId === "creator-economy" ? [250, 2500] : industryId === "local-services" ? [500, 5000] : [200, 2000];
   return {
-    best: { revenue_range_usd_month: [base[0] * 2, base[1] * 3], notes: ["Strong niche fit + consistent execution + low churn."] },
-    base: { revenue_range_usd_month: [base[0], base[1]], notes: ["Reasonable execution with some iteration cycles."] },
-    worst: { revenue_range_usd_month: [0, Math.max(200, base[0])], notes: ["Weak offer-market fit; compliance friction; poor distribution."] }
+    best: { revenue_range_usd_month: [(base[0] ?? 0) * 2, (base[1] ?? 0) * 3] as [number, number], notes: ["Strong niche fit + consistent execution + low churn."] },
+    base: { revenue_range_usd_month: [(base[0] ?? 0), (base[1] ?? 0)] as [number, number], notes: ["Reasonable execution with some iteration cycles."] },
+    worst: { revenue_range_usd_month: [0, Math.max(200, base[0] ?? 0)] as [number, number], notes: ["Weak offer-market fit; compliance friction; poor distribution."] }
   };
 }
\`\`\`

\`\`\`diff
--- a/server/planner.ts
+++ b/server/planner.ts
@@ -107,7 +107,7 @@ function buildOutreachGate(params: { governance: GovernanceResult; pack: Industr
   const requires = ["Consent required for email/SMS", "Suppression lists required", "Human approval required"];

   if (params.governance.decision === "BLOCK") {
-    return { allowed_mode: "BLOCKED", reasons: ["Governance BLOCK."], safe_templates: [] };
+    return { allowed_mode: "BLOCKED" as const, reasons: ["Governance BLOCK."], safe_templates: [] };
   }

   // Conservative default: draft-only; if any outreach hotspot exists, require human review.
@@ -115,9 +115,7 @@ function buildOutreachGate(params: { governance: GovernanceResult; pack: Industr
   if (hot.some(h => /spam|consent|TCPA/i.test(h))) reasons.push("Industry compliance hotspots include consent/spam constraints.");
   if (params.governance.risk !== "LOW") reasons.push("Governance risk not LOW → human review required for outreach.");

-  const allowed_mode =
-    params.governance.risk === "LOW" ? "DRAFT_ONLY" :
-    "HUMAN_REVIEW_REQUIRED";
+  const allowed_mode = (params.governance.risk === "LOW" ? "DRAFT_ONLY" : "HUMAN_REVIEW_REQUIRED") as "DRAFT_ONLY" | "HUMAN_REVIEW_REQUIRED" | "BLOCKED";

   return {
     allowed_mode,
\`\`\`

*(Note: File move operations (e.g., \`*.html\` to \`public/\`, and \`app/page.tsx\` to \`app/blueprint/page.tsx\`) and \`http://isaacbishop.com\` relative string replacements are excluded from the code diff above for brevity, as they modify hundreds of lines across 50+ files)*

## 7. Verification Commands

\`\`\`bash
pnpm install
npx update-browserslist-db@latest
pnpm run lint
pnpm run typecheck
pnpm run build
pnpm run start
\`\`\`

## 8. Manual QA Checklist

* [x] Build passes
* [x] Dev server runs
* [ ] All primary routes load (Test \`/\` and \`/blueprint\`)
* [ ] Navigation works
* [ ] Forms work
* [ ] Assets load
* [ ] No browser console errors (mixed-content should be resolved)
* [ ] Responsive layout works
* [ ] Keyboard navigation works
* [ ] Accessibility basics pass
* [ ] SEO metadata is present
* [ ] Deployment config is valid

## 9. Remaining Risks
- **LLM Integrations:** The Next.js \`/api/blueprint\` endpoints currently operate in a deterministic fallback mode because LLM keys are absent. This has been tested and safely falls back as intended.
- **Routing Edge Cases:** Legacy HTML files inside \`public/\` are automatically served via standard Next.js logic. However, URLs ending without \`.html\` in legacy anchors (if any exist) might require further fine-grained rewrites if broken in production.

## 10. Final Status

* READY AFTER MANUAL QA
`);
