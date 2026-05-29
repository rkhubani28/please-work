import Link from "next/link";
import { SportsHQLogo } from "@/components/SportLogo";

export default function Navbar() {
  return (
    <>
      {/* Beta strip */}
      <div className="w-full bg-football-cyan/10 border-b border-football-cyan/20 px-5 py-2 text-center">
        <p className="text-xs text-football-cyan font-mono">
          <span className="font-bold uppercase tracking-widest mr-2">Beta</span>
          AI recommendations may be inaccurate. Do not make decisions based solely on this content.{" "}
          <Link href="/accuracy" className="underline underline-offset-2 opacity-70 hover:opacity-100">
            Accuracy tracking →
          </Link>
        </p>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-obsidian-900/80 glass-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <SportsHQLogo size={48} />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="/accuracy" className="hover:text-white transition">Accuracy</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="btn-ghost rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="btn-primary rounded-lg px-4 py-2 font-mono text-[11px] uppercase tracking-wider"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
