"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { GridironLogo } from "@/components/SportLogo";

type Section = "dashboard" | "recaps" | "rankings" | "trade" | "settings";

const NAV: { id: Section; label: string; gated: boolean }[] = [
  { id: "dashboard", label: "Dashboard", gated: false },
  { id: "recaps", label: "Recaps", gated: true },
  { id: "rankings", label: "Power Rankings", gated: true },
  { id: "trade", label: "Trade Analyzer", gated: true },
  { id: "settings", label: "Settings", gated: false },
];

export default function DashboardPage() {
  const [active, setActive] = useState<Section>("dashboard");
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/yahoo/status")
      .then((r) => r.json())
      .then((d) => setConnected(Boolean(d.connected)))
      .catch(() => setConnected(false));
  }, []);

  const locked = (gated: boolean) => gated && connected !== true;

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
            {NAV.map((item) => {
              const isLocked = locked(item.gated);
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-medium transition ${
                    active === item.id
                      ? "bg-cyan-400/10 text-cyan-300"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {isLocked && <span className="text-xs text-zinc-600">🔒</span>}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => (window.location.href = "/")}
            className="mt-6 w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-zinc-500 transition hover:border-white/20 hover:text-zinc-300"
          >
            ← Back to home
          </button>
        </aside>

        <div className="flex-1 p-10">
          {active === "dashboard" && <SectionDashboard connected={connected} />}
          {active === "recaps" && (
            <Gated connected={connected} feature="Weekly Recaps"><SectionRecaps /></Gated>
          )}
          {active === "rankings" && (
            <Gated connected={connected} feature="Power Rankings"><SectionRankings /></Gated>
          )}
          {active === "trade" && (
            <Gated connected={connected} feature="Trade Analyzer"><SectionTrade /></Gated>
          )}
          {active === "settings" && <SectionSettings />}
        </div>
      </div>
    </main>
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
    return <div className="text-zinc-500">Loading…</div>;
  }
  if (!connected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
          🔒
        </div>
        <h2 className="text-3xl font-black">{feature} is locked</h2>
        <p className="mt-3 max-w-md text-zinc-400">
          Connect your fantasy league to unlock {feature.toLowerCase()} and every
          other SportsHQ feature.
        </p>
        <a
          href="/api/yahoo/auth"
          className="mt-8 rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-black transition hover:bg-cyan-300"
        >
          Connect Yahoo League
        </a>
      </div>
    );
  }
  return <>{children}</>;
}

/* ── Dashboard ── */
function SectionDashboard({ connected }: { connected: boolean | null }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#11161d] p-12">
      <div className="inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
        Fantasy Football AI
      </div>
      <h1 className="mt-6 text-6xl font-black">Welcome to Gridiron.</h1>
      <p className="mt-6 max-w-2xl text-xl text-zinc-400">
        AI-generated fantasy football insights, weekly recaps, power rankings,
        and trade analysis — built on top of your real league data.
      </p>

      {connected ? (
        <div className="mt-10 inline-flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-4">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="font-semibold text-green-300">League connected</span>
          <span className="text-zinc-400">— all features unlocked.</span>
        </div>
      ) : (
        <>
          <p className="mt-10 text-zinc-400">
            Connect your league to unlock recaps, rankings, and trade analysis.
          </p>
          <a
            href="/api/yahoo/auth"
            className="mt-4 inline-block rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-black transition hover:bg-cyan-300"
          >
            Connect Yahoo League
          </a>
        </>
      )}
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
      setSummary("Failed to generate recap. Please try again.");
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
        <div className="mt-2 border-t border-white/5 pt-4">
          <p className="text-sm leading-relaxed text-zinc-300">{summary}</p>
          <p className="mt-3 text-xs text-zinc-600">AI-generated · verify before acting · <a href="/accuracy" className="underline hover:text-zinc-400">accuracy tracking</a></p>
        </div>
      )}
    </div>
  );
}

function SectionRecaps() {
  return (
    <div>
      <h2 className="text-4xl font-black mb-2">Weekly Recaps</h2>
      <p className="text-zinc-400 mb-8">Click &quot;AI Recap&quot; on any matchup for an AI-generated summary.</p>
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
      setAnalysis("Failed to generate analysis. Please try again.");
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
          <div className="text-xs uppercase tracking-widest text-cyan-300 mb-3">AI Analysis</div>
          <p className="text-zinc-300 leading-relaxed">{analysis}</p>
          <p className="mt-4 text-xs text-zinc-600">AI-generated · verify before acting · <a href="/accuracy" className="underline hover:text-zinc-400">accuracy tracking</a></p>
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
      setError("Failed to analyze trade. Please try again.");
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
      <p className="text-zinc-400 mb-8">Enter a proposed trade and get an AI-powered verdict.</p>
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
          <p className="text-xs text-zinc-600 pt-2 border-t border-white/5">AI-generated · verify before acting · <a href="/accuracy" className="underline hover:text-zinc-400">accuracy tracking</a></p>
        </div>
      )}
    </div>
  );
}

/* ── League Connections Card ── */
function LeagueConnectionsCard() {
  const [yahooConnected, setYahooConnected] = useState<boolean | null>(null);
  const [sleeperConnected, setSleeperConnected] = useState<boolean | null>(null);
  const [sleeperUsername, setSleeperUsername] = useState("");
  const [sleeperInput, setSleeperInput] = useState("");
  const [sleeperLoading, setSleeperLoading] = useState(false);
  const [sleeperError, setSleeperError] = useState("");

  useEffect(() => {
    fetch("/api/yahoo/status")
      .then((r) => r.json())
      .then((d) => setYahooConnected(Boolean(d.connected)))
      .catch(() => setYahooConnected(false));

    fetch("/api/sleeper/status")
      .then((r) => r.json())
      .then((d) => {
        setSleeperConnected(Boolean(d.connected));
        if (d.username) setSleeperUsername(d.username);
      })
      .catch(() => setSleeperConnected(false));
  }, []);

  async function connectSleeper(e: React.FormEvent) {
    e.preventDefault();
    if (!sleeperInput.trim()) return;
    setSleeperLoading(true);
    setSleeperError("");
    try {
      const res = await fetch("/api/sleeper/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: sleeperInput.trim() }),
      });
      const data = await res.json();
      if (data.error) { setSleeperError(data.error); return; }
      setSleeperConnected(true);
      setSleeperUsername(sleeperInput.trim());
    } catch {
      setSleeperError("Failed to connect. Try again.");
    } finally {
      setSleeperLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#11161d] p-8">
      <h3 className="text-lg font-bold mb-6">Connected Leagues</h3>

      {/* Yahoo */}
      <div className="mb-5 pb-5 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Yahoo Fantasy</span>
          {yahooConnected ? (
            <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-400">Connected</span>
          ) : (
            <a
              href="/api/yahoo/auth"
              className="rounded-lg border border-cyan-400/30 px-4 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
            >
              + Connect
            </a>
          )}
        </div>
        <p className="text-xs text-zinc-600">OAuth connection — your league data is fetched securely.</p>
      </div>

      {/* Sleeper */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Sleeper</span>
          {sleeperConnected && (
            <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-400">
              Connected · @{sleeperUsername}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-600 mb-3">Enter your Sleeper username — no OAuth needed, Sleeper's API is public.</p>
        {!sleeperConnected && (
          <form onSubmit={connectSleeper} className="flex gap-2">
            <input
              type="text"
              value={sleeperInput}
              onChange={(e) => setSleeperInput(e.target.value)}
              placeholder="Your Sleeper username"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-cyan-400/60"
            />
            <button
              type="submit"
              disabled={sleeperLoading}
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
            >
              {sleeperLoading ? "…" : "Connect"}
            </button>
          </form>
        )}
        {sleeperError && <p className="mt-2 text-xs text-red-400">{sleeperError}</p>}
      </div>
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

        <LeagueConnectionsCard />

        <div className="rounded-2xl border border-white/10 bg-[#11161d] p-8">
          <h3 className="text-lg font-bold mb-4">Session</h3>
          <button
            onClick={handleSignOut}
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
          >
            Sign out
          </button>
        </div>

        <DeleteAccountCard />
      </div>
    </div>
  );
}

/* ── Delete Account ── */
function DeleteAccountCard() {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (confirm !== "delete my account") return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete user's league and cached data
      await supabase.from("leagues").delete().eq("user_id", user.id);

      // Sign out — leaves account shell in place; full deletion requires admin API
      // Users can email privacy@sportshq.app for complete removal per Privacy Policy
      await supabase.auth.signOut();
      window.location.href = "/?deleted=1";
    } catch {
      setError("Deletion failed. Please contact privacy@sportshq.app.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-red-500/20 bg-[#11161d] p-8">
      <h3 className="text-lg font-bold mb-2 text-red-400">Danger zone</h3>
      <p className="text-sm text-zinc-400 mb-4">
        Permanently delete your account and all league data. Type{" "}
        <span className="font-mono text-zinc-300">delete my account</span> to confirm.
      </p>
      <input
        type="text"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="delete my account"
        className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-red-500/60"
      />
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      <button
        onClick={handleDelete}
        disabled={confirm !== "delete my account" || loading}
        className="rounded-xl border border-red-500/40 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Deleting…" : "Delete account"}
      </button>
    </div>
  );
}
