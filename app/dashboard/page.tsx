"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { GridironLogo } from "@/components/SportLogo";
import { Skeleton, TextSkeleton } from "@/components/Skeleton";

type Section = "dashboard" | "recaps" | "rankings" | "trade" | "settings";

const NAV: { id: Section; label: string; gated: boolean }[] = [
  { id: "dashboard", label: "DASHBOARD", gated: false },
  { id: "recaps", label: "LIVE GAMES", gated: true },
  { id: "rankings", label: "TEAM STATS", gated: true },
  { id: "trade", label: "ANALYTICS", gated: true },
  { id: "settings", label: "SETTINGS", gated: false },
];

export default function DashboardPage() {
  const [active, setActive] = useState<Section>("dashboard");
  const [connected, setConnected] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);

      // Check if user has a plan selected
      if (data.user) {
        const userPlan = data.user.user_metadata?.selected_plan;
        const userTier = data.user.user_metadata?.selected_tier;

        // If no plan selected, redirect to quiz
        if (!userPlan || !userTier) {
          window.location.href = "/onboarding/quiz";
          return;
        }
      }

      setLoading(false);
    });

    fetch("/api/yahoo/status")
      .then((r) => r.json())
      .then((d) => setConnected(Boolean(d.connected)))
      .catch(() => setConnected(false));
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleSupport = () => {
    window.open("mailto:sportshqfantasyassistant@gmail.com", "_blank");
  };

  const locked = (gated: boolean) => gated && connected !== true;

  return (
    <main className="min-h-screen bg-[#070b11] text-white font-mono">
      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-screen w-64 border-r border-cyan-500/20 bg-black/50 p-6 flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <GridironLogo size={32} />
              <div>
                <div className="font-display text-lg font-black uppercase">GRIDIRON</div>
                <div className="text-xs text-cyan-400 uppercase tracking-widest">PRO ANALYTICS</div>
              </div>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {NAV.map((item) => {
              const isLocked = locked(item.gated);
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  disabled={isLocked}
                  className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-bold transition border-l-2 ${
                    active === item.id
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-transparent text-zinc-400 hover:text-cyan-300 hover:bg-white/5"
                  } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="space-y-2 pt-6 border-t border-white/10">
            <button className="w-full bg-cyan-400 text-black px-4 py-3 rounded font-bold uppercase text-xs tracking-wider hover:bg-cyan-300 transition">
              GO LIVE
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition"
            >
              BACK TO HOME
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs space-y-2">
            <button
              onClick={handleSupport}
              className="block w-full text-left px-4 py-2 text-zinc-600 uppercase tracking-wider hover:text-zinc-400 transition"
            >
              SUPPORT
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-zinc-600 uppercase tracking-wider hover:text-zinc-400 transition"
            >
              LOGOUT
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {active === "dashboard" && <SectionDashboard connected={connected} user={user} />}
          {active === "recaps" && (
            <Gated connected={connected} feature="Live Games"><SectionRecaps /></Gated>
          )}
          {active === "rankings" && (
            <Gated connected={connected} feature="Team Stats"><SectionRankings /></Gated>
          )}
          {active === "trade" && (
            <Gated connected={connected} feature="Analytics"><SectionTrade /></Gated>
          )}
          {active === "settings" && <SectionSettings />}
        </div>
      </div>
    </main>
  );
}

/* ── Dashboard Command Center ── */
function SectionDashboard({ connected, user }: { connected: boolean | null; user: any }) {
  const [currentWeek, setCurrentWeek] = useState(12);
  const [selectedTeam, setSelectedTeam] = useState("your-team");
  const [liveGames, setLiveGames] = useState<any[]>([]);
  const [teamStats, setTeamStats] = useState<any>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    // Get current NFL week
    const now = new Date();
    const nflStart = new Date(now.getFullYear(), 8, 1); // September 1
    const week = Math.ceil((now.getTime() - nflStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    setCurrentWeek(Math.max(1, Math.min(week, 17)));

    // Fetch mock data - in production would call real API
    setLiveGames([
      { id: 1, away: "SF", awayScore: 17, home: "SEA", homeScore: 14, time: "3Q 2:45", status: "LIVE" },
      { id: 2, away: "KC", awayScore: 31, home: "LV", homeScore: 10, time: "FINAL", status: "FINAL" },
      { id: 3, away: "BAL", awayScore: 20, home: "CIN", homeScore: 0, time: "1Q", status: "LIVE" },
    ]);

    setStandings([
      { rank: 1, team: "GOTHAM ROGUES", record: "10-1" },
      { rank: 2, team: "STEEL CITY TITANS", record: "9-2" },
      { rank: 3, team: "METROPOLIS SHARKS", record: "8-3" },
      { rank: 4, team: "CENTRAL CITY FLASH", record: "7-4" },
      { rank: 5, team: "COAST CITY JETS", record: "6-5" },
    ]);

    // Fetch team stats
    setLoadingStats(true);
    setTimeout(() => {
      setTeamStats({
        name: "STEEL CITY TITANS",
        status: "ACTIVE",
        rank: 2,
        record: "9-2",
        pointsFor: 28.4,
        playoffProb: 94,
      });
      setLoadingStats(false);
    }, 500);
  }, []);

  if (!connected) {
    return (
      <div className="p-10 text-center">
        <p className="text-zinc-400">Connect your league to view the executive dashboard</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight mb-2">
            EXECUTIVE DASHBOARD
          </h1>
          <p className="text-cyan-400 text-sm uppercase tracking-widest">
            ● NFL WEEK {currentWeek} · LIVE FEED ACTIVE
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 border border-zinc-600 text-zinc-300 uppercase text-xs font-bold hover:border-cyan-400 hover:text-cyan-300 transition">
            EXPORT PDF
          </button>
          <button className="px-6 py-2 bg-cyan-400 text-black uppercase text-xs font-bold hover:bg-cyan-300 transition">
            EDIT LAYOUT
          </button>
        </div>
      </div>

      {/* Live Games Ticker */}
      <div className="bg-black/40 border border-zinc-700/50 rounded-lg p-4 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {liveGames.map((game) => (
            <div key={game.id} className="flex-shrink-0 px-4 py-2 border border-zinc-600/50 rounded text-xs font-mono">
              <span className="text-zinc-400">{game.away}</span>
              <span className="text-cyan-400 mx-2">{game.awayScore}</span>
              <span className="text-zinc-600">@</span>
              <span className="text-cyan-400 mx-2">{game.homeScore}</span>
              <span className="text-zinc-400">{game.home}</span>
              <span className="text-zinc-500 ml-3">{game.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Team Stats */}
        <div className="col-span-2 space-y-6">
          {/* Team Selection & Stats Card */}
          <div className="bg-black/40 border border-zinc-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm text-cyan-400 uppercase tracking-widest mb-1">PRIMARY TEAM</h3>
                <h2 className="font-display text-3xl font-black uppercase">{teamStats?.name || "LOADING..."}</h2>
              </div>
              <span className="px-3 py-1 bg-cyan-400/20 border border-cyan-400/50 text-cyan-300 text-xs uppercase font-bold rounded">
                {teamStats?.status || "..."}
              </span>
            </div>

            {loadingStats ? (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-zinc-700/30 rounded p-4">
                  <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">RANK</p>
                  <p className="font-display text-3xl font-black">{String(teamStats?.rank).padStart(2, "0")}</p>
                </div>
                <div className="bg-white/5 border border-zinc-700/30 rounded p-4">
                  <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">W/L</p>
                  <p className="font-display text-3xl font-black">{teamStats?.record}</p>
                </div>
                <div className="bg-white/5 border border-zinc-700/30 rounded p-4">
                  <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">PTS/G</p>
                  <p className="font-display text-3xl font-black">{teamStats?.pointsFor.toFixed(1)}</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-zinc-700/50">
              <p className="text-xs text-cyan-400 uppercase tracking-widest mb-2">PLAYOFF PROBABILITY</p>
              <div className="w-full bg-zinc-800 rounded h-2 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all"
                  style={{ width: `${teamStats?.playoffProb || 0}%` }}
                />
              </div>
              <p className="text-right text-sm text-cyan-300 font-bold mt-1">{teamStats?.playoffProb}%</p>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-black/40 border border-zinc-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-black uppercase">PERFORMANCE TRENDS</h3>
              <div className="flex gap-2">
                {["1M", "3M", "1Y"].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 text-xs uppercase font-bold rounded transition ${
                      period === "3M"
                        ? "bg-cyan-400 text-black"
                        : "border border-zinc-600 text-zinc-400 hover:border-cyan-400 hover:text-cyan-300"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Simple bar chart */}
            <div className="flex items-end gap-4 h-48 p-4 bg-white/5 rounded border border-zinc-700/30">
              {["WK 05", "WK 06", "WK 07", "WK 08", "WK 09", "WK 10", "WK 11"].map((week, i) => (
                <div key={week} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-cyan-400 rounded-t transition-all"
                    style={{ height: `${40 + i * 12}%` }}
                  />
                  <p className="text-xs text-zinc-500 mt-2">{week}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* League Standings */}
          <div className="bg-black/40 border border-zinc-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-black uppercase">LEAGUE STANDINGS</h3>
              <a href="#" className="text-cyan-400 text-xs uppercase font-bold hover:text-cyan-300">
                FULL TABLE
              </a>
            </div>

            <div className="space-y-2">
              {standings.map((team) => (
                <div key={team.rank} className="flex items-center justify-between px-3 py-2 border-b border-zinc-700/30">
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-bold text-sm">{String(team.rank).padStart(2, "0")}</span>
                    <span className="text-xs uppercase font-bold text-zinc-300">{team.team}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{team.record}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Advice */}
          <div className="bg-black/40 border border-zinc-700/50 rounded-lg p-6">
            <h3 className="font-display text-lg font-black uppercase mb-4 flex items-center gap-2">
              🎯 TACTICAL ADVICE
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-zinc-600">↗</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Opponent defense ranks #1 in Red Zone stops. Consider high-percentage short pass plays.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="text-cyan-400">🛡</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Your QB has a <span className="text-cyan-400 font-bold">128.4 rating</span> when under pressure in last 2 games.
                </p>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 border border-cyan-400/50 text-cyan-300 text-xs uppercase font-bold hover:bg-cyan-400/10 transition rounded">
              GENERATE FULL SCOUTING REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Connection gate ── */
function Gated({
  connected,
  feature,
  children,
}: {
  connected: boolean | null;
  feature: string;
  children: React.ReactNode;
}) {
  if (connected === null) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-[#11161d] p-6">
              <Skeleton className="h-6 w-1/2 mb-4" />
              <TextSkeleton lines={3} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (!connected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
          🔒
        </div>
        <h2 className="text-3xl font-black">{feature} is locked</h2>
        <p className="mt-3 max-w-md text-zinc-400">
          Connect your fantasy league to unlock {feature.toLowerCase()} and every other SportsHQ feature.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

/* ── Placeholder Sections (keep existing) ── */
function SectionRecaps() {
  return <div className="p-10 text-zinc-400">Live Games Coming Soon</div>;
}

function SectionRankings() {
  return <div className="p-10 text-zinc-400">Team Stats Coming Soon</div>;
}

function SectionTrade() {
  return <div className="p-10 text-zinc-400">Analytics Coming Soon</div>;
}

function SectionSettings() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState("");
  const [currentTier, setCurrentTier] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCurrentPlan(data.user?.user_metadata?.selected_plan || "");
      setCurrentTier(data.user?.user_metadata?.selected_tier || "");
    });
  }, []);

  const handleChangePlan = () => {
    window.location.href = "/onboarding/quiz?change-plan=true";
  };

  const handleChangePlanDirect = (newTier: string, newPlan: string) => {
    const supabase = createClient();
    supabase.auth.updateUser({
      data: {
        selected_plan: newPlan,
        selected_tier: newTier,
      },
    }).then(() => {
      setCurrentPlan(newPlan);
      setCurrentTier(newTier);
      window.location.reload();
    });
  };

  return (
    <div className="p-10">
      <h2 className="font-display text-4xl font-black mb-8">SETTINGS</h2>

      {/* Plan Management Card */}
      <div className="bg-black/40 border border-zinc-700/50 rounded-lg p-6 max-w-md mb-8">
        <h3 className="font-display text-lg font-bold uppercase mb-6">YOUR PLAN</h3>

        <div className="mb-6 p-4 bg-white/5 border border-cyan-400/30 rounded">
          <p className="text-sm text-zinc-400 uppercase tracking-wider mb-1">Current Plan</p>
          <p className="font-display text-2xl font-bold text-cyan-300 uppercase">
            {currentTier === "free"
              ? "Free"
              : currentTier === "all-access"
                ? `All-Access • ${currentPlan}`
                : `League Newsroom • ${currentPlan}`}
          </p>
        </div>

        <button
          onClick={handleChangePlan}
          className="w-full px-4 py-2 border border-cyan-400/50 text-cyan-300 text-xs uppercase font-bold hover:bg-cyan-400/10 transition rounded"
        >
          CHANGE PLAN
        </button>

        <p className="text-xs text-zinc-500 mt-4">
          You can change your plan anytime. Changes take effect immediately.
        </p>
      </div>
    </div>
  );
}
