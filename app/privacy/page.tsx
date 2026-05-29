import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 py-20">
        <div className="mb-10">
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition">← Home</Link>
        </div>

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-12">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">What we collect</h2>
            <p>When you create an account, we collect your email address and a password (stored securely via Supabase). When you connect a fantasy league, we store league metadata (team names, scores, roster data) from Yahoo Fantasy or Sleeper. We do not collect payment information directly — billing is handled by Stripe.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">How we use your data</h2>
            <p>Your league data is used exclusively to generate AI-powered content and tools for your use. We batch and cache AI generation to reduce costs and improve performance — cached content is stored in our database for up to 24 hours. We do not sell your data to third parties. We do not use your data to train AI models.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Third-party services</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-white">Supabase</span> — database and authentication</li>
              <li><span className="text-white">Groq</span> — AI inference (your league data is sent to Groq to generate content)</li>
              <li><span className="text-white">Yahoo Fantasy API</span> — league data (OAuth-gated)</li>
              <li><span className="text-white">Sleeper API</span> — league data (public API)</li>
              <li><span className="text-white">Vercel</span> — hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Sharing and shareable graphics</h2>
            <p>When you share a recap or graphic, the content becomes publicly accessible via a share link. Free tier shares include a SportsHQ watermark. All-Access and League Newsroom shares are clean. You control what you share.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Data retention and deletion</h2>
            <p>You can delete your account at any time from Settings → Danger zone. Deletion removes your account, linked leagues, and cached content within 30 days. Yahoo OAuth tokens are revoked on deletion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Cookies</h2>
            <p>We use session cookies for authentication and a short-lived cookie for Yahoo OAuth state verification. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Contact</h2>
            <p>Questions about privacy? Email us at privacy@sportshq.app.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
