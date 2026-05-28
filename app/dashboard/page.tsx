"use client";

import { useState } from "react";

type Section = "dashboard" | "recaps" | "rankings" | "trade" | "trash" | "settings";

const NAV: { id: Section; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "recaps", label: "Recaps" },
  { id: "rankings", label: "Power Rankings" },
  { id: "trade", label: "Trade Analyzer" },
  { id: "trash", label: "Trash Talk" },
  { id: "settings", label: "Settings" },
];

export default function DashboardPage() {
  const [active, setActive] = useState<Section>("dashboard");

  return (
    <main className="min-h-screen bg-[#070b11] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-screen w-72 border-r border-white/10 bg-black/30 p-6 flex flex-col">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-black font-black">
              HQ
            </div>
            <div>
              <div className="text-2xl font-black">SportsHQ</div>
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Gridiron
              </div>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`w-full text-left rounded-xl px-4 py-3 font-medium transition ${
                  active === item.id
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => (window.location.href = "/")}
            className="mt-6 w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-zinc-500 transition hover:border-white/20 hover:text-zinc-300"
          >
            ← Back to home
          </button>
        </aside>

        {/* Main content */}
        <div className="flex-1 p-10">
          {active === "dashboard" && <SectionDashboard />}
          {active === "recaps" && <SectionRecaps />}
          {active === "rankings" && <SectionRankings />}
          {active === "trade" && <SectionTrade />}
          {active === "trash" && <SectionTrash />}
          {active === "settings" && <SectionSettings />}
        </div>
      </div>
    </main>
  );
}

/* ── Dashboard ── */
function SectionDashboard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#11161d] p-12">
      <div className="inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
        Fantasy Football AI
      </div>
      <h1 className="mt-6 text-6xl font-black">Welcome to Gridiron.</h1>
      <p className="mt-6 max-w-2xl text-xl text-zinc-400">
        AI-generated fantasy football insights, weekly recaps, power rankings,
        matchup previews, and league analysis.
      </p>
      <button className="mt-10 rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-black transition hover:bg-cyan-300">
        Connect Yahoo League
      </button>
    </div>
  );
}

/* ── Recaps ── */
const RECAPS = [
  { week: "Week 14", result: "W", score: "142.6 – 118.3", opp: "Team Chaos", mvp: "Josh Allen – 38.4 pts" },
  { week: "Week 13", result: "L", score: "101.2 – 134.7", opp: "The Dynasty", mvp: "Tyreek Hill – 29.1 pts" },
  { week: "Week 12", result: "W", score: "128.9 – 99.4", opp: "Waiver Wire Warriors", mvp: "Derrick Henry – 32.6 pts" },
];

function SectionRecaps() {
  return (
    <div>
      <h2 className="text-4xl font-black mb-2">Weekly Recaps</h2>
      <p className="text-zinc-400 mb-8">AI-generated summaries of your matchups.</p>
      <div className="space-y-4">
        {RECAPS.map((r) => (
          <div key={r.week} className="rounded-2xl border border-white/10 bg-[#11161d] p-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm text-zinc-500 font-medium">{r.week}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${r.result === "W" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                  {r.result}
                </span>
              </div>
              <div className="text-2xl font-black">{r.score}</div>
              <div className="text-sm text-zinc-400 mt-1">vs {r.opp}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-500 mb-1">Top performer</div>
              <div className="text-sm font-semibold text-cyan-300">{r.mvp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Power Rankings ── */
const TEAMS = [
  { rank: 1, name: "The Dynasty", record: "10-4", pts: 1682.4, trend: "↑" },
  { rank: 2, name: "Your Team", record: "9-5", pts: 1601.2, trend: "↑", you: true },
  { rank: 3, name: "Team Chaos", record: "8-6", pts: 1544.8, trend: "↓" },
  { rank: 4, name: "Waiver Wire Warriors", record: "7-7", pts: 1498.1, trend: "—" },
  { rank: 5, name: "Bye Week Bros", record: "6-8", pts: 1432.6, trend: "↓" },
  { rank: 6, name: "Sleeper Picks", record: "5-9", pts: 1388.0, trend: "↑" },
];

function SectionRankings() {
  return (
    <div>
      <h2 className="text-4xl font-black mb-2">Power Rankings</h2>
      <p className="text-zinc-400 mb-8">AI-calculated rankings based on performance and strength of schedule.</p>
      <div className="rounded-2xl border border-white/10 bg-[#11161d] overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 text-xs uppercase tracking-widest text-zinc-500 border-b border-white/5">
          <span>Rank</span><span>Team</span><span>Record</span><span>Pts For</span><span>Trend</span>
        </div>
        {TEAMS.map((t) => (
          <div key={t.rank} className={`grid grid-cols-5 px-6 py-4 border-b border-white/5 last:border-0 items-center ${t.you ? "bg-cyan-400/5" : ""}`}>
            <span className="text-2xl font-black text-zinc-600">#{t.rank}</span>
            <span className={`font-semibold ${t.you ? "text-cyan-300" : "text-white"}`}>{t.name}{t.you && <span className="ml-2 text-xs text-cyan-400/60">(you)</span>}</span>
            <span className="text-zinc-400">{t.record}</span>
            <span className="text-zinc-300">{t.pts}</span>
            <span className={`font-bold ${t.trend === "↑" ? "text-green-400" : t.trend === "↓" ? "text-red-400" : "text-zinc-500"}`}>{t.trend}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Trade Analyzer ── */
function SectionTrade() {
  return (
    <div>
      <h2 className="text-4xl font-black mb-2">Trade Analyzer</h2>
      <p className="text-zinc-400 mb-8">Enter a proposed trade and get an AI-powered verdict.</p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#11161d] p-6">
          <div className="text-xs uppercase tracking-widest text-cyan-300 mb-4">You Give</div>
          <textarea
            placeholder="e.g. Derrick Henry, Davante Adams"
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none resize-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#11161d] p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-400 mb-4">You Receive</div>
          <textarea
            placeholder="e.g. Justin Jefferson, Tony Pollard"
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none resize-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
          />
        </div>
      </div>
      <button className="mt-6 rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-black transition hover:bg-cyan-300">
        Analyze Trade
      </button>
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#11161d] p-6 text-zinc-500 text-sm">
        Connect your Yahoo league to get real roster data and AI analysis.
      </div>
    </div>
  );
}

/* ── Trash Talk ── */
const LINES = [
  "Your team's injury report reads like a hospital manifest. Hope your bench isn't as shallow as your playoff hopes.",
  "Congrats on starting a bye-week player — truly a bold strategy. How's that working out for you?",
  "Your last three waiver pickups are currently playing for teams that don't exist anymore.",
];

function SectionTrash() {
  const [line, setLine] = useState(LINES[0]);
  const [idx, setIdx] = useState(0);

  function next() {
    const next = (idx + 1) % LINES.length;
    setIdx(next);
    setLine(LINES[next]);
  }

  return (
    <div>
      <h2 className="text-4xl font-black mb-2">Trash Talk</h2>
      <p className="text-zinc-400 mb-8">AI-generated smack talk for your league chat.</p>
      <div className="rounded-2xl border border-white/10 bg-[#11161d] p-8">
        <div className="text-xs uppercase tracking-widest text-cyan-300 mb-4">This week&apos;s line</div>
        <p className="text-xl leading-relaxed text-white font-medium">&ldquo;{line}&rdquo;</p>
        <div className="mt-8 flex gap-4">
          <button
            onClick={next}
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300"
          >
            Generate another
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(line)}
            className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Settings ── */
function SectionSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <h2 className="text-4xl font-black mb-2">Settings</h2>
      <p className="text-zinc-400 mb-8">Manage your account and preferences.</p>

      <div className="max-w-xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#11161d] p-8">
          <h3 className="text-lg font-bold mb-6">Account</h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Display name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300"
            >
              {saved ? "Saved!" : "Save changes"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11161d] p-8">
          <h3 className="text-lg font-bold mb-4">Connected Leagues</h3>
          <p className="text-sm text-zinc-400 mb-4">No leagues connected yet.</p>
          <button className="rounded-xl border border-cyan-400/30 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10">
            + Connect Yahoo League
          </button>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-[#11161d] p-8">
          <h3 className="text-lg font-bold mb-2 text-red-400">Danger zone</h3>
          <p className="text-sm text-zinc-400 mb-4">Permanently delete your account and all data.</p>
          <button className="rounded-xl border border-red-500/40 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
