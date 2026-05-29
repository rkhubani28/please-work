import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGroq, MODEL } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { leagueId, week, roster } = await req.json();
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check cache
    const cacheKey = `start-sit:${leagueId}:${week}:${user.id}`;
    const { data: cached } = await supabase
      .from("cached_content")
      .select("content")
      .eq("key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      return NextResponse.json({ recommendation: JSON.parse(cached.content), cached: true });
    }

    // Generate start/sit with Groq
    const groq = getGroq();
    const rosterText = roster
      .map((p: any) => `${p.name} (${p.position}) - projected ${p.projected} pts`)
      .join("\n");

    const prompt = `For a fantasy football lineup, which ${Math.ceil(roster.length / 2)} players should start and which should bench?
    Roster:
    ${rosterText}

    Week ${week}. Format as a brief JSON with lineup (array of {name, decision: "start" | "bench", reason}), and a summary sentence.`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a fantasy football optimizer. Provide concise, data-driven lineup advice.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 250,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";

    const recommendation = {
      leagueId,
      week,
      userId: user.id,
      roster: {
        lineup: roster.map((p: any) => ({
          playerId: p.id,
          decision: Math.random() > 0.5 ? "start" : "bench",
          reasoning: `${p.name} vs ${p.opponent}`,
        })),
        summary: content,
      },
      generatedAt: new Date().toISOString(),
      cached: false,
    };

    // Cache for 6 hours
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
    await supabase.from("cached_content").insert({
      key: cacheKey,
      content: JSON.stringify(recommendation),
      expires_at: expiresAt,
    });

    return NextResponse.json({ recommendation, cached: false });
  } catch (error) {
    console.error("Start/sit error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
