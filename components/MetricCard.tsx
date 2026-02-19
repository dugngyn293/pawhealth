import type { ReactNode } from "react";

type Tone = "neutral" | "riskLow" | "riskModerate" | "riskHigh" | "engagement";
type Layout = "default" | "center";
type MetricCardProps = {
  icon?: ReactNode;
  title: string;
  value: ReactNode;
  subtitle?: ReactNode;
  rightSlot?: ReactNode;
  tone?: Tone;
  featured?: boolean;
  layout?: Layout;
};
type PillProps = { label: string; tone: Tone };

function toneBorder(tone: Tone) {
  switch (tone) {
    case "riskModerate":
      return "border border-amber-200 dark:border-amber-300/30 ring-1 ring-amber-100 dark:ring-amber-300/10";
    case "riskHigh":
      return "border border-rose-200 dark:border-rose-300/30 ring-1 ring-rose-100 dark:ring-rose-300/10";
    case "engagement":
      return "border border-indigo-200 dark:border-indigo-300/30 ring-1 ring-indigo-100 dark:ring-indigo-300/10";
    default:
      return "border border-slate-200 dark:border-slate-700";
  }
}

function pillClass(tone: Tone) {
  if (tone === "riskHigh") {
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-300/30";
  }
  if (tone === "riskModerate") {
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-300/30";
  }
  if (tone === "engagement") {
    return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-200 dark:border-indigo-300/30";
  }
  return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";
}

export function Pill({ label, tone }: PillProps) {
  const cls = pillClass(tone);
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>{label}</span>;
}

function CardGlow({ featured, size }: { featured: boolean; size: "default" | "center" }) {
  if (!featured) return null;
  const dimensions = size === "center" ? "h-44 w-44" : "h-40 w-40";

  return <div className={`pointer-events-none absolute -right-12 -top-12 rounded-full bg-indigo-500/10 blur-3xl ${dimensions}`} />;
}

function CardTitle({ title }: { title: string }) {
  return <div className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">{title.toUpperCase()}</div>;
}

function CardIcon({ icon, iconBox }: { icon?: ReactNode; iconBox: string }) {
  return <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBox}`}>{icon ?? <span className="text-sm font-semibold">•</span>}</div>;
}

export default function MetricCard({
  icon,
  title,
  value,
  subtitle,
  rightSlot,
  tone = "neutral",
  featured = false,
  layout = "default",
}: MetricCardProps) {
  const backgroundClass =
    featured
      ? "bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/25 dark:to-slate-800"
    : "bg-white dark:bg-slate-800";

  const chromeClass = featured
    ? "ring-1 ring-indigo-300/40 dark:ring-indigo-300/20 border border-indigo-200/70 dark:border-indigo-300/20"
    : toneBorder(tone);

  const iconBoxClass = featured
    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200"
    : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200";

  if (layout === "center") {
    return (
      <div className={`relative rounded-2xl shadow-sm transition-colors ${backgroundClass} ${chromeClass} ${featured ? "p-10" : "p-8"}`}>
        <CardGlow featured={featured} size="center" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <CardIcon icon={icon} iconBox={iconBoxClass} />
            <CardTitle title={title} />
          </div>
          {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
        </div>

        <div className="relative mt-6 flex flex-col items-center text-center">
          <div className={`font-semibold text-slate-900 dark:text-slate-50 leading-none ${featured ? "text-6xl" : "text-5xl"}`}>
            {value}
          </div>

          {subtitle ? (
            <div className="mt-4 w-full max-w-xl text-sm text-slate-700 dark:text-slate-200">
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl shadow-sm transition-colors ${backgroundClass} ${chromeClass} ${featured ? "p-8" : "p-6"}`}>
      <CardGlow featured={featured} size="default" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <CardIcon icon={icon} iconBox={iconBoxClass} />

          <div className="min-w-0">
            <CardTitle title={title} />

            <div className={`mt-3 font-semibold text-slate-900 dark:text-slate-50 leading-none ${featured ? "text-5xl" : "text-4xl"}`}>
              {value}
            </div>

            {subtitle ? (
              <div className={`mt-3 text-sm ${featured ? "text-slate-700 dark:text-slate-200" : "text-slate-600 dark:text-slate-300"}`}>
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>

        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>
    </div>
  );
}
