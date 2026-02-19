import React from "react";

type Tone = "neutral" | "riskLow" | "riskModerate" | "riskHigh" | "engagement";
type Layout = "default" | "center";

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

export function Pill({ label, tone }: { label: string; tone: Tone }) {
  const cls =
    tone === "riskHigh"
      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-300/30"
      : tone === "riskModerate"
        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-300/30"
        : tone === "engagement"
          ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-200 dark:border-indigo-300/30"
          : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";

  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>{label}</span>;
}

export default function MetricCard(props: {
  icon?: React.ReactNode;
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: Tone;
  featured?: boolean;
  layout?: Layout; // ✅ NEW
}) {
  const {
    icon,
    title,
    value,
    subtitle,
    rightSlot,
    tone = "neutral",
    featured = false,
    layout = "default",
  } = props;

  const bg = featured
    ? "bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/25 dark:to-slate-800"
    : "bg-white dark:bg-slate-800";

  const chrome = featured
    ? "ring-1 ring-indigo-300/40 dark:ring-indigo-300/20 border border-indigo-200/70 dark:border-indigo-300/20"
    : toneBorder(tone);

  const iconBox = featured
    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200"
    : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200";

  // ✅ Center layout (for Engagement hero)
  if (layout === "center") {
    return (
      <div className={`relative rounded-2xl shadow-sm transition-colors ${bg} ${chrome} ${featured ? "p-10" : "p-8"}`}>
        {featured ? (
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />
        ) : null}

        {/* Top row: icon + title (left), pill (right) */}
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBox}`}>
              {icon ?? <span className="text-sm font-semibold">•</span>}
            </div>
            <div className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
              {title.toUpperCase()}
            </div>
          </div>
          {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
        </div>

        {/* Center content */}
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

  // ✅ Default layout (your old cards)
  return (
    <div className={`relative rounded-2xl shadow-sm transition-colors ${bg} ${chrome} ${featured ? "p-8" : "p-6"}`}>
      {featured ? (
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
      ) : null}

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBox}`}>
            {icon ?? <span className="text-sm font-semibold">•</span>}
          </div>

          <div className="min-w-0">
            <div className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
              {title.toUpperCase()}
            </div>

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
