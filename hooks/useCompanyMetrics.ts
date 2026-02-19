"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchCompanyMetrics } from "@/lib/api";
import type { CompanyMetricsResponse } from "@/lib/types";
import { isNum, numberOrZero } from "@/lib/dashboard/helpers";

export function useCompanyMetrics(year: number, month: number) {
  const [data, setData] = useState<CompanyMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);

  const load = useCallback(async (y: number, m: number) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError("");

    try {
      const res = await fetchCompanyMetrics({ year: y, month: m });
      if (requestId !== requestIdRef.current) return;
      setData(res);
    } catch (e: unknown) {
      if (requestId !== requestIdRef.current) return;
      setError(e instanceof Error ? e.message : "Unknown error");
      setData(null);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void load(year, month);
  }, [year, month, load]);

  const computed = useMemo(() => {
    const {
      totalEmployeesEnrolled: enrolledRaw,
      activeThisMonth: activeRaw,
      weeklyCheckupsCompleted: weeklyRaw,
      avgEngagementScore: engagementRaw,
      riskAlertsTriggered: alertsRaw,
    } = data?.metrics ?? {};

    const toDisplay = (value: unknown) => (isNum(value) ? value : null);

    const enrolledDisplay = toDisplay(enrolledRaw);
    const activeDisplay = toDisplay(activeRaw);
    const weeklyDisplay = toDisplay(weeklyRaw);
    const engagementDisplay = toDisplay(engagementRaw);
    const alertsDisplay = toDisplay(alertsRaw);

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
    reload: () => void load(year, month),
  };
}
