import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGroq, MODEL } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { leagueId, week, matchups } = await req.json();
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check cache
    const cacheKey = `recaps:${leagueId}:${week}`;
    const { data: cached } = await supabase
      .from("cached_content")
      .select("content")
      .eq("key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      return NextResponse.json({ recaps: JSON.parse(cached.content), cached: true });
    }

    // Generate recaps with Groq
    const groq = getGroq();
    const recaps = [];

    for (const matchup of matchups) {
      const prompt = `Write a short, lively recap of this fantasy football matchup for a league:
      ${matchup.team1} (${matchup.team1_score} pts) vs ${matchup.team2} (${matchup.team2_score} pts)
      Week ${week}. Key performers: ${matchup.mvp} with ${matchup.mvp_score} pts.
      Format: title, 2-3 sentence body, mvp, lowlight. Be entertaining, league-focused.`;

      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a witty fantasy football beat reporter covering a league.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 150,
      });

      const content = completion.choices[0]?.message?.content?.trim() || "";
      recaps.push({
        leagueId,
        week,
        matchupId: `${matchup.team1}_vs_${matchup.team2}`,
        title: matchup.team1 + " upsets " + matchup.team2,
        body: content,
        mvp: matchup.mvp,
        lowlight: matchup.team2 + " struggles",
        generatedAt: new Date().toISOString(),
        cached: false,
      });
    }

    // Cache for 24 hours (weekly content)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("cached_content").insert({
      key: cacheKey,
      content: JSON.stringify(recaps),
      expires_at: expiresAt,
    });

    return NextResponse.json({ recaps, cached: false });
  } catch (error) {
    console.error("Recaps error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
