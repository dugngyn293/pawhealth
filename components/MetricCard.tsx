import React from "react";

type Tone = "neutral" | "riskLow" | "riskModerate" | "riskHigh" | "engagement";

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

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default function MetricCard(props: {
  icon?: React.ReactNode;
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: Tone;
}) {
  const { icon, title, value, subtitle, rightSlot, tone = "neutral" } = props;

  return (
    <div className={`rounded-2xl bg-white dark:bg-slate-800 shadow-sm ${toneBorder(tone)} p-6 transition-colors`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
            {icon ?? <span className="text-sm font-semibold">•</span>}
          </div>

          <div className="min-w-0">
            <div className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
              {title.toUpperCase()}
            </div>

            <div className="mt-3 text-4xl font-semibold text-slate-900 dark:text-slate-50 leading-none">
              {value}
            </div>

            {subtitle ? <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{subtitle}</div> : null}
          </div>
        </div>

        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>
    </div>
  );
}
