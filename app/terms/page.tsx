import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 py-20">
        <div className="mb-10">
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition">← Home</Link>
        </div>

        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-zinc-500 text-sm mb-12">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

        <div className="space-y-8 text-sm text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">The service</h2>
            <p>SportsHQ provides AI-generated fantasy football tools and content ("the Service"). You must be 13 or older to use the Service. The Service is provided for personal, non-commercial use.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Accounts</h2>
            <p>You are responsible for keeping your account credentials secure. You may not share accounts. One account per person. We may suspend accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">AI content accuracy</h2>
            <p>Our projections, start/sit recommendations, and waiver rankings are AI-generated and may be wrong. We publish our accuracy publicly and honestly. Do not make financial decisions based solely on our content. The Service is for entertainment and personal decision-support in fantasy sports only.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Platform integrations</h2>
            <p>By connecting a Yahoo or Sleeper league, you grant us read access to your league data to provide the Service. We access only what the platform APIs permit. You may disconnect your league at any time from Settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Subscriptions and billing</h2>
            <p>All-Access is billed monthly at $2.99/mo or $12 for a season pass. League Newsroom is $39/season billed to the commissioner. Subscriptions renew automatically unless cancelled. Refunds are handled on a case-by-case basis — contact us within 7 days of a charge if you have an issue.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Shareable content</h2>
            <p>You own content you create with the Service. By sharing a graphic or recap publicly, you grant SportsHQ a license to display it with attribution. Free tier shares include a watermark; All-Access and League Newsroom shares do not.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Prohibited use</h2>
            <p>You may not use the Service for DFS or real-money gambling advice, for scraping data at scale, to impersonate other users, or to reverse-engineer the AI models or prompts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Disclaimer</h2>
            <p>The Service is provided "as is" without warranty of any kind. We are not liable for inaccurate projections or decisions made based on our content.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Changes</h2>
            <p>We may update these terms. We'll notify you by email for material changes. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">Contact</h2>
            <p>Questions? Email legal@sportshq.app.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
