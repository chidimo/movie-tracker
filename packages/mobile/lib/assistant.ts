const assistantUrl = process.env.EXPO_PUBLIC_ASSISTANT_URL;

export async function getAssistantQuery(prompt: string): Promise<string | null> {
  if (!assistantUrl) return null;

  try {
    const res = await fetch(assistantUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { query?: string };
    return typeof data.query === "string" ? data.query : null;
  } catch {
    return null;
  }
}
