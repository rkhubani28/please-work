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

    const cacheKey = `headlines:${leagueId}:${week}`;
    const { data: cached } = await supabase
      .from("cached_content")
      .select("content")
      .eq("key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      return NextResponse.json({ headlines: JSON.parse(cached.content), cached: true });
    }

    const groq = getGroq();
    const matchupText = (matchups || [])
      .map((m: any) => `${m.team1} (${m.team1_score}) vs ${m.team2} (${m.team2_score})`)
      .join("\n");

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a fantasy sports headline writer. Write punchy, sports-page style headlines.",
        },
        {
          role: "user",
          content: `Write 5 short, punchy fantasy football headlines for week ${week}.
Matchups:
${matchupText || "Several competitive matchups this week."}

Format as JSON array: [{ "text": "...", "priority": "high" | "medium" | "low" }]
Headlines should be sports-page style — dramatic, concise, compelling.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";
    let headlines: any[] = [];
    try {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) headlines = JSON.parse(match[0]);
    } catch {
      headlines = content.split("\n").filter(Boolean).slice(0, 5).map((h, i) => ({
        text: h.replace(/^[\d\-\.\*\s]+/, ""),
        priority: i === 0 ? "high" : "medium",
      }));
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("cached_content").insert({
      key: cacheKey,
      content: JSON.stringify(headlines),
      expires_at: expiresAt,
    });

    return NextResponse.json({ headlines, cached: false });
  } catch (err) {
    console.error("Headlines error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
