<p align="center"><img src="public/brand/wordmark.svg" alt="IntentScope" width="320" /></p>

<p align="center">
  <b>IntentScope</b> — Live LI.FI Intents traces builders can read.
</p>

<p align="center">
  <a href="https://intentscope.veithly.workers.dev"><img alt="Live" src="https://img.shields.io/badge/Live-Cloudflare%20Workers-22c55e"></a>
  <a href="docs/demo/intentscope-demo.webm"><img alt="Demo" src="https://img.shields.io/badge/Demo-webm-0ea5e9"></a>
  <a href="LICENSE"><img alt="MIT" src="https://img.shields.io/badge/License-MIT-blue"></a>
  <a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-latest-black"></a>
  <a href="https://docs.li.fi/lifi-intents/introduction"><img alt="LI.FI Intents" src="https://img.shields.io/badge/LI.FI-Intents-0EA5E9"></a>
</p>

<p align="center">
  <img src="docs/screenshots/hero.png" alt="IntentScope hero" width="880" />
</p>

## Why IntentScope

LI.FI Intents are easier to understand when a builder can see the live request path. IntentScope calls the real order API, turns the quote response into a readable trace, and keeps every important field visible: `quoteId`, validity, input preview, output preview, solver metadata, and failure handling.

## What It Does

Open the app, click **Trace a live intent**, and IntentScope sends a real exact-input request to `POST /quote/request`. The returned quote becomes a receipt with the quote id, output amount, validity window, and field-level explanations. The trace is saved so the same response can be reopened and turned into short teaching copy.

The Route Lab loads active route inventory from LI.FI's route endpoint and explains the solver-facing fields that matter before a builder asks for credentials. The no-quote playground preserves an empty `quotes` response and explains how to reason about it instead of hiding it.

<p align="center">
  <img src="docs/screenshots/flow.png" alt="IntentScope primary flow" width="880" />
</p>

## Architecture

IntentScope is a small Next.js App Router project with server-side API proxies for LI.FI endpoints and a local trace ledger that can map to Cloudflare KV in production. The browser never receives private credentials, and the app does not claim wallet settlement or solver submission. Read the engineering details in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

<p align="center">
  <img src="docs/screenshots/architecture.png" alt="IntentScope architecture diagram" width="640" />
</p>

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then click **Trace a live intent**.

Live deployment: `https://intentscope.veithly.workers.dev`

Recorded demo: [`docs/demo/intentscope-demo.webm`](docs/demo/intentscope-demo.webm)

Optional local variables:

```bash
LIFI_ORDER_API_BASE=https://order.li.fi
LIFI_ORDER_DEV_API_BASE=https://order-dev.li.fi
```

## Verification

```bash
npm run build
npm run test:e2e
npm run audit:prd
npm run audit:ui
npm run audit:density
npm run audit:realness
```

## License

MIT © IntentScope contributors.
