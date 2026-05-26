# LI.FI Intents Flight Recorder

This is the short developer explanation that IntentScope is built to support.

## The Problem

Intent docs are usually clear after you already understand the system.

The first-time builder problem is different: a developer needs to see one request, one response, and the user-facing meaning of each field.

IntentScope starts there.

It calls the LI.FI order API, stores the response as a trace, and turns the response into a field map that can be reused in a tutorial or X thread.

## What The App Calls

The hero path calls:

```http
POST https://order.li.fi/quote/request
```

The route lab calls:

```http
GET https://order-dev.li.fi/routes
```

The landing stats call:

```http
GET https://order.li.fi/chains/supported
```

The no-quote teaching path calls:

```http
POST https://order-dev.li.fi/quote/request
```

## What A Builder Should Notice

`quoteId` is the handle you copy when debugging or explaining a quote.

`validUntil` is a product requirement, not just metadata. The UI should treat stale quotes as expired.

`preview.inputs` describes what the user is committing.

`preview.outputs` describes what the receiver expects.

`metadata.exclusiveFor` can tell a builder that the quote is scoped to a solver address.

`failureHandling` should become visible product copy because users need to know what happens when fulfillment fails.

## Why Empty Quotes Matter

An empty quote array is not automatically a broken integration.

It can mean the route exists but no solver quote is eligible for that exact request.

It can mean the amount sits outside the active range.

It can mean the quote path depends on integrator-specific eligibility.

IntentScope keeps `quotes: []` visible and explains it as a state builders need to handle.

## Solver-Side Learning

IntentScope does not submit solver quotes because that path requires credentials.

Instead, it shows route inventory and amount ranges so a builder can understand what a solver submission would be shaped around.

That keeps the demo honest while still making solver tooling easier to reason about.

## How To Try It

```bash
npm install
npm run dev
```

Open `http://localhost:3000/app`, click **Trace a live intent**, then open **Route Lab**.

The best 90-second path is:

1. Click **Trace a live intent**.
2. Read the quote receipt.
3. Expand the field explanations.
4. Open Route Lab.
5. Export the teaching copy from Trace History.
