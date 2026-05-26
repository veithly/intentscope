import type { FieldNote, TraceStep } from "@/lib/types";

export const quoteFieldNotes: FieldNote[] = [
  {
    field: "quoteId",
    title: "Quote identity",
    description: "The durable handle for this solver quote. It is the first field to copy when debugging a quote path.",
  },
  {
    field: "validUntil",
    title: "Validity window",
    description: "The quote has a time boundary. Integrators should treat stale quotes as expired, not as a reusable price.",
  },
  {
    field: "preview.inputs",
    title: "User commitment",
    description: "The assets and amounts the user is preparing to spend for this intent.",
  },
  {
    field: "preview.outputs",
    title: "Expected receipt",
    description: "The assets and amounts the receiver should get if the intent is fulfilled as quoted.",
  },
  {
    field: "metadata.exclusiveFor",
    title: "Solver binding",
    description: "The quote may be scoped to a solver address. That is an important signal for solver education.",
  },
  {
    field: "failureHandling",
    title: "Failure policy",
    description: "The user experience should explain what happens when fulfillment fails.",
  },
];

export function buildTraceSteps(hasQuote: boolean): TraceStep[] {
  return [
    {
      id: "route",
      label: "Discover route",
      detail: "The app starts from a route and token pair that LI.FI Intents can evaluate.",
      status: "complete",
    },
    {
      id: "request",
      label: "Request quote",
      detail: "The server sends an exact-input intent request to the LI.FI order API.",
      status: "complete",
    },
    {
      id: "response",
      label: hasQuote ? "Quote received" : "No eligible quote",
      detail: hasQuote
        ? "The response includes a quote id, validity window, previewed input, and previewed output."
        : "The response is still useful: it shows that the endpoint answered and no eligible quote was available for that request.",
      status: "complete",
    },
    {
      id: "teach",
      label: "Explain fields",
      detail: "IntentScope maps response fields to developer decisions and tutorial copy.",
      status: hasQuote ? "complete" : "current",
    },
  ];
}

export const noQuoteReasons = [
  "The selected amount may sit outside active route ranges.",
  "A route can exist while no solver quote is eligible for the exact request.",
  "Integrator-specific quotes may require an onboarding key.",
  "The quote endpoint can be healthy even when the quote array is empty.",
];
