import { safeNumber } from "@/lib/format";

export function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

export function numberOrZero(v: unknown): number {
  return safeNumber(v, 0);
}

export function monthLabel(month1to12: number) {
  return new Date(2000, month1to12 - 1, 1).toLocaleString(undefined, { month: "short" });
}

export function monthYearLabel(year: number, month1to12: number) {
  return new Date(year, month1to12 - 1, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
}

export function riskTone(alerts: number | null) {
  if (alerts === null) return { tone: "neutral" as const, label: "Unavailable" };
  if (alerts >= 7) return { tone: "riskHigh" as const, label: "High Concern" };
  if (alerts >= 4) return { tone: "riskModerate" as const, label: "Moderate Concern" };
  if (alerts >= 1) return { tone: "riskLow" as const, label: "Low Concern" };
  return { tone: "neutral" as const, label: "No Active Alerts" };
}

export function engagementTone(score: number | null) {
  if (score === null) return "neutral" as const;
  return score >= 8 ? ("engagement" as const) : ("neutral" as const);
}
