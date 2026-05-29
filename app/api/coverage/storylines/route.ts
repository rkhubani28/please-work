import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGroq, MODEL } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { leagueId, season, teams, standings } = await req.json();
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cacheKey = `storylines:${leagueId}:${season}`;
    const { data: cached } = await supabase
      .from("cached_content")
      .select("content")
      .eq("key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      return NextResponse.json({ storylines: JSON.parse(cached.content), cached: true });
    }

    const groq = getGroq();
    const standingsText = (standings || teams || [])
      .map((t: any, i: number) => `${i + 1}. ${t.name || t} (${t.record || ""} ${t.pts || ""} pts)`)
      .join("\n");

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a sports journalist covering a fantasy football league all season. You write compelling narrative arcs and storylines.",
        },
        {
          role: "user",
          content: `Write 3 compelling season storylines for this fantasy football league.
Current standings:
${standingsText || "A competitive league with various teams."}

For each storyline include: a title, the narrative (2-3 sentences), and the teams involved.
Format as JSON array: [{ "title": "...", "body": "...", "teams": ["team1", "team2"] }]`,
        },
      ],
      temperature: 0.9,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";
    let storylines: any[] = [];
    try {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) storylines = JSON.parse(match[0]);
    } catch {
      storylines = [{ title: "Season Arc", body: content, teams: [] }];
    }

    // Cache for 6 hours (storylines are less time-sensitive)
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
    await supabase.from("cached_content").insert({
      key: cacheKey,
      content: JSON.stringify(storylines),
      expires_at: expiresAt,
    });

    return NextResponse.json({ storylines, cached: false });
  } catch (err) {
    console.error("Storylines error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
