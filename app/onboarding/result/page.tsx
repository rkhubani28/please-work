"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = searchParams.get("signup") === "true";
  const isChangePlan = searchParams.get("change-plan") === "true";
  const tier = (searchParams.get("tier") as TierType) || "free";
  const plan = (searchParams.get("plan") as PlanType) || "double";

  const tierData = TIERS[tier];
  const planData = PLANS[plan];
  const description = getDescription(tier, plan);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          selected_plan: plan,
          selected_tier: tier,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Send verification email
    try {
      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          confirmationUrl: `${window.location.origin}/auth/callback`,
        }),
      });
    } catch (err) {
      console.error('Failed to send verification email:', err);
    }

    // Show success and redirect
    router.push("/onboarding/success?email=" + encodeURIComponent(email));
  }

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
            <h1 className="font-display text-5xl font-bold mb-2">{planData.name}</h1>
            <p className="font-display text-2xl font-bold text-football-cyan">{tierData.name}</p>
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
        </div>

        {isChangePlan ? (
          // Change plan confirmation
          <div className="rounded-2xl border border-white/10 bg-[#11161d] p-8 text-center">
            <h2 className="font-display text-2xl font-bold mb-4">Update Your Plan</h2>
            <p className="text-zinc-400 mb-6">
              Your plan will be updated to <span className="text-cyan-300 font-bold">{planData.name}</span> on your next login.
            </p>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.updateUser({
                  data: {
                    selected_plan: plan,
                    selected_tier: tier,
                  },
                });
                window.location.href = "/dashboard";
              }}
              className="w-full bg-football-cyan text-obsidian-900 px-6 py-3 rounded-lg font-bold uppercase transition hover:bg-football-cyan/80 mb-4"
            >
              CONFIRM & GO TO DASHBOARD
            </button>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="w-full border border-zinc-600 text-zinc-300 px-6 py-3 rounded-lg font-bold uppercase transition hover:border-zinc-400 hover:text-white"
            >
              CANCEL
            </button>
          </div>
        ) : isSignup ? (
          // Account creation form
          <div className="rounded-2xl border border-white/10 bg-[#11161d] p-8">
            <h2 className="font-display text-2xl font-bold mb-6">Create Your Account</h2>

            <form onSubmit={handleCreateAccount} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full rounded-lg border border-glass bg-black px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-primary/60 focus:shadow-glow"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-glass bg-black px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-primary/60 focus:shadow-glow"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-glass bg-black px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-primary/60 focus:shadow-glow"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-glass bg-black px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-primary/60 focus:shadow-glow"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-football-cyan text-obsidian-900 px-6 py-3 rounded-lg font-bold uppercase transition hover:bg-football-cyan/80 disabled:opacity-60"
              >
                {loading ? "Creating Account…" : "Create Account & Get Started"}
              </button>

              <p className="text-xs text-zinc-500 text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-football-cyan hover:text-football-cyan/80">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        ) : (
          // Plan selection for existing users
          <>
            <button
              onClick={() => {
                window.location.href = `/dashboard?plan=${plan}&tier=${tier}`;
              }}
              className="w-full rounded-xl bg-football-cyan px-6 py-4 font-bold text-obsidian-900 transition hover:bg-football-cyan/80 text-lg mb-4"
            >
              Get {planData.name}
            </button>

            <div className="text-center">
              <Link
                href="/pricing/comparison"
                className="text-sm text-football-cyan hover:text-football-cyan/80 transition underline"
              >
                View all plans & compare →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
