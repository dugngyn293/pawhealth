"use client";

import { useEffect, useMemo, useState } from "react";
import MetricCard, { Pill } from "./MetricCard";
import { fetchCompanyMetrics, type Scenario } from "@/lib/api";
import { formatInt, formatOneDecimal, formatPercent, safeNumber } from "@/lib/format";
import type { CompanyMetricsResponse } from "@/lib/type"

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

function IconBars() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600" fill="none" stroke="currentColor" strokeWidth="2">
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
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function riskTone(alerts: number) {
  if (alerts >= 7) return { tone: "riskHigh" as const, label: "High Concern" };
  if (alerts >= 4) return { tone: "riskModerate" as const, label: "Moderate Concern" };
  if (alerts >= 1) return { tone: "riskLow" as const, label: "Low Concern" };
  return { tone: "neutral" as const, label: "No Active Alerts" };
}

function engagementTone(score: number) {
  return score >= 8 ? "engagement" : "neutral";
}

function EngagementBar({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(10, score));
  const pct = (clamped / 10) * 100;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>0</span>
        <span>10</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-slate-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardSection() {
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [data, setData] = useState<CompanyMetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    fetchCompanyMetrics(scenario)
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
  }, [scenario]);

  const computed = useMemo(() => {
    const metrics = data?.metrics ?? {};
    const enrolled = safeNumber(metrics.totalEmployeesEnrolled, 0);
    const active = safeNumber(metrics.activeThisMonth, 0);
    const weekly = safeNumber(metrics.weeklyCheckupsCompleted, 0);
    const engagement = safeNumber(metrics.avgEngagementScore, 0);
    const alerts = safeNumber(metrics.riskAlertsTriggered, 0);

    const participationRate = enrolled > 0 ? active / enrolled : 0;
    const avgWeeklyPerActive = active > 0 ? weekly / active : 0;

    return { enrolled, active, weekly, engagement, alerts, participationRate, avgWeeklyPerActive };
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <span className="text-sm font-semibold">P</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-slate-900">PawHealthAI</span>
              <span className="text-slate-400"> | </span>
              <span className="text-slate-500">Enterprise Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-500 hidden sm:block">Scenario:</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as Scenario)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="normal">Normal Data</option>
              <option value="loading">Loading</option>
              <option value="missing">Missing Values</option>
              <option value="zero">Zero Enrolled</option>
              <option value="error">Error</option>
            </select>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
              HR
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-900">{data?.companyName ?? "—"}</h1>
          <p className="mt-2 text-slate-500">Engagement Overview • Last 30 Days</p>
        </div>

        {/* States */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="h-4 w-40 rounded bg-slate-100" />
                <div className="mt-4 h-10 w-24 rounded bg-slate-100" />
                <div className="mt-4 h-4 w-56 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
            <div className="font-semibold">Something went wrong</div>
            <div className="mt-1 text-sm">{error}</div>
            <button
              onClick={() => setScenario("normal")}
              className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-medium text-rose-700 shadow-sm border border-rose-200"
            >
              Back to Normal Data
            </button>
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <MetricCard
                icon={<IconUsers />}
                title="Total Enrolled"
                value={formatInt(computed.enrolled)}
                subtitle="Employees in program"
              />

              <MetricCard
                icon={<IconTrend />}
                title="Active This Month"
                value={formatInt(computed.active)}
                subtitle={
                  <span>
                    {formatPercent(computed.participationRate)} participation rate
                  </span>
                }
              />

              <MetricCard
                icon={<IconBars />}
                title="Weekly Checkups"
                value={formatInt(computed.weekly)}
                subtitle={
                  <span>
                    Avg {formatOneDecimal(computed.avgWeeklyPerActive)} per active user
                  </span>
                }
              />

              {(() => {
                const r = riskTone(computed.alerts);
                return (
                  <MetricCard
                    icon={<IconAlert />}
                    title="Risk Alerts Triggered"
                    value={formatInt(computed.alerts)}
                    subtitle="Requires HR attention"
                    tone={r.tone}
                    rightSlot={<Pill label={r.label} tone={r.tone} />}
                  />
                );
              })()}

              <MetricCard
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20l9-5-9-5-9 5 9 5z" />
                    <path d="M12 12l9-5-9-5-9 5 9 5z" />
                  </svg>
                }
                title="Average Engagement Score"
                value={
                  <span>
                    {formatOneDecimal(computed.engagement)}
                    <span className="text-base text-slate-500"> / 10</span>
                  </span>
                }
                subtitle={<EngagementBar score={computed.engagement} />}
                tone={engagementTone(computed.engagement)}
                rightSlot={<Pill label={computed.engagement >= 8 ? "Strong Engagement" : "Needs Improvement"} tone={engagementTone(computed.engagement)} />}
              />
            </div>

            {/* Notes */}
            <div className="mt-8 text-xs text-slate-500">
              Edge cases handled: zero enrolled (participation = 0%), missing metrics default to 0, loading and error states.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
