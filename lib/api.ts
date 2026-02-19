import type { CompanyMetricsResponse } from "./types";

type InternalMockMode = "normal" | "missing" | "zero" | "error";

const rawMode = process.env.NEXT_PUBLIC_MOCK_MODE as InternalMockMode | undefined;
const mode: InternalMockMode =
  rawMode && ["normal", "missing", "zero", "error"].includes(rawMode)
    ? rawMode
    : "normal";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Fixed canonical dataset for Feb 2026 (your provided API example).
 */
const FIXED_FEB_2026: CompanyMetricsResponse = {
  companyId: "acme-001",
  companyName: "Acme Corp",
  metrics: {
    totalEmployeesEnrolled: 148,
    activeThisMonth: 92,
    weeklyCheckupsCompleted: 310,
    avgEngagementScore: 7.8,
    riskAlertsTriggered: 4,
  },
};

/**
 * Deterministic pseudo-random generator (so values are stable for the same year/month).
 * This is NOT cryptographic; it's just for mock data.
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMockData(year: number, month: number): CompanyMetricsResponse {
  // Special case: Feb 2026 must match exactly
  if (year === 2026 && month === 2) return FIXED_FEB_2026;

  const seed = year * 100 + month;
  const rnd = mulberry32(seed);

  const enrolled = clamp(Math.floor(120 + rnd() * 120), 0, 5000); // 120–239
  const participation = clamp(0.35 + rnd() * 0.4, 0, 1); // 35%–75%
  const active = clamp(Math.floor(enrolled * participation), 0, enrolled);

  const weeklyPerActive = clamp(1 + rnd() * 4, 0, 10); // 1–5
  const weekly = clamp(Math.floor(active * weeklyPerActive), 0, 100000);

  const engagement = clamp(Math.round((5.5 + rnd() * 4.3) * 10) / 10, 0, 10); // 5.5–9.8 (1 dp)
  const alerts = clamp(Math.floor(rnd() * 8), 0, 9999); // 0–7

  return {
    companyId: "acme-001",
    companyName: "Acme Corp",
    metrics: {
      totalEmployeesEnrolled: enrolled,
      activeThisMonth: active,
      weeklyCheckupsCompleted: weekly,
      avgEngagementScore: engagement,
      riskAlertsTriggered: alerts,
    },
  };
}

export async function fetchCompanyMetrics(params?: {
  year?: number;
  month?: number; // 1–12
}): Promise<CompanyMetricsResponse> {
  await new Promise((r) => setTimeout(r, 700));

  // Simulate API failure
  if (mode === "error") {
    throw new Error("Failed to load company metrics. Please try again.");
  }

  // Simulate zero enrolled employees
  if (mode === "zero") {
    return {
      companyId: "acme-002",
      companyName: "Acme Corp",
      metrics: {
        totalEmployeesEnrolled: 0,
        activeThisMonth: 0,
        weeklyCheckupsCompleted: 0,
        avgEngagementScore: 0,
        riskAlertsTriggered: 0,
      },
    };
  }

  // Simulate missing values
  if (mode === "missing") {
    return {
      companyId: "acme-003",
      companyName: "Acme Corp",
      metrics: {
        totalEmployeesEnrolled: 148,
        // activeThisMonth missing
        weeklyCheckupsCompleted: undefined,
        avgEngagementScore: 7.2,
        // riskAlertsTriggered missing
      },
    };
  }

  const now = new Date();
  const year = params?.year ?? now.getFullYear();
  const month = params?.month ?? now.getMonth() + 1;

  // Contract validation
  if (month < 1 || month > 12) {
    throw new Error("Invalid month. Month must be between 1 and 12.");
  }

  return generateMockData(year, month);
}
