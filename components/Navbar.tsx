import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-black font-black">
            HQ
          </div>

          <div>
            <div className="text-2xl font-black">SportsHQ</div>
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Fantasy Sports AI Platform
            </div>
          </div>
        </div>

        <nav className="hidden gap-8 text-zinc-300 md:flex">
          <a href="#engines" className="hover:text-white">Products</a>
          <a href="#engines" className="hover:text-white">Roadmap</a>
        </nav>

        <Link
          href="/login"
          className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-black transition hover:bg-cyan-300"
        >
          Launch Gridiron
        </Link>
      </div>
    </header>
  );
}