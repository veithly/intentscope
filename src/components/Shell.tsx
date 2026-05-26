import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/app", label: "Trace Lab" },
  { href: "/app/routes", label: "Route Lab" },
  { href: "/app/traces", label: "History" },
  { href: "/app/playground", label: "No-Quote" },
  { href: "/about", label: "Architecture" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <header className="mx-auto flex w-full max-w-7xl flex-col gap-4 border-b border-slate-700/60 pb-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/brand/logomark.svg" alt="" className="h-10 w-10" />
          <img src="/brand/wordmark.svg" alt="IntentScope" className="h-8 w-auto" />
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm text-slate-300">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-2 transition hover:border-sky-400 hover:text-sky-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </main>
  );
}

export function SectionHeader({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl py-8">
      <p className="mono text-xs uppercase tracking-[0.24em] text-sky-300">{kicker}</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-slate-50 md:text-6xl">{title}</h1>
      <div className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">{children}</div>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`panel rounded-2xl p-5 ${className}`}>{children}</section>;
}

export function Pill({ children, tone = "sky" }: { children: React.ReactNode; tone?: "sky" | "green" | "slate" }) {
  const tones = {
    sky: "border-sky-400/40 bg-sky-400/10 text-sky-200",
    green: "border-green-400/40 bg-green-400/10 text-green-200",
    slate: "border-slate-500/40 bg-slate-800/80 text-slate-200",
  };
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${tones[tone]}`}>{children}</span>;
}
