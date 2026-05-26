import { SectionHeader, SiteShell } from "@/components/Shell";
import { TraceHistory } from "@/components/TraceHistory";

export default function TracesPage() {
  return (
    <SiteShell>
      <SectionHeader kicker="Trace History" title="Reopen saved traces and export teaching copy.">
        The local trace ledger keeps the latest quote runs so the demo can show persistence and content reuse after a hard refresh.
      </SectionHeader>
      <section className="mx-auto max-w-7xl pb-12">
        <TraceHistory />
      </section>
    </SiteShell>
  );
}
