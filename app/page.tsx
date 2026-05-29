import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative flex flex-col items-center px-5 pb-24 pt-20 text-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />
          <div className="pointer-events-none absolute inset-0 bg-mesh-gradient" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-football-cyan/30 bg-football-cyan/8 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-football-cyan animate-pulse" />
              <span className="label-caps text-football-cyan">Football · Free to start · From $2.99/mo</span>
            </div>

            <h1 className="mb-6 font-display text-5xl font-extrabold leading-[1.08] tracking-tight md:text-7xl">
              AI fantasy tools{" "}
              <span className="text-on-surface-variant font-normal">+</span>
              <br />
              <span className="gradient">league coverage.</span>
              <br />
              One product. One low price.
            </h1>

            <p className="mb-4 max-w-2xl mx-auto text-lg leading-relaxed text-on-surface-variant md:text-xl">
              The analytic tools managers make decisions with — start/sit, waivers, trade analysis,
              projections. And the AI media layer that covers your league all season long.
            </p>
            <p className="mb-10 text-base text-zinc-500">
              Both headline products. Neither hidden behind the other. Priced for real managers.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="btn-primary rounded-xl px-8 py-4 text-base font-bold w-full sm:w-auto"
              >
                Start free — no card needed
              </Link>
              <Link
                href="/pricing"
                className="btn-ghost rounded-xl px-8 py-4 text-base font-semibold w-full sm:w-auto"
              >
                See pricing →
              </Link>
            </div>

            <p className="mt-5 text-xs text-zinc-600">
              Free tier: 1 league · metered tools + coverage · watermarked sharing
            </p>
          </div>
        </section>

        {/* Two headline products */}
        <section className="px-5 pb-24 pt-4">
          <div className="max-w-6xl mx-auto">
            <p className="label-caps text-zinc-600 text-center mb-10">Two headline products. Pick your emphasis.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Tools */}
              <div className="rounded-2xl border border-white/10 bg-surface-1/60 p-8 glass-blur">
                <div className="mb-4 inline-flex rounded-full bg-football-cyan/10 px-3 py-1 text-xs font-bold text-football-cyan label-caps">
                  The Tools
                </div>
                <h2 className="text-2xl font-bold mb-3">Make better decisions, every week.</h2>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
                  AI-powered lineup optimizer, waiver wire recommendations, trade analyzer, and
                  weekly projections — all explained in plain language about your roster.
                </p>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  {["Start/Sit optimizer", "Waiver wire rankings", "Trade analyzer with verdict", "Weekly projections"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-football-cyan text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-xs text-zinc-600">
                  Built for: The Edge-Seeker → <span className="text-football-cyan">The War Room plan</span>
                </div>
              </div>

              {/* Coverage */}
              <div className="rounded-2xl border border-white/10 bg-surface-1/60 p-8 glass-blur">
                <div className="mb-4 inline-flex rounded-full bg-football-cyan/10 px-3 py-1 text-xs font-bold text-football-cyan label-caps">
                  The Coverage
                </div>
                <h2 className="text-2xl font-bold mb-3">Your league deserves a beat reporter.</h2>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
                  Weekly recaps, power ranking columns, season storylines, awards, and headlines —
                  AI-generated for your specific matchups and roster drama.
                </p>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  {["Weekly matchup recaps", "Power ranking columns", "Season storylines + arcs", "Awards + weekly headlines"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-football-cyan text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-xs text-zinc-600">
                  Built for: The League Character → <span className="text-football-cyan">The Beat plan</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-football-cyan/20 bg-football-cyan/5 p-6 text-center glass-blur">
              <p className="text-sm text-on-surface-variant">
                Can't decide?{" "}
                <span className="text-white font-semibold">The Double</span> gives you both, 50/50.
                It's the default for a reason.
              </p>
              <Link
                href="/pricing"
                className="mt-3 inline-block text-xs text-football-cyan font-bold hover:underline"
              >
                Compare all 3 plans →
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing summary */}
        <section className="px-5 pb-24">
          <div className="max-w-4xl mx-auto">
            <p className="label-caps text-zinc-600 text-center mb-4">Pricing</p>
            <h2 className="text-3xl font-bold text-center mb-2">
              Pick your emphasis. Pick your depth.
            </h2>
            <p className="text-center text-on-surface-variant mb-12 text-sm">
              Same price within a tier regardless of plan — emphasis is a preference, not a price lever.
            </p>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  name: "Free",
                  price: "$0",
                  sub: "Forever",
                  items: ["1 league", "Metered tools + coverage", "Watermarked sharing", "Start/sit basics"],
                  cta: "Start free",
                  href: "/signup",
                  highlight: false,
                },
                {
                  name: "All-Access",
                  price: "$2.99",
                  sub: "/mo or $12/season",
                  items: ["All your leagues", "Full tools + coverage suite", "Clean shareable graphics", "Personal media feed"],
                  cta: "Get All-Access",
                  href: "/signup?tier=all-access",
                  highlight: true,
                },
                {
                  name: "League Newsroom",
                  price: "$39",
                  sub: "/season · whole league",
                  items: ["Commissioner buys for league", "All members get full access", "League-branded hub + sharing", "~$3/member in a 12-team league"],
                  cta: "Commission a league",
                  href: "/signup?tier=league-newsroom",
                  highlight: false,
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl border p-8 glass-blur flex flex-col ${
                    tier.highlight
                      ? "border-football-cyan/50 bg-football-cyan/5 shadow-glow"
                      : "border-white/10 bg-surface-1/40"
                  }`}
                >
                  {tier.highlight && (
                    <div className="mb-4 self-start rounded-full bg-football-cyan px-3 py-0.5 text-[10px] font-bold text-obsidian-900 label-caps">
                      Most popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <div className="mb-1">
                    <span className="text-3xl font-black text-football-cyan">{tier.price}</span>
                    <span className="text-sm text-zinc-500 ml-1">{tier.sub}</span>
                  </div>
                  <ul className="mt-5 mb-8 space-y-2 text-sm text-on-surface-variant flex-1">
                    {tier.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="text-football-cyan text-xs">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.href}
                    className={`rounded-xl py-3 text-center text-sm font-bold transition ${
                      tier.highlight
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth loop */}
        <section className="px-5 pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="label-caps text-zinc-600 mb-4">How leagues grow</p>
            <h2 className="text-3xl font-bold mb-4">Tools acquire. Story spreads.</h2>
            <p className="text-on-surface-variant mb-12 text-sm">
              The unit of growth is the league, not the individual.
            </p>
            <div className="flex flex-col gap-4 text-left">
              {[
                { n: "1", t: "Generate", d: "You generate a recap or graphic about a matchup — i.e. a leaguemate." },
                { n: "2", t: "Share", d: "Drop it in the league chat. Every artifact includes a growth CTA." },
                { n: "3", t: "Convert", d: "The recipient is pre-qualified — it's their league — so connect-rate is high." },
                { n: "4", t: "Compound", d: "New members join, use the free taste, and some convert to All-Access." },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-5 rounded-2xl border border-white/8 bg-surface-1/40 p-6 glass-blur">
                  <div className="flex-shrink-0 h-9 w-9 rounded-full bg-football-cyan/10 border border-football-cyan/30 flex items-center justify-center text-football-cyan font-black text-sm">
                    {step.n}
                  </div>
                  <div>
                    <div className="font-bold mb-1">{step.t}</div>
                    <div className="text-sm text-on-surface-variant">{step.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 pb-32 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Start free today.</h2>
            <p className="text-on-surface-variant mb-8 text-base">
              Connect your Yahoo or Sleeper league in 60 seconds.
              No credit card required for the free tier.
            </p>
            <Link
              href="/signup"
              className="btn-primary inline-block rounded-xl px-10 py-4 text-base font-bold"
            >
              Get started free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
