"use client";

import { useMemo, useState } from "react";
import MetricCard, { Pill } from "../MetricCard";
import { useCompanyMetrics } from "@/hooks/useCompanyMetrics";
import { engagementTone, monthYearLabel, riskTone } from "@/lib/dashboard/helpers";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { EngagementBar } from "@/components/dashboard/EngagementBar";
import { IconAlert, IconBars, IconLayers, IconTrend, IconUsers } from "@/components/dashboard/Icons";
import { formatInt, formatOneDecimal, formatPercent } from "@/lib/format";

export default function DashboardSection() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);

  const { data, loading, error, computed, reload } = useCompanyMetrics(year, month);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 4 }, (_, index) => currentYear - index);
  }, []);

  const engagementValue =
    computed.engagementDisplay === null ? (
      "—"
    ) : (
      <span>
        {formatOneDecimal(computed.engagementDisplay)}
        <span className="text-base text-slate-500 dark:text-slate-400"> / 10</span>
      </span>
    );

  const engagementSubtitle =
    computed.engagementDisplay === null ? "Data unavailable" : <EngagementBar score={computed.engagementDisplay} />;

  const engagementPillLabel =
    computed.engagementDisplay === null
      ? "Unavailable"
      : computed.engagementDisplay >= 8
        ? "Strong Engagement"
        : "Needs Improvement";

  const activeSubtitle =
    computed.enrolledCalc === 0
      ? "0.0% participation rate (no enrolled employees)"
      : computed.participationIsMeaningful
        ? `${formatPercent(computed.participationRate)} participation rate`
        : "Participation rate unavailable";

  const weeklySubtitle = computed.avgWeeklyIsMeaningful
    ? `Avg ${formatOneDecimal(computed.avgWeeklyPerActive)} per active user`
    : "Average per active user unavailable";

  const risk = riskTone(computed.alertsDisplay);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <DashboardTopBar month={month} year={year} years={years} setMonth={setMonth} setYear={setYear} />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-50">{data?.companyName ?? "—"}</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Engagement Overview • {monthYearLabel(year, month)}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors"
              >
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
            <div className="md:col-span-2">
              <MetricCard
                featured
                layout="center"
                tone="engagement"
                icon={<IconLayers />}
                title="Average Engagement Score"
                value={engagementValue}
                subtitle={engagementSubtitle}
                rightSlot={
                  <Pill label={engagementPillLabel} tone={engagementTone(computed.engagementDisplay)} />
                }
              />
            </div>

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
              subtitle={activeSubtitle}
            />

            <MetricCard
              icon={<IconBars />}
              title="Weekly Checkups"
              value={computed.weeklyDisplay === null ? "—" : formatInt(computed.weeklyDisplay)}
              subtitle={weeklySubtitle}
            />

            <MetricCard
              icon={<IconAlert />}
              title="Risk Alerts Triggered"
              value={computed.alertsDisplay === null ? "—" : formatInt(computed.alertsDisplay)}
              subtitle={computed.alertsDisplay === null ? "Data unavailable" : "Requires HR attention"}
              tone={risk.tone}
              rightSlot={<Pill label={risk.label} tone={risk.tone} />}
            />
          </div>
        )}
      </div>
    </div>
  );
}
