import { Card, Pill } from "@/components/Shell";

export function RouteRadar({ compact = false }: { compact?: boolean }) {
  const points = [
    { name: "Arbitrum", x: 22, y: 68 },
    { name: "Base", x: 40, y: 32 },
    { name: "Ethereum", x: 61, y: 48 },
    { name: "Polygon", x: 78, y: 70 },
  ];
  return (
    <Card className={compact ? "min-h-64" : "min-h-[28rem]"}>
      <div className="flex items-center justify-between">
        <div>
          <p className="mono text-xs uppercase tracking-[0.22em] text-sky-300">route radar</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">Protocol path made visible</h2>
        </div>
        <Pill tone="green">live-ready</Pill>
      </div>
      <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/60">
        <svg viewBox="0 0 100 62" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="routeLine" x1="0" x2="1">
              <stop stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          <path d="M40 32 C48 18 55 24 61 48 S72 76 78 70" fill="none" stroke="url(#routeLine)" strokeWidth="1.2" />
          <path d="M22 68 C30 50 34 40 40 32" fill="none" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="2 2" />
          {points.map((point) => (
            <g key={point.name}>
              <circle cx={point.x} cy={point.y} r="2.8" fill="#0EA5E9" />
              <circle cx={point.x} cy={point.y} r="5.8" fill="none" stroke="#0EA5E9" strokeOpacity="0.35" />
              <text x={point.x + 3.5} y={point.y + 1} fill="#E2E8F0" fontSize="3.2">
                {point.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}
