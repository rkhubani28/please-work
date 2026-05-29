import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const METRICS = [
  {
    metric: "Start/Sit Accuracy",
    description: "Did our start/sit recommendation match what actually scored more?",
    status: "tracking",
    note: "Tracking begins Week 1 of the 2025 NFL season.",
    value: null,
    trend: null,
  },
  {
    metric: "Projection Error (MAE)",
    description: "Mean absolute error between our projected points and actual points scored.",
    status: "tracking",
    note: "Tracking begins Week 1 of the 2025 NFL season.",
    value: null,
    trend: null,
  },
  {
    metric: "Waiver Wire Hit Rate",
    description: "% of top waiver recommendations that outperformed the player dropped.",
    status: "tracking",
    note: "Tracking begins Week 1 of the 2025 NFL season.",
    value: null,
    trend: null,
  },
];

export default function AccuracyPage() {
  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface">
      <Navbar />

      <main className="max-w-4xl mx-auto px-5 py-20">
        {/* Header */}
        <div className="mb-16">
          <div className="mb-4 inline-flex rounded-full border border-football-cyan/30 bg-football-cyan/8 px-3 py-1">
            <span className="label-caps text-football-cyan">Public · Updated weekly</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Accuracy tracking.</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            We track every start/sit call, projection, and waiver recommendation we make — and
            publish the results. No cherry-picking. No spin.
          </p>
        </div>

        {/* Honest context */}
        <div className="mb-12 rounded-2xl border border-white/10 bg-surface-1/40 p-8 glass-blur">
          <h2 className="text-xl font-bold mb-3">Why we publish this.</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
            Established fantasy platforms have years of tracked accuracy data and hundreds of thousands of customers. We don't — yet.
            A cheap, transparent challenger earns patience that a pricey one wouldn't. We're new,
            here's how we're doing, and you can watch us improve.
          </p>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Our projections are built on free open data (nflverse) with AI explanation via Groq.
            Open-source models have rivaled commercial projections on free data alone, so
            "credible enough at near-zero cost" is achievable — but it takes time and honesty to prove.
          </p>
        </div>

        {/* Metrics */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Season 2025 metrics</h2>
          <div className="space-y-4">
            {METRICS.map((m) => (
              <div key={m.metric} className="rounded-2xl border border-white/10 bg-surface-1/40 p-6 glass-blur">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{m.metric}</h3>
                    <p className="text-sm text-zinc-500 mb-3">{m.description}</p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-zinc-800/60 border border-white/10 px-3 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                      <span className="text-xs text-zinc-500">{m.note}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {m.value !== null ? (
                      <div className="text-2xl font-black text-football-cyan">{m.value}</div>
                    ) : (
                      <div className="text-sm font-bold text-zinc-600">—</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="mb-16 rounded-2xl border border-white/10 bg-surface-1/40 p-8 glass-blur">
          <h2 className="text-xl font-bold mb-4">Methodology</h2>
          <div className="space-y-4 text-sm text-on-surface-variant">
            <div>
              <span className="text-white font-semibold">Data source:</span> NFL play-by-play data
              via nflverse (20+ seasons of open data). Consensus public rankings used as a
              sanity-check baseline.
            </div>
            <div>
              <span className="text-white font-semibold">Start/sit accuracy:</span> We record our
              recommendation before games are played. After the week, we check whether the
              recommended starter outscored the benched player. We report accuracy at the player-decision level,
              not the lineup level.
            </div>
            <div>
              <span className="text-white font-semibold">Projection MAE:</span> Mean absolute
              error between our projected points and actual fantasy points scored, measured at the
              individual player level across all positions.
            </div>
            <div>
              <span className="text-white font-semibold">Waiver hit rate:</span> We define a
              "hit" as the recommended pickup outscoring the recommended drop target over the
              following two weeks.
            </div>
            <div>
              <span className="text-white font-semibold">No survivorship bias:</span> Every call
              is logged at the time it's made. We don't remove bad weeks from the sample.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-on-surface-variant mb-6">
            Track our accuracy alongside your season. Start free.
          </p>
          <Link href="/signup" className="btn-primary inline-block rounded-xl px-8 py-4 font-bold">
            Get started free
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
