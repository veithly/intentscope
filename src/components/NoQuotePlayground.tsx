"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, Pill } from "@/components/Shell";
import { noQuoteReasons } from "@/lib/explainers";
import type { TraceRecord } from "@/lib/types";

export function NoQuotePlayground() {
  const [trace, setTrace] = useState<TraceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runScenario() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/trace/no-quote", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No-quote request failed.");
      setTrace(data as TraceRecord);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run scenario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">teaching scenario</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-50">Explain an empty quote array</h2>
        <p className="mt-3 text-slate-300">
          The response is still protocol signal. This surface preserves the real endpoint answer and explains how a builder should reason about it.
        </p>
        <button
          onClick={runScenario}
          disabled={loading}
          className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300 disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          Run no-quote scenario
        </button>
        {error ? <div className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">{error}</div> : null}
        <div className="mt-6 grid gap-3">
          {noQuoteReasons.map((reason) => (
            <div key={reason} className="rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
              {reason}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">raw response</p>
          <Pill tone={trace ? (trace.quote ? "green" : "slate") : "slate"}>{trace ? `${trace.response.quotes.length} quotes` : "not run"}</Pill>
        </div>
        <pre className="mt-5 max-h-[38rem] overflow-auto rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-xs leading-6 text-slate-200">
          {trace ? JSON.stringify(trace.response, null, 2) : "Run the scenario to inspect the endpoint response."}
        </pre>
      </Card>
    </div>
  );
}
