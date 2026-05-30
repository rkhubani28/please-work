import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username?.trim()) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    // Sleeper public API — no OAuth needed
    const userRes = await fetch(`https://api.sleeper.app/v1/user/${username.trim()}`);
    if (!userRes.ok) {
      return NextResponse.json({ error: "Sleeper user not found" }, { status: 404 });
    }
    const sleeperUser = await userRes.json();
    if (!sleeperUser?.user_id) {
      return NextResponse.json({ error: "Sleeper user not found" }, { status: 404 });
    }

    const year = new Date().getFullYear();
    const leaguesRes = await fetch(
      `https://api.sleeper.app/v1/user/${sleeperUser.user_id}/leagues/nfl/${year}`
    );
    const sleeperLeagues = leaguesRes.ok ? await leaguesRes.json() : [];

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check for duplicate Sleeper account connections
    // If any of these leagues already exist for a different user, reject
    if (sleeperLeagues.length > 0) {
      const { data: existingLeagues } = await supabase
        .from("leagues")
        .select("user_id, platform_league_id")
        .eq("platform", "sleeper")
        .in(
          "platform_league_id",
          sleeperLeagues.map((l: any) => l.league_id)
        );

      const conflictingLeague = existingLeagues?.find((l: any) => l.user_id !== user.id);
      if (conflictingLeague) {
        return NextResponse.json(
          { error: "This Sleeper account is already connected to another SportsHQ account" },
          { status: 409 }
        );
      }
    }

    // Upsert each league into the leagues table
    const upserts = (sleeperLeagues || []).map((league: any) => ({
      user_id: user.id,
      platform: "sleeper",
      platform_league_id: league.league_id,
      league_name: league.name,
      sport: "nfl",
      year,
      settings: {
        scoringFormat: league.scoring_settings?.rec === 1 ? "ppr" : league.scoring_settings?.rec === 0.5 ? "half-ppr" : "std",
        rosterSize: league.roster_positions?.length || 15,
        benchSize: 0,
        maxTeams: league.total_rosters || 12,
      },
    }));

    if (upserts.length > 0) {
      await supabase.from("leagues").upsert(upserts, {
        onConflict: "user_id,platform,platform_league_id",
      });
    }

    // Store sleeper user_id in metadata
    await supabase.auth.updateUser({
      data: { sleeper_user_id: sleeperUser.user_id, sleeper_username: username.trim() },
    });

    return NextResponse.json({
      connected: true,
      leagueCount: sleeperLeagues?.length || 0,
      leagues: (sleeperLeagues || []).map((l: any) => ({ id: l.league_id, name: l.name })),
    });
  } catch (err) {
    console.error("Sleeper connect error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
