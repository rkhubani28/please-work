"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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
      options: { data: { full_name: name } },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    // Supabase sends a confirmation email — show success state
    setSuccess(true);
    setLoading(false);
  }

  function handleYahoo() {
    window.location.href = "/api/yahoo/auth";
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b11] px-6">
        <div className="w-full max-w-md text-center">
          <div className="rounded-3xl border border-white/10 bg-[#11161d] p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/10 text-4xl">
              ✓
            </div>
            <h2 className="text-2xl font-black text-white">Check your email</h2>
            <p className="mt-3 text-zinc-400">
              We sent a confirmation link to <span className="text-white">{email}</span>. Click it to activate your account.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-block rounded-xl bg-cyan-400 px-8 py-3 font-semibold text-black transition hover:bg-cyan-300"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070b11] px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400 text-black font-black text-lg">
              HQ
            </div>
            <div>
              <div className="text-2xl font-black text-white">SportsHQ</div>
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Gridiron</div>
            </div>
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#11161d] p-10">
          <h1 className="text-3xl font-black text-white">Create account</h1>
          <p className="mt-2 text-sm text-zinc-400">Join SportsHQ and start dominating your league</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
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
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 py-3.5 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-zinc-500">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={handleYahoo}
            disabled={loading}
            className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 py-3.5 font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/10 disabled:opacity-60"
          >
            Continue with Yahoo Fantasy
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
