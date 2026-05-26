# Deployment Runbook

## Target

IntentScope is designed for Cloudflare Workers through OpenNext.

The public worker name is `intentscope`.

The app does not need a private key.

The app can run with public LI.FI endpoint variables.

The optional trace ledger should use Cloudflare KV in production.

## Required Tools

```bash
npm install
npx wrangler@latest login
```

## Variables

Wrangler variables in `wrangler.jsonc`:

```bash
LIFI_ORDER_API_BASE=https://order.li.fi
LIFI_ORDER_DEV_API_BASE=https://order-dev.li.fi
```

These are public endpoint roots, not secrets.

## Bindings

Optional KV binding:

```bash
INTENTSCOPE_TRACE_KV
```

Create it with:

```bash
npx wrangler@latest kv namespace create INTENTSCOPE_TRACE_KV
```

Then replace the `kv_namespaces[0].id` value in `wrangler.jsonc`.

If the binding is not created, the local file ledger works only in local Node runtime and should not be treated as production persistence.

## Deploy

```bash
npm run build
npm run deploy
```

The deploy script runs:

```bash
opennextjs-cloudflare build
opennextjs-cloudflare deploy
```

## Smoke Test

After deployment, open an incognito browser and verify:

```bash
curl https://intentscope.veithly.workers.dev/api/stats
curl -X POST https://intentscope.veithly.workers.dev/api/trace/live
```

Browser checks:

1. Open `/`.
2. Open `/app`.
3. Click **Trace a live intent**.
4. Confirm a quote receipt or truthful no-quote response appears.
5. Open `/app/routes`.
6. Confirm route count and route cards load.
7. Open `/app/traces`.
8. Confirm saved trace history works if KV is bound.

## Current Deployment Status

Production URL:

- `https://intentscope.veithly.workers.dev`

KV namespace:

- `INTENTSCOPE_TRACE_KV`

Latest deployment command:

```bash
npm run deploy
```
