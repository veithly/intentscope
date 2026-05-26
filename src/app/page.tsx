import Link from "next/link";
import { ArrowRight, BookOpen, RadioTower, Route } from "lucide-react";
import { RouteRadar } from "@/components/RouteRadar";
import { Card, Pill, SectionHeader, SiteShell } from "@/components/Shell";
import { fetchChainCount, fetchRouteSnapshot } from "@/lib/lifi";

export default async function HomePage() {
  const stats = await getStats();
  return (
    <SiteShell>
      <SectionHeader kicker="LI.FI Intents flight recorder" title="Turn one live quote into a trace builders can understand.">
        IntentScope calls the real LI.FI Intents order API, explains the response fields, and saves a replayable teaching trace for launch-window content.
      </SectionHeader>
      <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-5">
          <Card className="min-h-[28rem]">
            <div className="flex flex-wrap gap-2">
              <Pill tone="green">Live quote endpoint</Pill>
              <Pill>Route inventory</Pill>
              <Pill tone="slate">Solver-aware explainer</Pill>
            </div>
            <h2 className="mt-8 max-w-3xl text-4xl font-semibold leading-tight text-slate-50 md:text-6xl">
              See the route, the quote id, the output preview, and the failure policy in one screen.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              The product is built for developers who want protocol truth quickly: endpoint names, current response fields, and no invented settlement claims.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Trace a live intent
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/app/routes"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-100 transition hover:border-sky-400"
              >
                Inspect routes
              </Link>
            </div>
          </Card>
          <div className="grid gap-5 md:grid-cols-3">
            <Stat icon={<RadioTower className="h-5 w-5" />} label="Supported chains" value={String(stats.chainCount)} />
            <Stat icon={<Route className="h-5 w-5" />} label="Active teaching routes" value={String(stats.routeCount)} />
            <Stat icon={<BookOpen className="h-5 w-5" />} label="Trace steps" value="4" />
          </div>
        </div>
        <RouteRadar />
      </section>
    </SiteShell>
  );
}

async function getStats() {
  try {
    const [chainCount, routes] = await Promise.all([fetchChainCount(), fetchRouteSnapshot()]);
    return { chainCount, routeCount: routes.routes.length };
  } catch {
    return { chainCount: 0, routeCount: 0 };
  }
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <div className="flex items-center gap-3 text-sky-300">{icon}</div>
      <p className="mt-4 text-4xl font-semibold text-slate-50">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{label}</p>
    </Card>
  );
}
