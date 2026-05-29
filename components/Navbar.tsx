import Link from "next/link";
import { SportsHQLogo } from "@/components/SportLogo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-obsidian-900/80 glass-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <SportsHQLogo size={32} />
          <span className="font-display text-2xl font-bold tracking-tight text-on-surface">
            SportsHQ
          </span>
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
  );
}
