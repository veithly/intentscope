import { SectionHeader, SiteShell } from "@/components/Shell";
import { TraceWorkbench } from "@/components/TraceWorkbench";

export default function TraceLabPage() {
  return (
    <SiteShell>
      <SectionHeader kicker="Trace Lab" title="Run the live quote path, then inspect every field.">
        The hero flow sends a real exact-input intent request to LI.FI and turns the response into a quote receipt, timeline, and exportable explanation.
      </SectionHeader>
      <section className="mx-auto max-w-7xl pb-12">
        <TraceWorkbench />
      </section>
    </SiteShell>
  );
}
