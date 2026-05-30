"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { PLANS, TIERS, getDescription } from "@/lib/pricing";
import type { PlanType, TierType } from "@/lib/types";

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian-900" />}>
      <ResultContent />
    </Suspense>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const tier = (searchParams.get("tier") as TierType) || "free";
  const plan = (searchParams.get("plan") as PlanType) || "double";

  const tierData = TIERS[tier];
  const planData = PLANS[plan];
  const description = getDescription(tier, plan);

  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back to quiz */}
        <Link
          href="/onboarding/quiz"
          className="mb-8 inline-block text-football-cyan hover:text-football-cyan/80 transition text-sm font-bold uppercase"
        >
          ← Back to quiz
        </Link>

        {/* Recommendation card */}
        <div className="rounded-2xl border border-football-cyan/40 bg-white/5 p-12 glass-blur text-center mb-8">
          <div className="mb-6">
            <p className="text-on-surface-variant text-sm uppercase tracking-widest mb-2">
              We recommend
            </p>
            <h1 className="text-5xl font-bold mb-2">{planData.name}</h1>
            <p className="text-2xl font-bold text-football-cyan">{tierData.name}</p>
          </div>

          <p className="text-on-surface-variant text-lg mb-8">{description}</p>

          <div className="mb-8">
            <p className="text-3xl font-bold mb-2">{tierData.price}</p>
            <p className="text-on-surface-variant text-sm">
              {tier === "free"
                ? "Start free"
                : tier === "all-access"
                  ? "Per month or per season"
                  : "Per season for your whole league"}
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = `/dashboard?plan=${plan}&tier=${tier}`;
            }}
            className="w-full rounded-xl bg-football-cyan px-6 py-4 font-bold text-obsidian-900 transition hover:bg-football-cyan/80 text-lg"
          >
            Get {planData.name}
          </button>
        </div>

        {/* View all plans link (bottom right) */}
        <div className="text-right">
          <Link
            href="/pricing/comparison"
            className="text-sm text-football-cyan hover:text-football-cyan/80 transition underline"
          >
            View all plans & compare →
          </Link>
        </div>
      </div>
    </div>
  );
}
