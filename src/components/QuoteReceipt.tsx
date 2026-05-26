import { formatAmount, shortAddress, timeLeft } from "@/lib/format";
import type { TraceRecord } from "@/lib/types";
import { Card, Pill } from "@/components/Shell";

export function QuoteReceipt({ trace }: { trace: TraceRecord | null }) {
  if (!trace) {
    return (
      <Card className="min-h-[22rem]">
        <div className="flex items-center justify-between">
          <Pill>Waiting for trace</Pill>
          <span className="mono text-xs text-slate-500">POST /quote/request</span>
        </div>
        <div className="mt-16 border-l-2 border-sky-400 pl-6">
          <h2 className="text-2xl font-semibold text-slate-100">A live quote receipt will appear here.</h2>
          <p className="mt-3 text-slate-300">
            IntentScope keeps the original response visible and turns each key field into a developer note.
          </p>
        </div>
      </Card>
    );
  }

  const quote = trace.quote;
  const input = quote?.preview.inputs[0];
  const output = quote?.preview.outputs[0];

  return (
    <Card className="min-h-[22rem]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Pill tone={quote ? "green" : "slate"}>{quote ? "Quote received" : "No eligible quote"}</Pill>
        <span className="mono text-xs text-slate-400">{trace.endpoint}</span>
      </div>
      <div className="mt-6">
        <p className="mono text-xs uppercase tracking-[0.18em] text-slate-400">quoteId</p>
        <h2 className="mt-2 break-all text-2xl font-semibold text-slate-50">{quote?.quoteId ?? trace.id}</h2>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Metric label="Input amount" value={formatAmount(input?.amount, 6)} />
        <Metric label="Output amount" value={formatAmount(output?.amount, 6)} />
        <Metric label="Validity" value={timeLeft(quote?.validUntil)} />
      </div>
      <div className="mt-6 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
          <p className="text-slate-400">Input asset</p>
          <p className="mono mt-2 break-all text-slate-100">{shortAddress(input?.asset)}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
          <p className="text-slate-400">Output asset</p>
          <p className="mono mt-2 break-all text-slate-100">{shortAddress(output?.asset)}</p>
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mono mt-2 text-xl text-sky-200">{value}</p>
    </div>
  );
}
