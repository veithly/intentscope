"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Card, Pill } from "@/components/Shell";
import { formatAmount } from "@/lib/format";
import type { TraceRecord } from "@/lib/types";

export function TraceHistory() {
  const [traces, setTraces] = useState<TraceRecord[]>([]);
  const [selected, setSelected] = useState<TraceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/traces");
    const data = (await response.json()) as { traces: TraceRecord[] };
    setTraces(data.traces);
    setSelected(data.traces[0] ?? null);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const exportText = useMemo(() => {
    if (!selected) return "Run a trace first, then reopen it here for content copy.";
    const quote = selected.quote;
    return quote
      ? `LI.FI Intents trace ${quote.quoteId}: exact-input request, output ${formatAmount(quote.preview.outputs[0]?.amount, 6)}, validity ${quote.validUntil}, failure policy ${quote.failureHandling}.`
      : `LI.FI Intents trace ${selected.id}: endpoint answered with no eligible quote, which is a useful integration state to explain rather than hide.`;
  }, [selected]);

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportText);
    } catch {
      // Clipboard permission can be unavailable in automated browsers.
    }
    setCopied(true);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_28rem]">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">saved traces</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-50">Trace history</h2>
          </div>
          <button
            onClick={load}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-600 px-4 py-2 text-slate-100 transition hover:border-sky-400"
          >
            <RefreshCw className="h-4 w-4" />
            Reload
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {loading ? <p className="text-slate-300">Loading saved traces...</p> : null}
          {!loading && traces.length === 0 ? <p className="text-slate-300">No traces saved yet. Run the Trace Lab first.</p> : null}
          {traces.map((trace) => (
            <button
              key={trace.id}
              onClick={() => {
                setSelected(trace);
                setCopied(false);
              }}
              className={`rounded-xl border p-4 text-left transition ${
                selected?.id === trace.id ? "border-sky-400 bg-sky-400/10" : "border-slate-700 bg-slate-950/50 hover:border-sky-500/70"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="mono break-all text-sm text-slate-100">{trace.quote?.quoteId ?? trace.id}</p>
                <Pill tone={trace.quote ? "green" : "slate"}>{trace.source}</Pill>
              </div>
              <p className="mt-2 text-sm text-slate-400">{new Date(trace.createdAt).toLocaleString()}</p>
            </button>
          ))}
        </div>
      </Card>
      <Card className="h-fit">
        <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">content export</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">Reusable explanation</h2>
        <p className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
          {exportText}
        </p>
        <button
          onClick={copyExport}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copied" : "Copy text"}
        </button>
      </Card>
    </div>
  );
}
