import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template") ?? "blueprint-generator";

  const p = path.join(process.cwd(), "n8n", "workflows", `${template}.json`);
  const json = await readFile(p, "utf8").catch(() => null);
  if (!json) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  return new NextResponse(json, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${template}.json"`
    }
  });
}
