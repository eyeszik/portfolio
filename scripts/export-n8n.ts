import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

async function main() {
  const templateName = "blueprint-generator";
  const src = path.join(process.cwd(), "n8n", "workflows", `${templateName}.json`);
  const outDir = path.join(process.cwd(), "dist", "n8n");
  const out = path.join(outDir, `${templateName}.stamped.json`);

  const raw = await readFile(src, "utf8");
  const j = JSON.parse(raw);

  // Example stamping (extend as needed)
  j.name = "Blueprint Generator (Stamped)";
  j.versionId = `stamped-${Date.now()}`;

  await mkdir(outDir, { recursive: true });
  await writeFile(out, JSON.stringify(j, null, 2), "utf8");

  console.log(`Wrote: ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
