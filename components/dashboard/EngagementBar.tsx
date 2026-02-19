"use client";

export function EngagementBar({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(10, score));
  const pct = (clamped / 10) * 100;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>0</span>
        <span>10</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-2 rounded-full bg-slate-700 dark:bg-slate-200" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
