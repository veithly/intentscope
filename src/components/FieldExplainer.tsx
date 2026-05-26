import type { TraceRecord } from "@/lib/types";
import { Card } from "@/components/Shell";

export function FieldExplainer({ trace }: { trace: TraceRecord | null }) {
  const notes = trace?.fieldNotes ?? [];
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">field map</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">What each response field means</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {(notes.length ? notes : emptyNotes).map((note) => (
          <article key={note.field} className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
            <p className="mono text-sm text-sky-200">{note.field}</p>
            <h3 className="mt-1 font-semibold text-slate-100">{note.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{note.description}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}

const emptyNotes = [
  {
    field: "quoteId",
    title: "Run a trace first",
    description: "The field explainer fills with notes after the live endpoint responds.",
  },
];
