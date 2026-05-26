# IntentScope Architecture

## 1. Product Boundary

IntentScope is a developer education tool for LI.FI Intents.

It is not a wallet.

It is not a bridge interface for end users.

It is not a solver account manager.

It does not claim settlement.

It does not submit solver quotes.

It shows how a live quote request becomes a response a developer can inspect.

The design goal is practical clarity.

The app keeps request and response facts visible.

The app explains protocol fields without inventing private outcomes.

## 2. Runtime Surfaces

The landing page is `/`.

The primary trace lab is `/app`.

The route inventory lab is `/app/routes`.

The saved trace history is `/app/traces`.

The no-quote teaching surface is `/app/playground`.

The architecture summary is `/about`.

Every reviewer-visible route uses English UI copy.

The mobile path starts at `/app`.

The desktop path keeps the quote receipt, field explainer, and timeline visible together.

## 3. Data Flow

The browser sends a request to a local route handler.

The local route handler calls LI.FI endpoints server-side.

The route handler normalizes only the stable fields needed by the UI.

The original response remains available in the trace object.

The trace object is stored in the trace ledger.

The browser renders the quote receipt and field notes.

The route lab renders current route inventory.

The content export panel derives text from the current trace.

No private key is used by the browser.

No solver key is embedded in the repo.

## 4. External Sources

`POST https://order.li.fi/quote/request` powers the hero trace.

`GET https://order.li.fi/chains/supported` powers live chain count.

`GET https://order-dev.li.fi/routes` powers the route lab.

`POST https://order-dev.li.fi/quote/request` powers the no-quote teaching path.

Official documentation is linked from `/about`.

The app treats external endpoint failures as visible errors.

The app does not replace an endpoint failure with generated quote ids.

The app does not rewrite empty quote arrays into success states.

## 5. Trace Record

The core state object is `TraceRecord`.

`TraceRecord.id` is the quote id when a quote exists.

`TraceRecord.createdAt` stores the request time.

`TraceRecord.endpoint` stores the endpoint that was called.

`TraceRecord.requestBody` stores the body sent to LI.FI.

`TraceRecord.response` stores the returned quote array.

`TraceRecord.quote` stores the first quote or `null`.

`TraceRecord.fieldNotes` stores developer explanations.

`TraceRecord.steps` stores the visible timeline.

`TraceRecord.source` distinguishes production quote and no-quote paths.

## 6. Persistence

Local development uses a file-backed ledger under `.intentscope-state/traces.json`.

The ledger stores the most recent traces.

The storage code exposes a small interface compatible with a Cloudflare KV binding.

Production can bind `INTENTSCOPE_TRACE_KV`.

If the KV binding is present, the same code path reads and writes through `kv.get` and `kv.put`.

If the KV binding is absent, local file storage is used.

This gives the demo a real persisted state transition without requiring user accounts.

## 7. API Routes

`/api/trace/live` runs the production quote path.

`/api/trace/no-quote` runs the no-quote teaching path.

`/api/routes` loads active route inventory.

`/api/traces` lists saved traces.

`/api/traces` also accepts a posted trace record.

`/api/stats` returns chain and route counts for the landing page.

All API routes return JSON.

All API routes surface errors with status `502` when an upstream call fails.

## 8. UI Components

`TraceWorkbench` owns the hero workflow.

`QuoteReceipt` renders quote id, input amount, output amount, and validity.

`FieldExplainer` explains response fields.

`TraceTimeline` shows the multi-step flow.

`RouteLab` renders route inventory and solver-facing range details.

`TraceHistory` reopens saved traces and exports teaching copy.

`NoQuotePlayground` demonstrates the empty quote response path.

`RouteRadar` gives the project a protocol-newsroom signature screenshot.

## 9. Trust Boundary

The browser never calls LI.FI directly for the hero path.

The browser calls IntentScope route handlers.

The route handlers call LI.FI endpoints.

The route handlers do not require private credentials for the hero path.

The route handlers do not hide a missing solver key.

The UI explicitly states that solver quote submission is credentialed.

The app does not show a transaction hash because it does not submit a transaction.

The app does not show a private solver submission because it does not have those credentials.

## 10. Error Handling

If LI.FI returns an error, the UI shows a readable error panel.

If LI.FI returns `quotes: []`, the no-quote surface keeps the response visible.

If local persistence fails, the quote receipt can still render because the live response is already in memory.

If route inventory is unavailable, the route lab reports the upstream failure.

The app favors honest failure over fabricated success.

## 11. Deployment Plan

The intended production target is Cloudflare Workers through OpenNext.

The static assets live under `public/brand` and `docs/screenshots`.

The runtime needs no private key.

The runtime can run with the default LI.FI endpoint variables.

`LIFI_ORDER_API_BASE` can be set to `https://order.li.fi`.

`LIFI_ORDER_DEV_API_BASE` can be set to `https://order-dev.li.fi`.

`INTENTSCOPE_TRACE_KV` is optional.

If KV is not bound, a production deployment should either bind KV or disable persisted history.

## 12. Verification Commands

Run `npm run build`.

Run `npm run test:e2e`.

Run `npm run audit:prd`.

Run `npm run audit:ui`.

Run `npm run audit:density`.

Run `npm run audit:realness`.

The expected result is all green for those completed phases.

Video and Cloudflare deployment gates are separate final-submission gates.
