import { NoQuotePlayground } from "@/components/NoQuotePlayground";
import { SectionHeader, SiteShell } from "@/components/Shell";

export default function PlaygroundPage() {
  return (
    <SiteShell>
      <SectionHeader kicker="No-Quote Playground" title="Show the empty response path without hiding the truth.">
        A useful integration teaches what to do when the endpoint answers but returns no eligible quote. This path preserves the actual response and explains likely causes.
      </SectionHeader>
      <section className="mx-auto max-w-7xl pb-12">
        <NoQuotePlayground />
      </section>
    </SiteShell>
  );
}
