import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070b11] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 text-center">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/5 px-5 py-2 text-sm text-cyan-300">
            SportsHQ AI Platform
          </div>

          <h1 className="mx-auto mt-8 max-w-6xl text-6xl font-black leading-[0.95] md:text-8xl">
            One Platform.
            <span className="gradient block">Four Fantasy Sports Engines.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-zinc-400">
            SportsHQ powers AI-generated fantasy sports insights across football,
            hockey, basketball, and baseball.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-black transition hover:bg-cyan-300"
            >
              Launch Gridiron
            </Link>

            <a
              href="#engines"
              className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold transition hover:border-cyan-400/40"
            >
              Platform Roadmap
            </a>
          </div>
        </div>
      </section>

      {/* Product Engines */}
      <section id="engines" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12">
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">Product Engines</div>
          <h2 className="mt-4 text-5xl font-black">Built For Every Fantasy League.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ProductCard name="Gridiron" description="Fantasy Football AI Assistant" status="LIVE" live accent="#ef4444" />
          <ProductCard name="Rink"     description="Fantasy Hockey AI Assistant"   status="COMING SOON" accent="#3b82f6" />
          <ProductCard name="Hoops"    description="Fantasy Basketball AI Assistant" status="COMING SOON" accent="#f97316" />
          <ProductCard name="Dugout"   description="Fantasy Baseball AI Assistant"   status="COMING SOON" accent="#22c55e" />
        </div>
      </section>
    </main>
  );
}
