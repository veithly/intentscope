import type { TraceRecord, TraceStep } from "@/lib/types";
import { Card } from "@/components/Shell";

export function TraceTimeline({ trace, currentStep = 1 }: { trace: TraceRecord | null; currentStep?: number }) {
  const steps: TraceStep[] =
    trace?.steps ??
    [
      { id: "route", label: "Discover route", detail: "Route and token pair are selected.", status: currentStep > 1 ? "complete" : "current" },
      { id: "request", label: "Request quote", detail: "The app sends the intent request.", status: "waiting" },
      { id: "response", label: "Inspect response", detail: "The returned fields become the trace.", status: "waiting" },
      { id: "save", label: "Save trace", detail: "The trace is persisted for teaching copy.", status: "waiting" },
    ];

  return (
    <Card>
      <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">trace line</p>
      <div className="mt-5 space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="grid grid-cols-[2rem_1fr] gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                  step.status === "complete"
                    ? "border-green-400 bg-green-400/15 text-green-200"
                    : step.status === "current"
                      ? "border-sky-400 bg-sky-400/15 text-sky-200"
                      : "border-slate-700 bg-slate-900 text-slate-500"
                }`}
              >
                {index + 1}
              </span>
              {index < steps.length - 1 ? <span className="h-10 w-px bg-slate-700" /> : null}
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">{step.label}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
