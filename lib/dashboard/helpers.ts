import { safeNumber } from "@/lib/format";

type RiskTone = "neutral" | "riskLow" | "riskModerate" | "riskHigh";
type EngagementTone = "neutral" | "engagement";

const MONTH_SHORT_FORMAT: Intl.DateTimeFormatOptions = { month: "short" };
const MONTH_YEAR_FORMAT: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };

export function isNum(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function numberOrZero(value: unknown): number {
  return safeNumber(value, 0);
}

export function monthLabel(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString(undefined, MONTH_SHORT_FORMAT);
}

export function monthYearLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleString(undefined, MONTH_YEAR_FORMAT);
}

export function riskTone(alerts: number | null): { tone: RiskTone; label: string } {
  if (alerts === null) return { tone: "neutral", label: "Unavailable" };
  if (alerts >= 7) return { tone: "riskHigh", label: "High Concern" };
  if (alerts >= 4) return { tone: "riskModerate", label: "Moderate Concern" };
  if (alerts >= 1) return { tone: "riskLow", label: "Low Concern" };
  return { tone: "neutral", label: "No Active Alerts" };
}

export function engagementTone(score: number | null): EngagementTone {
  if (score === null) return "neutral";
  return score >= 8 ? "engagement" : "neutral";
}
