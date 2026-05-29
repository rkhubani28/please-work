import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGroq, MODEL } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { leagueId, week, teams, standings } = await req.json();
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check cache
    const cacheKey = `rankings:${leagueId}:${week}`;
    const { data: cached } = await supabase
      .from("cached_content")
      .select("content")
      .eq("key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      return NextResponse.json({ ranking: JSON.parse(cached.content), cached: true });
    }

    // Generate ranking column with Groq
    const groq = getGroq();
    const standingsText = teams
      .map((t: any, i: number) => `${i + 1}. ${t} (${standings[i]} pts)`)
      .join("\n");

    const prompt = `Write a witty power rankings column for a fantasy football league after week ${week}.
    Current standings:
    ${standingsText}

    Format: title, intro paragraph about the league, then commentary on top 3 teams (2-3 sentences each).
    Be entertaining, reference league drama if possible, keep it under 300 words.`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a sports columnist writing power rankings for a fantasy league.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";

    const ranking = {
      leagueId,
      week,
      title: `Week ${week} Power Rankings`,
      body: content,
      rankings: teams.map((t: string, i: number) => ({
        team: t,
        rank: i + 1,
        commentary: `${t} is ${i < 3 ? "climbing" : "fighting"}`,
      })),
      generatedAt: new Date().toISOString(),
      cached: false,
    };

    // Cache for 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("cached_content").insert({
      key: cacheKey,
      content: JSON.stringify(ranking),
      expires_at: expiresAt,
    });

    return NextResponse.json({ ranking, cached: false });
  } catch (error) {
    console.error("Rankings error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
