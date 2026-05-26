import { buildTraceSteps, quoteFieldNotes } from "@/lib/explainers";
import type { LifiRoute, RouteSnapshot, TraceRecord } from "@/lib/types";

const ORDER_API = process.env.LIFI_ORDER_API_BASE ?? "https://order.li.fi";
const ORDER_DEV_API = process.env.LIFI_ORDER_DEV_API_BASE ?? "https://order-dev.li.fi";

export const liveQuoteRequest = {
  user: "0x0001000002a4b114841f63697cfa0e3b54c4d42b3d679f07f7f2485f",
  intent: {
    intentType: "oif-swap",
    inputs: [
      {
        user: "0x0001000002a4b114841f63697cfa0e3b54c4d42b3d679f07f7f2485f",
        asset: "0x0001000002a4b114af88d065e77c8cc2239327c5edb3a432268e5831",
        amount: "1000000",
      },
    ],
    outputs: [
      {
        receiver: "0x0001000002210514841f63697cfa0e3b54c4d42b3d679f07f7f2485f",
        asset: "0x0001000002210514833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      },
    ],
    swapType: "exact-input",
  },
  supportedTypes: ["oif-escrow-v0", "oif-resource-lock-v0"],
};

export const noQuoteRequest = {
  user: "0x0001000003014a3414841f63697cfa0e3b54c4d42b3d679f07f7f2485f",
  intent: {
    intentType: "oif-swap",
    inputs: [
      {
        user: "0x0001000003014a3414841f63697cfa0e3b54c4d42b3d679f07f7f2485f",
        asset: "0x0001000003014a3414036cbd53842c5426634e7929541ec2318f3dcf7e",
        amount: "1000000",
      },
    ],
    outputs: [
      {
        receiver: "0x0001000003aa36a714841f63697cfa0e3b54c4d42b3d679f07f7f2485f",
        asset: "0x0001000003aa36a71475faf114eafb1bdbe2f0316df893fd58ce46aa4d",
      },
    ],
    swapType: "exact-input",
  },
  supportedTypes: ["oif-escrow-v0", "oif-resource-lock-v0"],
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${detail.slice(0, 240)}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchLiveTrace(source: "production-quote" | "no-quote"): Promise<TraceRecord> {
  const requestBody = source === "production-quote" ? liveQuoteRequest : noQuoteRequest;
  const baseUrl = source === "production-quote" ? ORDER_API : ORDER_DEV_API;
  const response = await postJson<{ quotes: TraceRecord["response"]["quotes"] }>(`${baseUrl}/quote/request`, requestBody);
  const quote = response.quotes[0] ?? null;
  const createdAt = new Date().toISOString();
  return {
    id: quote?.quoteId ?? `trace-${createdAt.replace(/[-:.TZ]/g, "").slice(0, 14)}`,
    createdAt,
    endpoint: `${baseUrl}/quote/request`,
    requestBody,
    response,
    quote,
    fieldNotes: quoteFieldNotes,
    steps: buildTraceSteps(Boolean(quote)),
    source,
  };
}

export async function fetchRouteSnapshot(): Promise<RouteSnapshot> {
  const response = await fetch(`${ORDER_DEV_API}/routes`, { cache: "no-store" });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${detail.slice(0, 240)}`);
  }
  const data = (await response.json()) as { routes: LifiRoute[] };
  return {
    fetchedAt: new Date().toISOString(),
    routes: data.routes.filter((route) => route.isActive),
  };
}

export async function fetchChainCount(): Promise<number> {
  const response = await fetch(`${ORDER_API}/chains/supported`, { cache: "no-store" });
  if (!response.ok) return 0;
  const data = (await response.json()) as unknown[];
  return data.length;
}
