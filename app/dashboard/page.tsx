export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#070b11] text-white">
      <div className="flex">
        <aside className="min-h-screen w-72 border-r border-white/10 bg-black/30 p-6">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-black font-black">
              HQ
            </div>

            <div>
              <div className="text-2xl font-black">SportsHQ</div>
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Gridiron
              </div>
            </div>
          </div>

          <nav className="space-y-3">
            <div className="rounded-xl bg-cyan-400/10 p-4 text-cyan-300">
              Dashboard
            </div>

            <div className="rounded-xl p-4 text-zinc-400">Recaps</div>
            <div className="rounded-xl p-4 text-zinc-400">Power Rankings</div>
            <div className="rounded-xl p-4 text-zinc-400">Trade Analyzer</div>
            <div className="rounded-xl p-4 text-zinc-400">Trash Talk</div>
          </nav>
        </aside>

        <div className="flex-1 p-10">
          <div className="rounded-3xl border border-white/10 bg-[#11161d] p-12">
            <div className="inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              Fantasy Football AI
            </div>

            <h1 className="mt-6 text-6xl font-black">
              Welcome to Gridiron.
            </h1>

            <p className="mt-6 max-w-2xl text-xl text-zinc-400">
              AI-generated fantasy football insights, weekly recaps,
              power rankings, matchup previews, and league analysis.
            </p>

            <button className="mt-10 rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-black transition hover:bg-cyan-300">
              Connect Yahoo League
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}