"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { GridironLogo } from "@/components/SportLogo";

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
        <aside className="min-h-screen w-72 border-r border-white/10 bg-black/30 p-6 flex flex-col">
          <div className="mb-12 flex items-center gap-3">
            <GridironLogo size={44} />
            <div>
              <div className="text-2xl font-black">SportsHQ</div>
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Gridiron</div>
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
        matchup previews, and league analysis — all powered by Groq.
      </p>
      <button className="mt-10 rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-black transition hover:bg-cyan-300">
        Connect Yahoo League
      </button>
    </div>
  );
}

/* ── Recaps ── */
const RECAP_DATA = [
  { week: "Week 14", result: "W", score: "142.6 – 118.3", opponent: "Team Chaos", mvp: "Josh Allen – 38.4 pts" },
  { week: "Week 13", result: "L", score: "101.2 – 134.7", opponent: "The Dynasty", mvp: "Tyreek Hill – 29.1 pts" },
  { week: "Week 12", result: "W", score: "128.9 – 99.4", opponent: "Waiver Wire Warriors", mvp: "Derrick Henry – 32.6 pts" },
];

function RecapCard({ recap }: { recap: typeof RECAP_DATA[0] }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setSummary("");
    try {
      const res = await fetch("/api/recap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          week: recap.week,
          result: recap.result,
          score: recap.score,
          opponent: recap.opponent,
          mvp: recap.mvp,
        }),
      });
      const data = await res.json();
      setSummary(data.summary ?? "No summary generated.");
    } catch {
      setSummary("Failed to generate recap. Check your GROQ_API_KEY.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#11161d] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-sm text-zinc-500 font-medium">{recap.week}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${recap.result === "W" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
              {recap.result}
            </span>
          </div>
          <div className="text-2xl font-black">{recap.score}</div>
          <div className="text-sm text-zinc-400 mt-1">vs {recap.opponent} · Top: {recap.mvp}</div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-xl bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Generating…" : "AI Recap"}
        </button>
      </div>
      {summary && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-300 border-t border-white/5 pt-4">{summary}</p>
      )}
    </div>
  );
}

function SectionRecaps() {
  return (
    <div>
      <h2 className="text-4xl font-black mb-2">Weekly Recaps</h2>
      <p className="text-zinc-400 mb-8">Click &quot;AI Recap&quot; on any matchup for a Groq-generated summary.</p>
      <div className="space-y-4">
        {RECAP_DATA.map((r) => <RecapCard key={r.week} recap={r} />)}
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
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setAnalysis("");
    try {
      const res = await fetch("/api/rankings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams: TEAMS }),
      });
      const data = await res.json();
      setAnalysis(data.analysis ?? "No analysis generated.");
    } catch {
      setAnalysis("Failed to generate analysis. Check your GROQ_API_KEY.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-4xl font-black mb-2">Power Rankings</h2>
      <p className="text-zinc-400 mb-8">AI-calculated rankings based on performance and strength of schedule.</p>

      <div className="rounded-2xl border border-white/10 bg-[#11161d] overflow-hidden mb-6">
        <div className="grid grid-cols-5 px-6 py-3 text-xs uppercase tracking-widest text-zinc-500 border-b border-white/5">
          <span>Rank</span><span>Team</span><span>Record</span><span>Pts For</span><span>Trend</span>
        </div>
        {TEAMS.map((t) => (
          <div key={t.rank} className={`grid grid-cols-5 px-6 py-4 border-b border-white/5 last:border-0 items-center ${t.you ? "bg-cyan-400/5" : ""}`}>
            <span className="text-2xl font-black text-zinc-600">#{t.rank}</span>
            <span className={`font-semibold ${t.you ? "text-cyan-300" : "text-white"}`}>
              {t.name}{t.you && <span className="ml-2 text-xs text-cyan-400/60">(you)</span>}
            </span>
            <span className="text-zinc-400">{t.record}</span>
            <span className="text-zinc-300">{t.pts}</span>
            <span className={`font-bold ${t.trend === "↑" ? "text-green-400" : t.trend === "↓" ? "text-red-400" : "text-zinc-500"}`}>{t.trend}</span>
          </div>
        ))}
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
      >
        {loading ? "Analyzing…" : "AI Rankings Analysis"}
      </button>

      {analysis && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#11161d] p-6">
          <div className="text-xs uppercase tracking-widest text-cyan-300 mb-3">Groq Analysis</div>
          <p className="text-zinc-300 leading-relaxed">{analysis}</p>
        </div>
      )}
    </div>
  );
}

/* ── Trade Analyzer ── */
function SectionTrade() {
  const [give, setGive] = useState("");
  const [receive, setReceive] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [verdict, setVerdict] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    setError("");
    if (!give.trim() || !receive.trim()) {
      setError("Fill in both sides of the trade.");
      return;
    }
    setLoading(true);
    setAnalysis("");
    setVerdict("");
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ give, receive }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      const text: string = data.analysis ?? "";
      const verdictMatch = text.match(/Verdict:\s*(Accept|Decline|Neutral)/i);
      setVerdict(verdictMatch?.[1] ?? "");
      setAnalysis(text);
    } catch {
      setError("Failed to analyze trade. Check your GROQ_API_KEY.");
    } finally {
      setLoading(false);
    }
  }

  const verdictColor =
    verdict === "Accept" ? "text-green-400 bg-green-500/10 border-green-500/30"
    : verdict === "Decline" ? "text-red-400 bg-red-500/10 border-red-500/30"
    : "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";

  return (
    <div>
      <h2 className="text-4xl font-black mb-2">Trade Analyzer</h2>
      <p className="text-zinc-400 mb-8">Enter a proposed trade and get a Groq-powered verdict.</p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#11161d] p-6">
          <div className="text-xs uppercase tracking-widest text-cyan-300 mb-4">You Give</div>
          <textarea
            value={give}
            onChange={(e) => setGive(e.target.value)}
            placeholder="e.g. Derrick Henry, Davante Adams"
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none resize-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#11161d] p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-400 mb-4">You Receive</div>
          <textarea
            value={receive}
            onChange={(e) => setReceive(e.target.value)}
            placeholder="e.g. Justin Jefferson, Tony Pollard"
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none resize-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <button
        onClick={analyze}
        disabled={loading}
        className="mt-6 rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
      >
        {loading ? "Analyzing…" : "Analyze Trade"}
      </button>

      {analysis && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#11161d] p-6 space-y-4">
          {verdict && (
            <div className={`inline-flex rounded-full border px-4 py-1 text-sm font-bold ${verdictColor}`}>
              {verdict}
            </div>
          )}
          <pre className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">{analysis}</pre>
        </div>
      )}
    </div>
  );
}

/* ── Trash Talk ── */
function SectionTrash() {
  const [line, setLine] = useState("Click generate to get your first Groq-powered trash talk line.");
  const [opponent, setOpponent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/trash-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opponent }),
      });
      const data = await res.json();
      setLine(data.line ?? "No line generated.");
    } catch {
      setLine("Failed to generate. Check your GROQ_API_KEY.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard?.writeText(line);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h2 className="text-4xl font-black mb-2">Trash Talk</h2>
      <p className="text-zinc-400 mb-8">Groq-generated smack talk for your league chat.</p>

      <div className="rounded-2xl border border-white/10 bg-[#11161d] p-8">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-300">Target opponent (optional)</label>
          <input
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            placeholder="e.g. Their team name or manager name"
            className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
          />
        </div>

        <div className="text-xs uppercase tracking-widest text-cyan-300 mb-4">This week&apos;s line</div>
        <p className="text-xl leading-relaxed text-white font-medium min-h-[4rem]">&ldquo;{line}&rdquo;</p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
          <button
            onClick={copy}
            className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Yahoo League Card ── */
function YahooLeagueCard() {
  const connected =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("yahoo") === "connected";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#11161d] p-8">
      <h3 className="text-lg font-bold mb-4">Connected Leagues</h3>
      {connected ? (
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-400">Connected</span>
          <span className="text-sm text-zinc-400">Yahoo Fantasy</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-zinc-400 mb-4">No leagues connected yet.</p>
          <a
            href="/api/yahoo/auth"
            className="inline-block rounded-xl border border-cyan-400/30 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
          >
            + Connect Yahoo League
          </a>
        </>
      )}
    </div>
  );
}

/* ── Settings ── */
function SectionSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        setName(data.user.user_metadata?.full_name ?? "");
      }
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { full_name: name } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleSignOut() {
    await createClient().auth.signOut();
    window.location.href = "/";
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

        <YahooLeagueCard />

        <div className="rounded-2xl border border-white/10 bg-[#11161d] p-8">
          <h3 className="text-lg font-bold mb-4">Session</h3>
          <button
            onClick={handleSignOut}
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
          >
            Sign out
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
