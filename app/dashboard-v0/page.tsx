"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PLANS, TIERS } from "@/lib/pricing";
import type { PlanType, TierType } from "@/lib/types";

export default function DashboardV0() {
  const [step, setStep] = useState<"plan" | "tier" | "dashboard">("plan");
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("double");
  const [selectedTier, setSelectedTier] = useState<TierType>("all-access");
  const [leagues, setLeagues] = useState<any[]>([]);

  useEffect(() => {
    // Fetch user's leagues
    const fetchLeagues = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("leagues")
          .select("*")
          .eq("user_id", user.id);
        setLeagues(data || []);
      }
    };
    fetchLeagues();
  }, []);

  if (step === "plan") {
    return <PlanChooser onSelect={(p) => { setSelectedPlan(p); setStep("tier"); }} />;
  }

  if (step === "tier") {
    return (
      <TierChooser
        selectedPlan={selectedPlan}
        onSelect={(t) => { setSelectedTier(t); setStep("dashboard"); }}
        onBack={() => setStep("plan")}
      />
    );
  }

  return (
    <DashboardView
      plan={selectedPlan}
      tier={selectedTier}
      leagues={leagues}
      onChangePlan={() => setStep("plan")}
    />
  );
}

function PlanChooser({ onSelect }: { onSelect: (p: PlanType) => void }) {
  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Pick your emphasis</h1>
          <p className="text-on-surface-variant text-lg">
            Same price at every tier. Choose what matters to you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {(Object.values(PLANS) as typeof PLANS[keyof typeof PLANS][]).map((plan) => (
            <button
              key={plan.id}
              onClick={() => onSelect(plan.id as PlanType)}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
            >
              <div className="mb-4 inline-flex rounded-full bg-football-cyan/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-football-cyan">
                {plan.contentRatio}% content / {plan.analyticsRatio}% analytics
              </div>
              <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
              <p className="text-on-surface-variant mb-4">{plan.builtFor}</p>
              <p className="text-sm text-zinc-400">{plan.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TierChooser({
  selectedPlan,
  onSelect,
  onBack,
}: {
  selectedPlan: PlanType;
  onSelect: (t: TierType) => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 text-football-cyan hover:text-football-cyan/80 transition text-sm font-bold uppercase"
        >
          ← Back
        </button>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Pick your depth</h1>
          <p className="text-on-surface-variant text-lg">
            {PLANS[selectedPlan].name} available at every tier.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {(Object.values(TIERS) as typeof TIERS[keyof typeof TIERS][]).map((tier) => (
            <button
              key={tier.id}
              onClick={() => onSelect(tier.id as TierType)}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
            >
              <h2 className="text-3xl font-bold mb-2">{tier.name}</h2>
              <div className="mb-4 text-2xl font-bold text-football-cyan">{tier.price}</div>
              <p className="text-sm text-zinc-400 mb-4">
                {tier.depth === "metered" ? "Metered taste" : "Full access"}
              </p>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li>
                  {tier.leagues === 1 ? "1 league" : tier.leagues === 999 ? "Unlimited leagues" : `${tier.leagues} leagues`}
                </li>
                <li>{tier.sharing === "watermarked" ? "Watermarked" : tier.sharing === "clean" ? "Clean" : "League-branded"} sharing</li>
              </ul>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardView({
  plan,
  tier,
  leagues,
  onChangePlan,
}: {
  plan: PlanType;
  tier: TierType;
  leagues: any[];
  onChangePlan: () => void;
}) {
  const planData = PLANS[plan];
  const tierData = TIERS[tier];

  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 glass-blur p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{planData.name}</h1>
            <p className="text-on-surface-variant">{tierData.name}</p>
          </div>
          <button
            onClick={onChangePlan}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/5"
          >
            Change plan
          </button>
        </div>
      </header>

      {/* Leagues & Content */}
      <div className="max-w-6xl mx-auto p-8">
        {leagues.length === 0 ? (
          <ConnectLeagues />
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {leagues.map((league) => (
              <LeagueCard key={league.id} league={league} plan={plan} tier={tier} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LeagueCard({
  league,
  plan,
  tier,
}: {
  league: any;
  plan: PlanType;
  tier: TierType;
}) {
  const [recaps, setRecaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coverage/recaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leagueId: league.id,
          week: 1,
          matchups: [
            { team1: "Your Team", team1_score: 120, team2: "Rival", team2_score: 110, mvp: "Player", mvp_score: 25 },
          ],
        }),
      });
      const data = await res.json();
      setRecaps(data.recaps || []);
    } catch (error) {
      console.error("Error fetching recaps:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur">
      <h3 className="text-2xl font-bold mb-4">{league.league_name}</h3>
      <p className="text-on-surface-variant mb-6">{league.platform} • {league.year}</p>

      <div className="space-y-4">
        <p className="text-sm text-on-surface-variant">Emphasis: {plan === "beat" ? "Coverage-led" : plan === "double" ? "Balanced" : "Analytics-led"}</p>
        <button
          onClick={fetchContent}
          disabled={loading}
          className="w-full rounded-xl bg-football-cyan px-4 py-3 font-bold text-obsidian-900 transition hover:bg-football-cyan/80 disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate Content"}
        </button>
      </div>

      {recaps.length > 0 && (
        <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
          {recaps.map((recap) => (
            <div key={recap.matchupId} className="rounded-lg bg-black/40 p-4">
              <h4 className="font-bold mb-2">{recap.title}</h4>
              <p className="text-sm text-on-surface-variant line-clamp-3">{recap.body}</p>
              <p className="mt-2 text-xs text-zinc-500">MVP: {recap.mvp}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConnectLeagues() {
  const [sleeperInput, setSleeperInput] = useState("");
  const [sleeperLoading, setSleeperLoading] = useState(false);
  const [sleeperError, setSleeperError] = useState("");
  const [sleeperDone, setSleeperDone] = useState(false);

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
      setSleeperDone(true);
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      setSleeperError("Failed to connect. Try again.");
    } finally {
      setSleeperLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-12 glass-blur">
      <h2 className="text-2xl font-bold mb-2">Connect a league</h2>
      <p className="text-on-surface-variant mb-8 text-sm">
        Connect your Yahoo or Sleeper league to unlock your plan's content and tools.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Yahoo */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-6">
          <div className="label-caps text-football-cyan mb-3">Yahoo Fantasy</div>
          <p className="text-sm text-on-surface-variant mb-4">OAuth connection — click to authorize.</p>
          <a
            href="/api/yahoo/auth"
            className="block w-full rounded-lg bg-football-cyan px-4 py-3 text-center text-sm font-bold text-obsidian-900 transition hover:bg-football-cyan/80"
          >
            Connect Yahoo →
          </a>
        </div>

        {/* Sleeper */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-6">
          <div className="label-caps text-football-cyan mb-3">Sleeper</div>
          <p className="text-sm text-on-surface-variant mb-4">Enter your Sleeper username — no OAuth needed.</p>
          {sleeperDone ? (
            <p className="text-sm text-green-400 font-semibold">Connected! Refreshing…</p>
          ) : (
            <form onSubmit={connectSleeper} className="flex gap-2">
              <input
                type="text"
                value={sleeperInput}
                onChange={(e) => setSleeperInput(e.target.value)}
                placeholder="username"
                className="flex-1 min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-football-cyan/60"
              />
              <button
                type="submit"
                disabled={sleeperLoading}
                className="rounded-lg bg-football-cyan px-4 py-2 text-sm font-bold text-obsidian-900 transition hover:bg-football-cyan/80 disabled:opacity-60"
              >
                {sleeperLoading ? "…" : "→"}
              </button>
            </form>
          )}
          {sleeperError && <p className="mt-2 text-xs text-red-400">{sleeperError}</p>}
        </div>
      </div>
    </div>
  );
}
