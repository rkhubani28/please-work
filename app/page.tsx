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

        {/* Analytics highlight */}
        <section className="relative z-10 px-5 pb-32">
          <div className="mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl glass-blur">
            <div className="flex flex-col items-center md:flex-row">
              <div className="p-10 md:w-1/2">
                <span className="mb-4 block font-mono text-[11px] uppercase tracking-[0.2em] text-football-cyan">
                  DATA_VIZ / PROFESSIONAL
                </span>
                <h2 className="mb-4 font-display text-[32px] font-bold leading-[1.1] tracking-tight">
                  Elite Fantasy Analytics for Professionals
                </h2>
                <p className="mb-8 text-lg text-on-surface-variant">
                  Access the same neural models used by top-tier fantasy professionals.
                  Our engines crunch millions of data points per minute to give you the
                  winning edge.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
                    <span className="block font-mono text-2xl font-bold text-football-cyan">99.8%</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Accuracy
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
                    <span className="block font-mono text-2xl font-bold text-football-cyan">5ms</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Latency
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] w-full overflow-hidden bg-black md:w-1/2">
                <div className="absolute inset-0 grid-overlay opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-br from-football-cyan/20 via-transparent to-hockey-red/20" />
                <div className="absolute inset-0 scanline-overlay opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-obsidian-900 via-transparent to-transparent" />
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
