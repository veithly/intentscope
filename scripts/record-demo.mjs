import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.env.INTENTSCOPE_BASE_URL || "http://localhost:3000";
const demoDir = path.resolve("docs/demo");
const rawDir = path.join(demoDir, ".raw");
const output = path.join(demoDir, "intentscope-demo.webm");
const notes = path.join(demoDir, "intentscope-demo-notes.md");

async function pause(page, ms = 900) {
  await page.waitForTimeout(ms);
}

async function caption(page, text) {
  await page.evaluate((value) => {
    let node = document.querySelector("[data-demo-caption]");
    if (!node) {
      node = document.createElement("div");
      node.setAttribute("data-demo-caption", "true");
      node.setAttribute(
        "style",
        [
          "position:fixed",
          "left:28px",
          "bottom:28px",
          "z-index:99999",
          "max-width:560px",
          "padding:14px 16px",
          "border:1px solid rgba(125,211,252,.35)",
          "background:rgba(3,7,18,.9)",
          "color:#e0f2fe",
          "border-radius:8px",
          "font:600 16px/1.45 system-ui,-apple-system,Segoe UI,sans-serif",
          "box-shadow:0 18px 60px rgba(0,0,0,.35)",
        ].join(";"),
      );
      document.body.appendChild(node);
    }
    node.textContent = value;
  }, text);
  await pause(page, 1200);
}

if (existsSync(rawDir)) {
  rmSync(rawDir, { recursive: true, force: true });
}
mkdirSync(rawDir, { recursive: true });
mkdirSync(demoDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: rawDir,
    size: { width: 1440, height: 900 },
  },
});

const page = await context.newPage();

try {
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await caption(page, "IntentScope turns a live LI.FI intent quote into a readable flight recorder.");
  await page.getByRole("link", { name: /Trace a live intent/i }).click();
  await page.waitForLoadState("networkidle");
  await caption(page, "The app calls the real Order API and explains the fields builders usually need to inspect.");
  await page.getByRole("button", { name: /Trace a live intent/i }).click();
  await page.getByText(/Quote received|No eligible quote/i).first().waitFor({ timeout: 25_000 });
  await caption(page, "A returned quote becomes a timeline, receipt, and copyable explainer for submissions or debugging.");
  await page.getByRole("button", { name: /Copy explanation/i }).click();
  await pause(page, 700);

  await page.goto(`${baseURL}/app/routes`, { waitUntil: "networkidle" });
  await page.getByText(/routes/i).first().waitFor({ timeout: 25_000 });
  await caption(page, "Route Lab maps the live route inventory into solver-facing education.");
  await page.getByRole("button", { name: /Refresh routes/i }).click();
  await page.getByText(/solver lens/i).waitFor({ timeout: 15_000 });
  await pause(page, 900);

  await page.goto(`${baseURL}/app/traces`, { waitUntil: "networkidle" });
  await page.getByText(/production-quote/i).first().waitFor({ timeout: 20_000 });
  await caption(page, "Trace History preserves runs locally or through Cloudflare KV after deployment.");
  await page.getByRole("button", { name: /Copy text/i }).click();
  await pause(page, 700);

  await page.goto(`${baseURL}/app/playground`, { waitUntil: "networkidle" });
  await caption(page, "The no-quote playground teaches failure states without pretending a solver accepted the order.");
  await page.getByRole("button", { name: /Run no-quote scenario/i }).click();
  await page.getByText(/selected amount may sit outside active route ranges/i).waitFor({ timeout: 25_000 });
  await pause(page, 1500);
} finally {
  await context.close();
  await browser.close();
}

const files = readdirSync(rawDir).filter((file) => file.endsWith(".webm"));
if (files.length !== 1) {
  throw new Error(`Expected one recorded video, found ${files.length}`);
}

if (existsSync(output)) {
  rmSync(output, { force: true });
}
renameSync(path.join(rawDir, files[0]), output);
writeFileSync(
  notes,
  [
    "# IntentScope Demo Notes",
    "",
    `Recorded from: ${baseURL}`,
    "",
    "Flow:",
    "1. Landing page positioning.",
    "2. Live LI.FI Order API quote trace.",
    "3. Route inventory explorer.",
    "4. Trace history and copyable explanation.",
    "5. No-quote education surface.",
    "",
    "Primary video: `docs/demo/intentscope-demo.webm`",
    "",
  ].join("\n"),
);

console.log(`Recorded ${output}`);
