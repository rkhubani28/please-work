import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGroq, MODEL } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { leagueId, week } = await req.json();
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check cache first
    const cacheKey = `projections:${leagueId}:${week}`;
    const { data: cached } = await supabase
      .from("cached_content")
      .select("content")
      .eq("key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      return NextResponse.json({ projections: JSON.parse(cached.content), cached: true });
    }

    // Fetch league & rosters
    const { data: league } = await supabase
      .from("leagues")
      .select("*")
      .eq("id", leagueId)
      .eq("user_id", user.id)
      .single();

    if (!league) return NextResponse.json({ error: "League not found" }, { status: 404 });

    const { data: rosters } = await supabase
      .from("rosters")
      .select("*")
      .eq("league_id", leagueId);

    // Mock projections for now (in production: nflverse data)
    const mockPlayers = [
      { id: "1", name: "Patrick Mahomes", pos: "QB", team: "KC", opponent: "PIT" },
      { id: "2", name: "Travis Kelce", pos: "TE", team: "KC", opponent: "PIT" },
      { id: "3", name: "Christian McCaffrey", pos: "RB", team: "SF", opponent: "GB" },
    ];

    const projections = mockPlayers.map((p, idx) => ({
      leagueId,
      week,
      playerId: p.id,
      playerName: p.name,
      position: p.pos,
      nflTeam: p.team,
      opponent: p.opponent,
      projectedPoints: Math.round((Math.random() * 30 + 5) * 10) / 10,
      rank: idx + 1,
      confidence: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
      analysis: `${p.name} is facing ${p.opponent} this week with a favorable matchup.`,
      source: "open",
    }));

    // Cache for 6 hours
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
    await supabase.from("cached_content").insert({
      key: cacheKey,
      content: JSON.stringify(projections),
      expires_at: expiresAt,
    });

    return NextResponse.json({ projections, cached: false });
  } catch (error) {
    console.error("Projections error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
