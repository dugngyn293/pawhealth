"use client";

import { useMemo, useState } from "react";
import MetricCard, { Pill } from "./MetricCard";
import { useCompanyMetrics } from "@/lib/useCompanyMetrics";
import { engagementTone, monthYearLabel, riskTone } from "@/lib/dashboard/helpers";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { EngagementBar } from "@/components/dashboard/EngagementBar";
import { IconAlert, IconBars, IconTrend, IconUsers } from "@/components/dashboard/Icons";
import { formatInt, formatOneDecimal, formatPercent } from "@/lib/format";

export default function DashboardSection() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data, loading, error, computed, reload } = useCompanyMetrics(year, month);

  const years = useMemo(() => {
    const current = now.getFullYear();
    return [current, current - 1, current - 2, current - 3];
  }, [now]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <DashboardTopBar month={month} year={year} years={years} setMonth={setMonth} setYear={setYear} />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-50">{data?.companyName ?? "—"}</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Engagement Overview • {monthYearLabel(year, month)}</p>
        </div>

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
              onClick={reload}
              className="mt-4 rounded-xl bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-rose-700 dark:text-rose-200 shadow-sm border border-rose-200 dark:border-rose-300/30"
            >
              Retry
            </button>
          </div>
        ) : (
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
              subtitle={computed.engagementDisplay === null ? "Data unavailable" : <EngagementBar score={computed.engagementDisplay} />}
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
        )}
      </div>
    </div>
  );
}
