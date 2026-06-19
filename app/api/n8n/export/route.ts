import { NextResponse } from "next/server";
import blueprintGenerator from "@/n8n/workflows/blueprint-generator.json";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template") ?? "blueprint-generator";

  if (template !== "blueprint-generator") {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const json = JSON.stringify(blueprintGenerator, null, 2);

  return new NextResponse(json, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${template}.json"`
    }
  });
}
