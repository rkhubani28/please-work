import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface">
      <Navbar />

      <main className="relative min-h-screen bg-mesh-gradient">
        {/* Digital frontier overlays */}
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
        <div className="pointer-events-none absolute inset-0 scanline-overlay opacity-10" />

        {/* Hero */}
        <section className="relative z-10 flex flex-col items-center px-5 pb-32 pt-16 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-football-cyan/40 bg-football-cyan/10 px-4 py-1.5 backdrop-blur-md">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-football-cyan">
              SportsHQ AI Platform v2.0
            </span>
          </div>

          <h1 className="mb-6 max-w-4xl font-display text-[32px] font-extrabold leading-[1.1] tracking-tight md:text-7xl">
            One Platform. <br />
            <span className="gradient">Four Fantasy Sports Engines.</span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            SportsHQ powers next-generation AI insights across the global fantasy
            landscape. Precision data for elite competitors.
          </p>

          <div className="flex w-full max-w-md flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="btn-primary flex-1 rounded-xl py-4 text-center font-bold"
            >
              Launch Gridiron
            </Link>
            <a
              href="#engines"
              className="btn-ghost flex-1 rounded-xl py-4 text-center font-bold"
            >
              Platform Roadmap
            </a>
          </div>
        </section>

        {/* Product engines */}
        <section id="engines" className="relative z-10 mx-auto max-w-[1280px] px-5 pb-32">
          <div className="mb-12">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.3em] text-football-cyan">
              SYSTEM_CORE / ENGINES
            </span>
            <h2 className="font-display text-[32px] font-bold tracking-tight">
              Built For Every Fantasy League.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <ProductCard name="Gridiron" description="Fantasy Football AI Assistant" status="LIVE" live accent="#FF3B3B" />
            <ProductCard name="Rink" description="Fantasy Hockey AI Assistant" status="STAGING" accent="#00F0FF" />
            <ProductCard name="Hoops" description="Fantasy Basketball AI Assistant" status="STAGING" accent="#FF8A00" />
            <ProductCard name="Dugout" description="Fantasy Baseball AI Assistant" status="STAGING" accent="#00FF66" />
          </div>
        </section>

        {/* How it works */}
        <section className="relative z-10 px-5 pb-32">
          <div className="mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl glass-blur">
            <div className="flex flex-col md:flex-row">
              <div className="p-10 md:w-1/2">
                <span className="mb-4 block font-mono text-[11px] uppercase tracking-[0.2em] text-football-cyan">
                  HOW_IT_WORKS
                </span>
                <h2 className="mb-4 font-display text-[32px] font-bold leading-[1.1] tracking-tight">
                  Connect your league. Let the AI do the rest.
                </h2>
                <p className="mb-8 text-lg text-on-surface-variant">
                  Gridiron links to your Yahoo Fantasy Football league and turns your
                  real matchups, scores, and rosters into AI-written insights. No
                  setup, no spreadsheets — every feature unlocks the moment your
                  league is connected.
                </p>
                <div className="space-y-3">
                  {[
                    ["01", "Connect your Yahoo Fantasy league in one click"],
                    ["02", "Get AI-written weekly recaps of your matchups"],
                    ["03", "See power rankings and analyze trades instantly"],
                  ].map(([num, text]) => (
                    <div key={num} className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
                      <span className="font-mono text-sm font-bold text-football-cyan">{num}</span>
                      <span className="text-on-surface-variant">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center gap-6 p-10 md:w-1/2">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
                  <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-football-cyan">Weekly Recaps</div>
                  <p className="text-on-surface-variant">Beat-reporter-style summaries of every matchup, written from your actual box scores.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
                  <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-football-cyan">Power Rankings</div>
                  <p className="text-on-surface-variant">League-wide rankings with trend calls and AI commentary on who&apos;s rising and falling.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
                  <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-football-cyan">Trade Analyzer</div>
                  <p className="text-on-surface-variant">Paste any proposed trade and get a clear Accept / Decline / Neutral verdict with reasoning.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-obsidian-900 py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 px-5 text-center">
          <span className="font-display text-xl font-bold tracking-tight text-on-surface">
            SportsHQ
          </span>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {["Terms", "Privacy", "Support", "Twitter"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-mono text-[11px] uppercase tracking-widest text-on-surface-variant transition-colors hover:text-football-cyan"
              >
                {item}
              </a>
            ))}
          </nav>
          <p className="font-mono text-[11px] uppercase text-on-surface-variant opacity-50">
            © 2024 SPORTSHQ_OS // ELITE_FANTASY_ANALYTICS.SYS
          </p>
        </div>
      </footer>
    </div>
  );
}
