export function shortAddress(value?: string | null): string {
  if (!value) return "n/a";
  return value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-8)}` : value;
}

export function formatAmount(value?: string | number | null, decimals = 6): string {
  if (value === undefined || value === null) return "n/a";
  const raw = typeof value === "number" ? BigInt(Math.trunc(value)) : BigInt(String(value));
  const scale = 10n ** BigInt(decimals);
  const whole = raw / scale;
  const fraction = raw % scale;
  const trimmed = fraction.toString().padStart(decimals, "0").replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}

export function timeLeft(validUntil?: number): string {
  if (!validUntil) return "n/a";
  const seconds = Math.max(0, validUntil - Math.floor(Date.now() / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}

export function routeLabel(from?: string | null, to?: string | null): string {
  return `${from ?? "Unknown"} -> ${to ?? "Unknown"}`;
}
