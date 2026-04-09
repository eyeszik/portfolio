type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export async function maybeCallLLM(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<{ used_llm: boolean; text: string; meta: any }> {
  const provider = process.env.LLM_PROVIDER ?? "disabled";
  const enabled = (process.env.LLM_ENABLED ?? "false") === "true";
  if (!enabled || provider === "disabled") {
    return { used_llm: false, text: "", meta: { provider: "disabled" } };
  }

  if (provider === "openai_compatible") {
    const base = process.env.LLM_BASE_URL!;
    const key = process.env.LLM_API_KEY!;
    const model = process.env.LLM_MODEL ?? "gpt-4.1-mini";
    const url = base.replace(/\/$/, "") + "/chat/completions";

    const body = {
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user }
      ] as ChatMsg[],
      max_tokens: params.maxTokens ?? 1200
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "authorization": `Bearer ${key}` },
      body: JSON.stringify(body)
    });

    if (!r.ok) throw new Error(`LLM(openai_compatible) HTTP ${r.status}`);
    const j = await r.json();
    const text = j?.choices?.[0]?.message?.content ?? "";
    return { used_llm: true, text, meta: { provider, model } };
  }

  if (provider === "ollama") {
    const base = process.env.LLM_BASE_URL!;
    const model = process.env.LLM_MODEL ?? "llama3.1:8b-instruct";
    const url = base.replace(/\/$/, "") + "/api/chat";

    const body = {
      model,
      stream: false,
      options: { temperature: 0.2 },
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user }
      ]
    };

    const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`LLM(ollama) HTTP ${r.status}`);
    const j = await r.json();
    const text = j?.message?.content ?? "";
    return { used_llm: true, text, meta: { provider, model } };
  }

  return { used_llm: false, text: "", meta: { provider: "unknown" } };
}
