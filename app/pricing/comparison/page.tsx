"use client";

import Link from "next/link";
import { PLANS, TIERS, getDescription } from "@/lib/pricing";
import type { PlanType, TierType } from "@/lib/types";

interface Feature {
  name: string;
  category: "Basic" | "Coverage" | "Analytics" | "Team";
  free: boolean;
  beat: boolean;
  double: boolean;
  "war-room": boolean;
}

const FEATURES: Feature[] = [
  // Basic
  { name: "Leagues", category: "Basic", free: true, beat: true, double: true, "war-room": true },
  { name: "Watermarked sharing", category: "Basic", free: true, beat: false, double: false, "war-room": false },
  { name: "Clean sharing", category: "Basic", free: false, beat: true, double: true, "war-room": true },
  { name: "League-branded sharing", category: "Basic", free: false, beat: true, double: true, "war-room": true },

  // Coverage
  { name: "Weekly recaps", category: "Coverage", free: false, beat: true, double: true, "war-room": true },
  { name: "Ranking columns", category: "Coverage", free: false, beat: true, double: true, "war-room": false },
  { name: "Storylines", category: "Coverage", free: false, beat: true, double: true, "war-room": false },
  { name: "Weekly awards", category: "Coverage", free: false, beat: true, double: true, "war-room": false },
  { name: "Headlines", category: "Coverage", free: true, beat: true, double: true, "war-room": true },

  // Analytics
  { name: "Start/Sit optimizer", category: "Analytics", free: true, beat: false, double: true, "war-room": true },
  { name: "Waiver Wire", category: "Analytics", free: false, beat: false, double: true, "war-room": true },
  { name: "Trade Analyzer", category: "Analytics", free: false, beat: false, double: true, "war-room": true },
  { name: "Projections", category: "Analytics", free: true, beat: false, double: true, "war-room": true },
  { name: "Advanced Lineup Builder", category: "Analytics", free: false, beat: false, double: false, "war-room": true },
  { name: "Accuracy Depth", category: "Analytics", free: false, beat: false, double: false, "war-room": true },

  // Team
  { name: "Team collaboration", category: "Team", free: false, beat: false, double: false, "war-room": true },
];

const TIERS_ORDER: TierType[] = ["free", "all-access", "league-newsroom"];
const PLANS_ORDER: PlanType[] = ["beat", "double", "war-room"];

export default function ComparisonPage() {
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const recommendedTier = (searchParams.get("tier") as TierType) || null;
  const recommendedPlan = (searchParams.get("plan") as PlanType) || null;

  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/onboarding/quiz"
            className="inline-block mb-6 text-football-cyan hover:text-football-cyan/80 transition text-sm font-bold uppercase"
          >
            ← Back to quiz
          </Link>
          <h1 className="text-5xl font-bold mb-4">Compare All Plans</h1>
          <p className="text-on-surface-variant text-lg">
            Choose the plan that best fits your needs
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 font-bold text-on-surface-variant w-48">Feature</th>

                {/* Free tier */}
                <th colSpan={1} className="text-center">
                  <PlanHeader tier="free" plan={null} recommended={recommendedTier === "free"} />
                </th>

                {/* All-Access tier */}
                {PLANS_ORDER.map((plan) => (
                  <th key={`all-access-${plan}`} className="text-center">
                    <PlanHeader
                      tier="all-access"
                      plan={plan}
                      recommended={recommendedTier === "all-access" && recommendedPlan === plan}
                    />
                  </th>
                ))}

                {/* League Newsroom tier */}
                {PLANS_ORDER.map((plan) => (
                  <th key={`league-newsroom-${plan}`} className="text-center">
                    <PlanHeader
                      tier="league-newsroom"
                      plan={plan}
                      recommended={recommendedTier === "league-newsroom" && recommendedPlan === plan}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 font-medium text-on-surface">{feature.name}</td>

                  {/* Free */}
                  <td className="p-4 text-center">
                    {feature.free ? (
                      <span className="text-football-cyan font-bold">✓</span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>

                  {/* All-Access plans */}
                  {PLANS_ORDER.map((plan) => (
                    <td key={`all-access-${plan}`} className="p-4 text-center">
                      {feature[plan] ? (
                        <span className="text-football-cyan font-bold">✓</span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                  ))}

                  {/* League Newsroom plans */}
                  {PLANS_ORDER.map((plan) => (
                    <td key={`league-newsroom-${plan}`} className="p-4 text-center">
                      {feature[plan] ? (
                        <span className="text-football-cyan font-bold">✓</span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Plan cards with CTAs */}
        <div className="grid grid-cols-7 gap-4">
          {/* Free */}
          <PlanCard tier="free" plan={null} />

          {/* All-Access */}
          {PLANS_ORDER.map((plan) => (
            <PlanCard key={`all-access-${plan}`} tier="all-access" plan={plan} />
          ))}

          {/* League Newsroom */}
          {PLANS_ORDER.map((plan) => (
            <PlanCard key={`league-newsroom-${plan}`} tier="league-newsroom" plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanHeader({
  tier,
  plan,
  recommended,
}: {
  tier: TierType;
  plan: PlanType | null;
  recommended: boolean;
}) {
  const tierData = TIERS[tier];
  const planData = plan ? PLANS[plan] : null;

  return (
    <div className={`p-4 rounded-t-2xl border border-white/10 ${recommended ? "border-football-cyan bg-football-cyan/10" : "bg-white/5"}`}>
      {recommended && (
        <div className="text-xs font-bold uppercase tracking-widest text-football-cyan mb-2">
          Recommended
        </div>
      )}
      {plan && <h3 className="font-bold text-lg">{planData?.name}</h3>}
      <p className="text-sm font-bold text-football-cyan">{tierData.name}</p>
      <p className="text-xs text-on-surface-variant mt-1">{tierData.price}</p>
    </div>
  );
}

function PlanCard({
  tier,
  plan,
}: {
  tier: TierType;
  plan: PlanType | null;
}) {
  const tierData = TIERS[tier];
  const planData = plan ? PLANS[plan] : null;

  return (
    <div className={`rounded-b-2xl border border-t-0 border-white/10 bg-white/5 p-4 ${tier === "free" ? "col-span-1" : "col-span-1"}`}>
      <button
        onClick={() => {
          if (plan) {
            window.location.href = `/onboarding/result?tier=${tier}&plan=${plan}`;
          } else {
            window.location.href = `/dashboard?tier=${tier}`;
          }
        }}
        className="w-full rounded-lg bg-football-cyan/20 border border-football-cyan/40 px-3 py-2 text-xs font-bold text-football-cyan transition hover:bg-football-cyan/30"
      >
        Choose
      </button>
    </div>
  );
}
