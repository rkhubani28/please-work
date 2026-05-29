import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black/30 px-5 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-lg font-bold mb-2">SportsHQ</div>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-[180px]">
              AI fantasy tools + league coverage. Cheap, credible, and honest about both.
            </p>
          </div>

          <div>
            <div className="label-caps text-zinc-600 mb-3">Product</div>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/accuracy" className="hover:text-white transition">Accuracy tracking</Link></li>
              <li><Link href="/signup" className="hover:text-white transition">Sign up free</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Sign in</Link></li>
            </ul>
          </div>

          <div>
            <div className="label-caps text-zinc-600 mb-3">Platform</div>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/signup" className="text-football-cyan/70 hover:text-football-cyan transition">Yahoo Fantasy</Link></li>
              <li><Link href="/signup" className="text-football-cyan/70 hover:text-football-cyan transition">Sleeper</Link></li>
              <li className="text-zinc-700">ESPN (coming)</li>
            </ul>
          </div>

          <div>
            <div className="label-caps text-zinc-600 mb-3">Legal</div>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} SportsHQ. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">
            Powered by{" "}
            <span className="text-zinc-600">Groq · Supabase · Next.js</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
