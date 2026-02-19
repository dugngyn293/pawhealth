"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCompanyMetrics } from "@/lib/api";
import type { CompanyMetricsResponse } from "@/lib/types";
import { isNum, numberOrZero } from "@/lib/dashboard/helpers";

export function useCompanyMetrics(year: number, month: number) {
  const [data, setData] = useState<CompanyMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback((y: number, m: number) => {
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
  }, []);

  useEffect(() => {
    const cleanup = load(year, month);
    return cleanup;
  }, [year, month, load]);

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

  return {
    data,
    loading,
    error,
    computed,
    reload: () => load(year, month),
  };
}
