"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SportsHQLogo } from "@/components/SportLogo";

export default function SignupPage() {
  const router = useRouter();

  // Redirect to onboarding quiz on mount
  useEffect(() => {
    router.push("/onboarding/quiz?signup=true");
  }, [router]);

  return (
    <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse text-white">Redirecting to onboarding...</div>
      </div>
    </div>
  );
}

function SignupPageOld() {
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
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Send verification email via Resend
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
      // Don't block signup if email fails
    }

    // Show success state
    setSuccess(true);
    setLoading(false);
  }

  function handleYahoo() {
    window.location.href = "/api/yahoo/auth";
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.10),transparent_45%)]" />
        <div className="relative w-full max-w-md text-center">
          <div className="glass-card rounded-xl p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-4xl text-primary">
              ✓
            </div>
            <h2 className="font-display text-2xl font-extrabold text-white">Check your email</h2>
            <p className="mt-3 text-zinc-400">
              We sent a confirmation link to <span className="text-white">{email}</span>. Click it to activate your account.
            </p>
            <Link
              href="/login"
              className="btn-primary mt-8 inline-block rounded-2xl px-8 py-3 font-bold"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-16">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.10),transparent_45%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-10 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <SportsHQLogo size={44} />
            <div>
              <div className="font-display text-2xl font-extrabold text-white">SportsHQ</div>
              <div className="label-caps text-zinc-500">Gridiron</div>
            </div>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-10">
          <h1 className="font-display text-3xl font-extrabold text-white">Create account</h1>
          <p className="mt-2 text-sm text-zinc-400">Join SportsHQ and start dominating your league</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Full name</label>
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
              <label className="mb-2 block text-sm font-medium text-zinc-300">Confirm password</label>
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
              className="btn-primary w-full rounded-2xl py-3.5 font-bold disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
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
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary-soft">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
