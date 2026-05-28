import { getGroq, MODEL } from "@/lib/groq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { teams } = await req.json();

  const teamList = teams
    .map((t: { rank: number; name: string; record: string; pts: number }) =>
      `#${t.rank} ${t.name} (${t.record}, ${t.pts} pts)`
    )
    .join("\n");

  const completion = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a sharp fantasy football analyst. Given power rankings, write a brief (4-5 sentence) analysis of the current standings — who's hot, who's struggling, any notable matchups ahead. Be direct and opinionated. No emojis.",
      },
      {
        role: "user",
        content: `Current fantasy football power rankings:\n${teamList}\n\nWrite a power rankings analysis.`,
      },
    ],
    temperature: 0.75,
    max_tokens: 250,
  });

  const analysis = completion.choices[0]?.message?.content?.trim() ?? "";
  return NextResponse.json({ analysis });
}
