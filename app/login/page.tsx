"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    // Simulate auth — replace with real auth when ready
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070b11] px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400 text-black font-black text-lg">
              HQ
            </div>
            <div>
              <div className="text-2xl font-black text-white">SportsHQ</div>
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Gridiron
              </div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-[#11161d] p-10">
          <h1 className="text-3xl font-black text-white">Sign in</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Access your Gridiron dashboard
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 py-3.5 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-zinc-500">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => router.push("/dashboard"), 800);
            }}
            className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 py-3.5 font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/10"
          >
            Continue with Yahoo Fantasy
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
