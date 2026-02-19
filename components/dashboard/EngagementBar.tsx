"use client";

const MIN_SCORE = 0;
const MAX_SCORE = 10;

function getFillColor(score: number) {
  if (score >= 8) return "bg-gradient-to-r from-emerald-400 to-emerald-500";
  if (score >= 6) return "bg-gradient-to-r from-indigo-400 to-indigo-500";
  return "bg-gradient-to-r from-amber-400 to-amber-500";
}

export function EngagementBar({ score }: { score: number }) {
  const clampedScore = Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));
  const widthPercent = (clampedScore / MAX_SCORE) * 100;
  const fillColor = getFillColor(clampedScore);

  return (
    <div className="mt-6 w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{MIN_SCORE}</span>
        <span>{MAX_SCORE}</span>
      </div>

      <div className="mt-3 h-3 w-full rounded-full bg-slate-200/70 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ease-out ${fillColor}`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>

      <div className="mt-3 text-sm text-center text-slate-600 dark:text-slate-300">
        {clampedScore.toFixed(1)} / {MAX_SCORE} engagement level
      </div>
    </div>
  );
}
