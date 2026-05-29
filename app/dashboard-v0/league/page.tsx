"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { PLANS, TIERS, getPlanContent, getPlanAnalytics } from "@/lib/pricing";
import type { PlanType, TierType } from "@/lib/types";

export default function LeaguePage() {
  const searchParams = useSearchParams();
  const leagueId = searchParams.get("id");
  const planParam = (searchParams.get("plan") as PlanType) || "double";
  const tierParam = (searchParams.get("tier") as TierType) || "all-access";

  const [league, setLeague] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "recaps" | "tools">("overview");
  const [week, setWeek] = useState(1);

  useEffect(() => {
    const fetchLeague = async () => {
      if (!leagueId) return;
      const supabase = createClient();
      const { data } = await supabase.from("leagues").select("*").eq("id", leagueId).single();
      setLeague(data);
    };
    fetchLeague();
  }, [leagueId]);

  if (!league) {
    return <div className="min-h-screen bg-obsidian-900 text-on-surface p-8">Loading...</div>;
  }

  const planContent = getPlanContent(planParam);
  const planAnalytics = getPlanAnalytics(planParam);

  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 glass-blur sticky top-0 z-40 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{league.league_name}</h1>
              <p className="text-on-surface-variant">{league.platform} • {league.year}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-on-surface-variant">{PLANS[planParam].name}</p>
              <p className="font-bold text-football-cyan">{TIERS[tierParam].name}</p>
            </div>
          </div>

          {/* Week selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-bold">Week:</label>
            <input
              type="number"
              min={1}
              max={18}
              value={week}
              onChange={(e) => setWeek(parseInt(e.target.value))}
              className="w-16 rounded-lg border border-white/10 bg-black px-3 py-2 text-on-surface"
            />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/10 sticky top-20 z-30 bg-obsidian-900/90 glass-blur">
        <div className="max-w-6xl mx-auto flex">
          {["overview", "recaps", "tools"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-4 font-bold uppercase text-sm transition border-b-2 ${
                activeTab === tab
                  ? "border-football-cyan text-football-cyan"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab === "overview" && "Overview"}
              {tab === "recaps" && "Coverage"}
              {tab === "tools" && "Tools"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-8">
        {activeTab === "overview" && <OverviewTab league={league} week={week} planContent={planContent} />}
        {activeTab === "recaps" && planContent.includes("recap") && <RecapsTab leagueId={leagueId!} week={week} />}
        {activeTab === "tools" && (
          <ToolsTab leagueId={leagueId!} week={week} available={planAnalytics} />
        )}
        {activeTab === "recaps" && !planContent.includes("recap") && <LockedFeature feature="Coverage" />}
        {activeTab === "tools" && planAnalytics.length === 0 && <LockedFeature feature="Tools" />}
      </div>
    </div>
  );
}

function OverviewTab({ league, week, planContent }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur">
        <h2 className="text-2xl font-bold mb-4">What you get</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-football-cyan">Coverage</h3>
            <ul className="mt-1 text-sm text-on-surface-variant space-y-1">
              {planContent.includes("recap") && <li>✓ Weekly recaps</li>}
              {planContent.includes("ranking-columns") && <li>✓ Ranking columns</li>}
              {planContent.includes("storylines") && <li>✓ Storylines</li>}
              {planContent.includes("awards") && <li>✓ Weekly awards</li>}
              {planContent.includes("headlines") && <li>✓ Headlines</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur">
        <h2 className="text-2xl font-bold mb-4">This week</h2>
        <p className="text-on-surface-variant mb-4">Week {week} content and recommendations</p>
        <button className="w-full rounded-xl bg-football-cyan px-4 py-3 font-bold text-obsidian-900 transition hover:bg-football-cyan/80">
          Generate content
        </button>
      </div>
    </div>
  );
}

function RecapsTab({ leagueId, week }: any) {
  const [recaps, setRecaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecaps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coverage/recaps", {
        method: "POST",
        body: JSON.stringify({
          leagueId,
          week,
          matchups: [
            { team1: "Your Team", team1_score: 120, team2: "Rival", team2_score: 110, mvp: "Player", mvp_score: 25 },
            { team1: "Team A", team1_score: 130, team2: "Team B", team2_score: 125, mvp: "Star", mvp_score: 28 },
          ],
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setRecaps(data.recaps || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={fetchRecaps}
        disabled={loading}
        className="mb-8 rounded-xl bg-football-cyan px-6 py-3 font-bold text-obsidian-900 transition hover:bg-football-cyan/80 disabled:opacity-50"
      >
        {loading ? "Generating…" : "Generate recaps"}
      </button>

      <div className="grid gap-6">
        {recaps.map((recap) => (
          <div key={recap.matchupId} className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur">
            <h3 className="text-2xl font-bold mb-2">{recap.title}</h3>
            <p className="text-on-surface-variant mb-4">{recap.body}</p>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-on-surface-variant">MVP</span>
                <p className="font-bold">{recap.mvp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsTab({ leagueId, week, available }: any) {
  const [activeTools, setActiveTools] = useState<string[]>([]);

  const tools = [
    { id: "start-sit", name: "Start/Sit", icon: "🎯" },
    { id: "waivers", name: "Waiver Wire", icon: "📊" },
    { id: "trade-analyzer", name: "Trade Analyzer", icon: "🔄" },
    { id: "projections", name: "Projections", icon: "📈" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {tools.map((tool) => {
        const isAvailable = available.includes(tool.id);
        return (
          <div
            key={tool.id}
            className={`rounded-2xl border p-8 glass-blur transition ${
              isAvailable
                ? "border-white/10 bg-white/5 cursor-pointer hover:border-football-cyan/60"
                : "border-white/5 bg-white/[0.02] opacity-50"
            }`}
            onClick={() => isAvailable && setActiveTools(t => t.includes(tool.id) ? t.filter(x => x !== tool.id) : [...t, tool.id])}
          >
            <div className="text-3xl mb-4">{tool.icon}</div>
            <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              {isAvailable ? "Available in your plan" : "Upgrade to unlock"}
            </p>
            {isAvailable && (
              <button className="w-full rounded-lg border border-football-cyan/30 bg-football-cyan/10 px-4 py-2 text-sm font-bold text-football-cyan transition hover:bg-football-cyan/20">
                Use tool
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LockedFeature({ feature }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-16 glass-blur text-center">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold mb-2">{feature} locked</h2>
      <p className="text-on-surface-variant">Upgrade your plan to unlock {feature.toLowerCase()}.</p>
    </div>
  );
}
