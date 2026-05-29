import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGroq, MODEL } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { leagueId, week, teams } = await req.json();
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cacheKey = `awards:${leagueId}:${week}`;
    const { data: cached } = await supabase
      .from("cached_content")
      .select("content")
      .eq("key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      return NextResponse.json({ awards: JSON.parse(cached.content), cached: true });
    }

    const groq = getGroq();
    const teamsText = (teams || []).map((t: any) => `${t.name}: ${t.score} pts`).join("\n");

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a fantasy football league commissioner handing out weekly awards. Be creative and funny.",
        },
        {
          role: "user",
          content: `Generate 4 weekly awards for a fantasy football league after week ${week}.
Teams and scores:
${teamsText || "Various teams competed this week."}

Awards to give:
1. Manager of the Week (highest scorer)
2. Hard Luck Award (highest losing scorer)
3. Floor Dweller (lowest scorer)
4. One wild card award (your choice — be creative)

Format each award as: { "title": "...", "winner": "...", "description": "..." } in a JSON array.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 400,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";
    let awards: any[] = [];
    try {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) awards = JSON.parse(match[0]);
    } catch {
      awards = [
        { title: "Manager of the Week", winner: teams?.[0]?.name || "Top team", description: content },
      ];
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("cached_content").insert({
      key: cacheKey,
      content: JSON.stringify(awards),
      expires_at: expiresAt,
    });

    return NextResponse.json({ awards, cached: false });
  } catch (err) {
    console.error("Awards error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
