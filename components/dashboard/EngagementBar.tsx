"use client";

export function EngagementBar({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(10, score));
  const pct = (clamped / 10) * 100;

  // Color based on performance
  const fillColor =
    clamped >= 8
      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
      : clamped >= 6
        ? "bg-gradient-to-r from-indigo-400 to-indigo-500"
        : "bg-gradient-to-r from-amber-400 to-amber-500";

  return (
    <div className="mt-6 w-full max-w-xl mx-auto">
      {/* Scale labels */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>0</span>
        <span>10</span>
      </div>

      {/* Bar background */}
      <div className="mt-3 h-3 w-full rounded-full bg-slate-200/70 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ease-out ${fillColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Percentage indicator text */}
      <div className="mt-3 text-sm text-center text-slate-600 dark:text-slate-300">
        {clamped.toFixed(1)} / 10 engagement level
      </div>
    </div>
  );
}
