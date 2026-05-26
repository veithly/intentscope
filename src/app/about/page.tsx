import Link from "next/link";
import { Card, SectionHeader, SiteShell } from "@/components/Shell";

const sources = [
  ["LI.FI Intents docs", "https://docs.li.fi/lifi-intents/introduction"],
  ["Order API reference", "https://order.li.fi/docs"],
  ["Supported chains endpoint", "https://order.li.fi/chains/supported"],
  ["Route inventory endpoint", "https://order-dev.li.fi/routes"],
];

export default function AboutPage() {
  return (
    <SiteShell>
      <SectionHeader kicker="Architecture" title="A small tool with a clear trust boundary.">
        IntentScope is not a wallet and does not claim settlement. It is a developer education surface that proxies live LI.FI endpoints and stores local traces.
      </SectionHeader>
      <section className="mx-auto grid max-w-7xl gap-5 pb-12 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <h2 className="text-2xl font-semibold text-slate-50">Request path</h2>
          <ol className="mt-5 space-y-4 text-slate-300">
            <li>1. Browser sends `POST /api/trace/live`.</li>
            <li>2. Route handler calls `POST https://order.li.fi/quote/request`.</li>
            <li>3. Response is normalized into a `TraceRecord`.</li>
            <li>4. Trace is persisted locally and optionally maps to Cloudflare KV.</li>
            <li>5. UI renders quote receipt, field notes, and export copy.</li>
          </ol>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold text-slate-50">Sources</h2>
          <div className="mt-5 grid gap-3">
            {sources.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sky-200 transition hover:border-sky-400">
                {label}
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </SiteShell>
  );
}
