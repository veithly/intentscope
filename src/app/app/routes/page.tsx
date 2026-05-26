import { RouteLab } from "@/components/RouteLab";
import { SectionHeader, SiteShell } from "@/components/Shell";
import { fetchRouteSnapshot } from "@/lib/lifi";

export default async function RoutesPage() {
  const snapshot = await fetchRouteSnapshot();
  return (
    <SiteShell>
      <SectionHeader kicker="Route Lab" title="Inspect active routes before talking about solver strategy.">
        IntentScope uses live LI.FI route inventory so the solver explanation starts from concrete amount ranges, token addresses, and chain pairs.
      </SectionHeader>
      <section className="mx-auto max-w-7xl pb-12">
        <RouteLab initialSnapshot={snapshot} />
      </section>
    </SiteShell>
  );
}
