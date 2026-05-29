"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  function handleYahoo() {
    window.location.href = "/api/yahoo/auth";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.10),transparent_45%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-10 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="btn-primary flex h-12 w-12 items-center justify-center rounded-lg font-display text-lg font-extrabold">
              HQ
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-white">SportsHQ</div>
              <div className="label-caps text-zinc-500">Gridiron</div>
            </div>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-10">
          <h1 className="font-display text-3xl font-extrabold text-white">Sign in</h1>
          <p className="mt-2 text-sm text-zinc-400">Access your Gridiron dashboard</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-glass bg-black px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-electric/60 focus:shadow-glow-blue"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-glass bg-black px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-electric/60 focus:shadow-glow-blue"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-2xl py-3.5 font-bold disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="label-caps text-zinc-600">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={handleYahoo}
            disabled={loading}
            className="btn-ghost mt-6 w-full rounded-2xl py-3.5 font-semibold disabled:opacity-60"
          >
            Continue with Yahoo Fantasy
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary-soft">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
