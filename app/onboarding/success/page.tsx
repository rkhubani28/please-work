"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.10),transparent_45%)]" />
      <div className="relative w-full max-w-md text-center">
        <div className="glass-card rounded-xl p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-4xl">
            ✓
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white">Check your email</h2>
          <p className="mt-3 text-zinc-400">
            We sent a confirmation link to <span className="text-white">{decodeURIComponent(email)}</span>. Click it to activate your account.
          </p>
          <Link
            href="/login"
            className="btn-primary mt-8 inline-block rounded-2xl px-8 py-3 font-bold"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
