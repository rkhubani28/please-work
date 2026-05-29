import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGroq, MODEL } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { leagueId, week, give, receive } = await req.json();
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Generate trade analysis with Groq
    const groq = getGroq();
    const prompt = `Analyze this fantasy football trade for week ${week}:
    You give: ${give.join(", ")}
    You receive: ${receive.join(", ")}

    Provide a verdict (Accept/Decline/Neutral) and brief reasoning (2-3 sentences). Format as:
    Verdict: [Accept/Decline/Neutral]
    Reasoning: [explanation]`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a fantasy football trade analyst. Provide clear, unbiased trade verdicts.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";
    const verdictMatch = content.match(/Verdict:\s*(Accept|Decline|Neutral)/i);
    const verdict = (verdictMatch?.[1]?.toLowerCase() || "neutral") as "accept" | "decline" | "neutral";

    const analysis = {
      leagueId,
      week,
      userId: user.id,
      give,
      receive,
      verdict,
      reasoning: content,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Trade analysis error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
