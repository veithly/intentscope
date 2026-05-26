"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Copy, Loader2, RotateCw } from "lucide-react";
import { FieldExplainer } from "@/components/FieldExplainer";
import { QuoteReceipt } from "@/components/QuoteReceipt";
import { Card, Pill } from "@/components/Shell";
import { TraceTimeline } from "@/components/TraceTimeline";
import type { TraceRecord } from "@/lib/types";

export function TraceWorkbench({ initialTrace = null }: { initialTrace?: TraceRecord | null }) {
  const [trace, setTrace] = useState<TraceRecord | null>(initialTrace);
  const [currentStep, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function runTrace() {
    setLoading(true);
    setError("");
    setCopied(false);
    setStep(1);
    try {
      setStep(2);
      const response = await fetch("/api/trace/live", { method: "POST" });
      setStep(3);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Quote request failed.");
      setTrace(data as TraceRecord);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run trace.");
    } finally {
      setLoading(false);
    }
  }

  const teachingCopy = useMemo(() => {
    const quote = trace?.quote;
    if (!quote) {
      return "Run a live LI.FI Intents trace first. The export will include quote id, validity, preview input/output, and solver notes.";
    }
    const output = quote.preview.outputs[0]?.amount ?? "n/a";
    return `IntentScope traced a live LI.FI Intents quote: ${quote.quoteId}. The request hit ${trace.endpoint}, returned output amount ${output}, expires at ${quote.validUntil}, and uses failureHandling=${quote.failureHandling}. The useful lesson: builders should treat quoteId, validUntil, preview.inputs, preview.outputs, and failureHandling as user-facing integration fields, not background JSON.`;
  }, [trace]);

  async function copyTeachingText() {
    try {
      await navigator.clipboard.writeText(teachingCopy);
    } catch {
      // Some browser contexts block clipboard writes; keep the UI state useful.
    }
    setCopied(true);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">hero action</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50">Trace a live intent quote</h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                Calls the real LI.FI quote endpoint, keeps the response visible, and saves a replayable trace for the teaching flow.
              </p>
            </div>
            <button
              onClick={runTrace}
              disabled={loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RotateCw className="h-5 w-5" />}
              Trace a live intent
            </button>
          </div>
          {error ? (
            <div className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>
          ) : null}
        </Card>
        <QuoteReceipt trace={trace} />
        <FieldExplainer trace={trace} />
      </div>
      <div className="space-y-5">
        <TraceTimeline trace={trace} currentStep={currentStep} />
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">export</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-50">Thread-ready explanation</h2>
            </div>
            <Pill tone={copied ? "green" : "slate"}>{copied ? "Copied" : "Ready"}</Pill>
          </div>
          <p className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
            {teachingCopy}
          </p>
          <button
            onClick={copyTeachingText}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-600 px-4 py-2 text-slate-100 transition hover:border-sky-400 hover:text-sky-200"
          >
            <Copy className="h-4 w-4" />
            Copy explanation
            <ArrowRight className="h-4 w-4" />
          </button>
        </Card>
      </div>
    </div>
  );
}
