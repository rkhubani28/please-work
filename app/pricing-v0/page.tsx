"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS, TIERS } from "@/lib/pricing";
import type { PlanType, TierType } from "@/lib/types";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("double");
  const [selectedTier, setSelectedTier] = useState<TierType>("all-access");

  const planArray = Object.values(PLANS) as typeof PLANS[keyof typeof PLANS][];
  const tierArray = Object.values(TIERS) as typeof TIERS[keyof typeof TIERS][];

  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 glass-blur p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Pricing</h1>
          <p className="text-xl text-on-surface-variant">
            Pick your emphasis (plan) and depth (tier). All plans available at all tiers.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        {/* Plan Selection */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">1. Choose your emphasis</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {planArray.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as PlanType)}
                className={`rounded-2xl border p-8 glass-blur transition ${
                  selectedPlan === plan.id
                    ? "border-football-cyan bg-football-cyan/10 shadow-[0_0_40px_rgba(0,240,255,0.2)]"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-on-surface-variant mb-4">{plan.builtFor}</p>
                <div className="inline-flex rounded-full bg-football-cyan/10 px-3 py-1 text-xs font-bold text-football-cyan">
                  {plan.contentRatio}% content / {plan.analyticsRatio}% analytics
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tier Selection */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">2. Choose your depth</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tierArray.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id as TierType)}
                className={`rounded-2xl border p-8 glass-blur transition ${
                  selectedTier === tier.id
                    ? "border-football-cyan bg-football-cyan/10 shadow-[0_0_40px_rgba(0,240,255,0.2)]"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-2xl font-bold text-football-cyan mb-4">{tier.price}</p>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  <li>
                    {tier.leagues === 1 ? "1 league" : tier.leagues === 999 ? "Unlimited" : `${tier.leagues} leagues`}
                  </li>
                  <li>{tier.depth === "metered" ? "Metered" : "Full"} access</li>
                  <li>
                    {tier.sharing === "watermarked"
                      ? "Watermarked sharing"
                      : tier.sharing === "clean"
                      ? "Clean graphics"
                      : "League-branded"}
                  </li>
                </ul>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-football-cyan/30 bg-football-cyan/5 p-12 glass-blur text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Your selection</h2>
          <p className="text-2xl mb-6">
            <span className="font-bold text-football-cyan">{PLANS[selectedPlan].name}</span>
            {" at "}
            <span className="font-bold text-football-cyan">{TIERS[selectedTier].name}</span>
          </p>
          <p className="text-on-surface-variant mb-8">
            {PLANS[selectedPlan].name} emphasizes{" "}
            {PLANS[selectedPlan].contentRatio > 50
              ? "coverage and storytelling"
              : PLANS[selectedPlan].analyticsRatio > 50
              ? "tools and analytics"
              : "both equally"}
            . {TIERS[selectedTier].name} gives you{" "}
            {TIERS[selectedTier].depth === "metered"
              ? "a metered taste"
              : "full access"}{" "}
            across {TIERS[selectedTier].leagues === 999 ? "unlimited" : "1"} league(s).
          </p>
          <Link
            href={`/dashboard-v0?plan=${selectedPlan}&tier=${selectedTier}`}
            className="inline-block rounded-xl bg-football-cyan px-8 py-4 font-bold text-obsidian-900 transition hover:bg-football-cyan/80"
          >
            Get started
          </Link>
        </div>

        {/* 9-Combination Matrix */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">All combinations</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 font-bold">Plan</th>
                  {tierArray.map((tier) => (
                    <th key={tier.id} className="text-left p-4 font-bold text-football-cyan">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {planArray.map((plan) => (
                  <tr key={plan.id} className="border-b border-white/10">
                    <td className="p-4 font-bold">{plan.name}</td>
                    {tierArray.map((tier) => (
                      <td key={`${plan.id}-${tier.id}`} className="p-4 text-sm text-on-surface-variant">
                        <button
                          onClick={() => {
                            setSelectedPlan(plan.id as PlanType);
                            setSelectedTier(tier.id as TierType);
                          }}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10 hover:border-football-cyan/30"
                        >
                          {plan.contentRatio}% / {plan.analyticsRatio}%<br />
                          {tier.price}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">FAQ</h2>
          <div className="space-y-6">
            {[
              {
                q: "What if I'm not sure which plan is right for me?",
                a: "Start with The Double (balanced). You can change your emphasis anytime without losing data.",
              },
              {
                q: "Can I upgrade or downgrade my tier?",
                a: "Yes. Your plan (emphasis) is independent from your tier (depth/price). Change either anytime.",
              },
              {
                q: "Does League Newsroom include everyone in my league?",
                a: "Yes. One commissioner buys it for the whole league. Members can view without creating an account (though account access gets more features).",
              },
              {
                q: "What happens when my subscription expires?",
                a: "Your plan stays; you just lose access to paid features. Reconnect anytime to resume.",
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 glass-blur">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-on-surface-variant">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
