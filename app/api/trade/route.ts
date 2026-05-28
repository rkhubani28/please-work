import { getGroq, MODEL } from "@/lib/groq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { give, receive } = await req.json();

  if (!give?.trim() || !receive?.trim()) {
    return NextResponse.json({ error: "Both sides of the trade are required." }, { status: 400 });
  }

  const completion = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an expert fantasy football analyst. Analyze trades concisely. Give a verdict (Accept / Decline / Neutral), a short explanation of the value on each side, and a 1-sentence recommendation. Format:\nVerdict: <Accept|Decline|Neutral>\nYou Give: <analysis>\nYou Receive: <analysis>\nRecommendation: <sentence>",
      },
      {
        role: "user",
        content: `Analyze this fantasy football trade.\nI give: ${give}\nI receive: ${receive}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  const text = completion.choices[0]?.message?.content?.trim() ?? "";
  return NextResponse.json({ analysis: text });
}
