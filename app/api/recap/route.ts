import { getGroq, MODEL } from "@/lib/groq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { week, result, score, opponent, mvp } = await req.json();

  const completion = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a witty fantasy football beat reporter. Write a short (3-4 sentence) recap of the matchup in an entertaining, sports-journalism style. Be specific about the numbers. No emojis.",
      },
      {
        role: "user",
        content: `Write a recap for ${week}. Result: ${result === "W" ? "Win" : "Loss"}, Score: ${score}, Opponent: ${opponent}, Top performer: ${mvp}.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 200,
  });

  const summary = completion.choices[0]?.message?.content?.trim() ?? "";
  return NextResponse.json({ summary });
}
