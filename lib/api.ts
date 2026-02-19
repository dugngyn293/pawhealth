import type { CompanyMetricsResponse } from "./types";

const MOCK_MODES = ["normal", "missing", "zero", "error"] as const;
type InternalMockMode = (typeof MOCK_MODES)[number];

const MOCK_DELAY_MS = 700;
const MIN_MONTH = 1;
const MAX_MONTH = 12;

function parseMockMode(value: string | undefined): InternalMockMode {
  return MOCK_MODES.includes(value as InternalMockMode) ? (value as InternalMockMode) : "normal";
}

const mode = parseMockMode(process.env.NEXT_PUBLIC_MOCK_MODE);

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

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

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMockData(year: number, month: number): CompanyMetricsResponse {
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

const ZERO_METRICS_RESPONSE: CompanyMetricsResponse = {
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

const MISSING_METRICS_RESPONSE: CompanyMetricsResponse = {
  companyId: "acme-003",
  companyName: "Acme Corp",
  metrics: {
    totalEmployeesEnrolled: 148,
    weeklyCheckupsCompleted: undefined,
    avgEngagementScore: 7.2,
  },
};

function assertValidMonth(month: number) {
  if (month < MIN_MONTH || month > MAX_MONTH) {
    throw new Error("Invalid month. Month must be between 1 and 12.");
  }
}

export async function fetchCompanyMetrics(params?: {
  year?: number;
  month?: number;
}): Promise<CompanyMetricsResponse> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  switch (mode) {
    case "error":
      throw new Error("Failed to load company metrics. Please try again.");
    case "zero":
      return ZERO_METRICS_RESPONSE;
    case "missing":
      return MISSING_METRICS_RESPONSE;
    case "normal":
      break;
    default: {
      const exhaustiveCheck: never = mode;
      return exhaustiveCheck;
    }
  }

  const now = new Date();
  const year = params?.year ?? now.getFullYear();
  const month = params?.month ?? now.getMonth() + 1;

  assertValidMonth(month);
  return generateMockData(year, month);
}
