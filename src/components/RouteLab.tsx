"use client";

import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Card, Pill } from "@/components/Shell";
import { formatAmount, routeLabel, shortAddress } from "@/lib/format";
import type { LifiRoute, RouteSnapshot } from "@/lib/types";

export function RouteLab({ initialSnapshot }: { initialSnapshot: RouteSnapshot }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [selected, setSelected] = useState<LifiRoute | null>(initialSnapshot.routes[0] ?? null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const routes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return snapshot.routes;
    return snapshot.routes.filter((route) =>
      [
        route.fromChain?.name,
        route.toChain?.name,
        route.fromToken?.symbol,
        route.toToken?.symbol,
        route.fromToken?.address,
        route.toToken?.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query, snapshot.routes]);

  async function refreshRoutes() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/routes");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Route refresh failed.");
      setSnapshot(data as RouteSnapshot);
      setSelected((data as RouteSnapshot).routes[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to refresh routes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_24rem]">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">route lab</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-50">Live route inventory</h2>
            <p className="mt-2 text-slate-300">Fetched at {snapshot.fetchedAt}.</p>
          </div>
          <button
            onClick={refreshRoutes}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-sky-300 disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Refresh routes
          </button>
        </div>
        <label className="mt-5 flex min-h-12 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/50 px-4">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Filter by chain, token, or address"
            className="w-full bg-transparent text-slate-100 outline-none"
          />
        </label>
        {error ? <div className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">{error}</div> : null}
        <div className="mt-5 grid gap-3">
          {routes.slice(0, 18).map((route) => (
            <button
              key={route.id}
              onClick={() => setSelected(route)}
              className={`grid min-h-20 gap-2 rounded-xl border p-4 text-left transition md:grid-cols-[1fr_auto] ${
                selected?.id === route.id
                  ? "border-sky-400 bg-sky-400/10"
                  : "border-slate-700 bg-slate-950/50 hover:border-sky-500/70"
              }`}
            >
              <div>
                <p className="font-semibold text-slate-100">{routeLabel(route.fromChain?.name, route.toChain?.name)}</p>
                <p className="mono mt-1 text-xs text-slate-400">
                  {route.fromToken?.symbol ?? "token"} {"->"} {route.toToken?.symbol ?? "token"}
                </p>
              </div>
              <div className="text-right text-sm text-slate-300">
                <p>min {formatAmount(route.minAmount, route.fromToken?.decimals ?? 6)}</p>
                <p>max {formatAmount(route.maxAmount, route.fromToken?.decimals ?? 6)}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>
      <SolverPanel route={selected} total={snapshot.routes.length} />
    </div>
  );
}

function SolverPanel({ route, total }: { route: LifiRoute | null; total: number }) {
  return (
    <Card className="h-fit lg:sticky lg:top-4">
      <div className="flex items-center justify-between">
        <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">solver lens</p>
        <Pill tone="green">{total} routes</Pill>
      </div>
      {route ? (
        <div className="mt-5 space-y-4">
          <h3 className="text-2xl font-semibold text-slate-50">{routeLabel(route.fromChain?.name, route.toChain?.name)}</h3>
          <Info label="From token" value={`${route.fromToken?.symbol ?? "token"} · ${shortAddress(route.fromToken?.address)}`} />
          <Info label="To token" value={`${route.toToken?.symbol ?? "token"} · ${shortAddress(route.toToken?.address)}`} />
          <Info label="Amount range" value={`${formatAmount(route.minAmount, route.fromToken?.decimals ?? 6)} to ${formatAmount(route.maxAmount, route.fromToken?.decimals ?? 6)}`} />
          <Info label="Fee fields" value={`fee=${route.fee}, gasFee=${route.gasFee}`} />
          <div className="rounded-xl border border-green-400/30 bg-green-400/10 p-4 text-sm leading-6 text-green-100">
            Solver reading: this row shows where a quote range could be valid. A production solver would submit ranges through the credentialed Solver API; IntentScope explains the shape without inventing a private submission.
          </div>
        </div>
      ) : (
        <p className="mt-5 text-slate-300">Select a route to inspect range and token fields.</p>
      )}
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mono mt-2 break-all text-sm text-slate-100">{value}</p>
    </div>
  );
}
