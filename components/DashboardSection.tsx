"use client";

import { useEffect, useMemo, useState } from "react";
import MetricCard, { Pill } from "./MetricCard";
import { fetchCompanyMetrics } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";
import UserMenu from "@/components/UserMenu";
import { formatInt, formatOneDecimal, formatPercent, safeNumber } from "@/lib/format";
import type { CompanyMetricsResponse } from "@/lib/types";

/** ---------- Helpers for edge cases ---------- */
function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function numberOrZero(v: unknown): number {
  return safeNumber(v, 0);
}

function monthLabel(month1to12: number) {
  return new Date(2000, month1to12 - 1, 1).toLocaleString(undefined, { month: "short" });
}

function monthYearLabel(year: number, month1to12: number) {
  return new Date(year, month1to12 - 1, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
}

/** ---------- Icons ---------- */
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

function IconBars() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M7 15v-6" />
      <path d="M11 15V5" />
      <path d="M15 15v-9" />
      <path d="M19 15v-3" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-amber-500" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-700 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/** ---------- Conditional styling logic ---------- */
function riskTone(alerts: number | null) {
  if (alerts === null) return { tone: "neutral" as const, label: "Unavailable" };
  if (alerts >= 7) return { tone: "riskHigh" as const, label: "High Concern" };
  if (alerts >= 4) return { tone: "riskModerate" as const, label: "Moderate Concern" };
  if (alerts >= 1) return { tone: "riskLow" as const, label: "Low Concern" };
  return { tone: "neutral" as const, label: "No Active Alerts" };
}

function engagementTone(score: number | null) {
  if (score === null) return "neutral" as const;
  return score >= 8 ? ("engagement" as const) : ("neutral" as const);
}

function EngagementBar({ score }: { score: number }) {
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

export default function DashboardSection() {
  const { theme, toggle } = useTheme();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1–12

  const [data, setData] = useState<CompanyMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = (y: number, m: number) => {
    let alive = true;
    setLoading(true);
    setError("");

    fetchCompanyMetrics({ year: y, month: m })
      .then((res) => {
        if (!alive) return;
        setData(res);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Unknown error");
        setData(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  };

  useEffect(() => {
    const cleanup = load(year, month);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const computed = useMemo(() => {
    const metrics = data?.metrics ?? {};

    const enrolledRaw = metrics.totalEmployeesEnrolled;
    const activeRaw = metrics.activeThisMonth;
    const weeklyRaw = metrics.weeklyCheckupsCompleted;
    const engagementRaw = metrics.avgEngagementScore;
    const alertsRaw = metrics.riskAlertsTriggered;

    const enrolledDisplay = isNum(enrolledRaw) ? enrolledRaw : null;
    const activeDisplay = isNum(activeRaw) ? activeRaw : null;
    const weeklyDisplay = isNum(weeklyRaw) ? weeklyRaw : null;
    const engagementDisplay = isNum(engagementRaw) ? engagementRaw : null;
    const alertsDisplay = isNum(alertsRaw) ? alertsRaw : null;

    const enrolledCalc = numberOrZero(enrolledRaw);
    const activeCalc = numberOrZero(activeRaw);
    const weeklyCalc = numberOrZero(weeklyRaw);

    const participationRate = enrolledCalc > 0 ? activeCalc / enrolledCalc : 0;
    const avgWeeklyPerActive = activeCalc > 0 ? weeklyCalc / activeCalc : 0;

    const participationIsMeaningful = enrolledCalc > 0 && isNum(activeRaw);
    const avgWeeklyIsMeaningful = activeCalc > 0 && isNum(weeklyRaw);

    return {
      enrolledDisplay,
      activeDisplay,
      weeklyDisplay,
      engagementDisplay,
      alertsDisplay,
      enrolledCalc,
      participationRate,
      avgWeeklyPerActive,
      participationIsMeaningful,
      avgWeeklyIsMeaningful,
    };
  }, [data]);

  const years = useMemo(() => {
    const current = now.getFullYear();
    return [current, current - 1, current - 2, current - 3];
  }, [now]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur transition-colors">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <span className="text-sm font-semibold">P</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-slate-50">PawHealthAI</span>
              <span className="text-slate-400"> | </span>
              <span className="text-slate-500 dark:text-slate-400">Enterprise Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Month / Year selector */}
            <div className="flex items-center gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-700 dark:text-slate-200"
                aria-label="Select month"
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const m = i + 1;
                  return (
                    <option key={m} value={m}>
                      {monthLabel(m)}
                    </option>
                  );
                })}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-700 dark:text-slate-200"
                aria-label="Select year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 h-9 w-9 bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <IconMoon /> : <IconSun />}
            </button>

            <UserMenu
              initials="HR"
              name="HR Manager"
              email="hr@acme.com"
              onProfile={() => alert("Go to Profile page")}
              onUpdateProfile={() => alert("Open Update Profile modal")}
              onLogout={() => alert("Log out")}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-50">{data?.companyName ?? "—"}</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Engagement Overview • {monthYearLabel(year, month)}</p>
        </div>

        {/* States */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors">
                <div className="h-4 w-40 rounded bg-slate-100 dark:bg-slate-700" />
                <div className="mt-4 h-10 w-24 rounded bg-slate-100 dark:bg-slate-700" />
                <div className="mt-4 h-4 w-56 rounded bg-slate-100 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 dark:border-rose-300/30 bg-rose-50 dark:bg-rose-950/30 p-6 text-rose-800 dark:text-rose-200 transition-colors">
            <div className="font-semibold">Something went wrong</div>
            <div className="mt-1 text-sm">{error}</div>
            <button
              onClick={() => load(year, month)}
              className="mt-4 rounded-xl bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-rose-700 dark:text-rose-200 shadow-sm border border-rose-200 dark:border-rose-300/30"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <MetricCard
                icon={<IconUsers />}
                title="Total Enrolled"
                value={computed.enrolledDisplay === null ? "—" : formatInt(computed.enrolledDisplay)}
                subtitle={computed.enrolledDisplay === null ? "Data unavailable" : "Employees in program"}
              />

              <MetricCard
                icon={<IconTrend />}
                title="Active This Month"
                value={computed.activeDisplay === null ? "—" : formatInt(computed.activeDisplay)}
                subtitle={
                  computed.enrolledCalc === 0
                    ? "0.0% participation rate (no enrolled employees)"
                    : computed.participationIsMeaningful
                    ? `${formatPercent(computed.participationRate)} participation rate`
                    : "Participation rate unavailable"
                }
              />

              <MetricCard
                icon={<IconBars />}
                title="Weekly Checkups"
                value={computed.weeklyDisplay === null ? "—" : formatInt(computed.weeklyDisplay)}
                subtitle={
                  computed.avgWeeklyIsMeaningful
                    ? `Avg ${formatOneDecimal(computed.avgWeeklyPerActive)} per active user`
                    : "Average per active user unavailable"
                }
              />

              {(() => {
                const r = riskTone(computed.alertsDisplay);
                return (
                  <MetricCard
                    icon={<IconAlert />}
                    title="Risk Alerts Triggered"
                    value={computed.alertsDisplay === null ? "—" : formatInt(computed.alertsDisplay)}
                    subtitle={computed.alertsDisplay === null ? "Data unavailable" : "Requires HR attention"}
                    tone={r.tone}
                    rightSlot={<Pill label={r.label} tone={r.tone} />}
                  />
                );
              })()}

              <MetricCard
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20l9-5-9-5-9 5 9 5z" />
                    <path d="M12 12l9-5-9-5-9 5 9 5z" />
                  </svg>
                }
                title="Average Engagement Score"
                value={
                  computed.engagementDisplay === null ? (
                    "—"
                  ) : (
                    <span>
                      {formatOneDecimal(computed.engagementDisplay)}
                      <span className="text-base text-slate-500 dark:text-slate-400"> / 10</span>
                    </span>
                  )
                }
                subtitle={
                  computed.engagementDisplay === null ? (
                    <span className="text-sm text-slate-600 dark:text-slate-300">Data unavailable</span>
                  ) : (
                    <EngagementBar score={computed.engagementDisplay} />
                  )
                }
                tone={engagementTone(computed.engagementDisplay)}
                rightSlot={
                  <Pill
                    label={
                      computed.engagementDisplay === null
                        ? "Unavailable"
                        : computed.engagementDisplay >= 8
                        ? "Strong Engagement"
                        : "Needs Improvement"
                    }
                    tone={engagementTone(computed.engagementDisplay)}
                  />
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
