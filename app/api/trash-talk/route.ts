import { getGroq, MODEL } from "@/lib/groq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { opponent } = await req.json();

  const completion = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a savage but funny fantasy football trash talker. Write ONE short, witty trash talk line (2-3 sentences max) aimed at the opponent. Keep it sports-focused, funny, and PG-13. No emojis. No quotes around the output.",
      },
      {
        role: "user",
        content: opponent
          ? `Write trash talk targeting my opponent: ${opponent}`
          : "Write general fantasy football trash talk targeting my league opponent this week.",
      },
    ],
    temperature: 1.0,
    max_tokens: 120,
  });

  const line = completion.choices[0]?.message?.content?.trim() ?? "";
  return NextResponse.json({ line });
}
