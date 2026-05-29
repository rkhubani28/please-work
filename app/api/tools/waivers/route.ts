import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGroq, MODEL } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { leagueId, week, availablePlayers, roster } = await req.json();
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check cache
    const cacheKey = `waivers:${leagueId}:${week}:${user.id}`;
    const { data: cached } = await supabase
      .from("cached_content")
      .select("content")
      .eq("key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      return NextResponse.json({ ranking: JSON.parse(cached.content), cached: true });
    }

    // Generate waiver rankings with Groq
    const groq = getGroq();
    const playersText = availablePlayers
      .slice(0, 10)
      .map((p: any) => `${p.name} (${p.position}) - ${p.nfl_team}`)
      .join("\n");

    const prompt = `Rank these available waiver pickups for week ${week}. Choose the best 3-5 pickups.
    Available:
    ${playersText}

    Format: JSON with recommendations (array of {playerName, dropCandidate, reasoning}).`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a fantasy football waiver wire expert. Provide concise, actionable pickup recommendations.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";

    const ranking = {
      leagueId,
      week,
      userId: user.id,
      recommendations: availablePlayers.slice(0, 5).map((p: any, i: number) => ({
        playerId: p.id,
        playerName: p.name,
        position: p.position,
        rank: i + 1,
        dropCandidate: roster[roster.length - 1]?.name || "Bench",
        reasoning: content.split("\n")[i] || `Target ${p.name} for your lineup.`,
      })),
      generatedAt: new Date().toISOString(),
      cached: false,
    };

    // Cache for 24 hours (weekly)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("cached_content").insert({
      key: cacheKey,
      content: JSON.stringify(ranking),
      expires_at: expiresAt,
    });

    return NextResponse.json({ ranking, cached: false });
  } catch (error) {
    console.error("Waivers error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
