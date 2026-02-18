import type { CompanyMetricsResponse } from "./type";

export type Scenario = "normal" | "loading" | "error" | "zero" | "missing";

const MOCK_NORMAL: CompanyMetricsResponse = {
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

const MOCK_ZERO: CompanyMetricsResponse = {
  companyId: "acme-002",
  companyName: "Zero Enrol Co",
  metrics: {
    totalEmployeesEnrolled: 0,
    activeThisMonth: 0,
    weeklyCheckupsCompleted: 0,
    avgEngagementScore: 0,
    riskAlertsTriggered: 0,
  },
};

const MOCK_MISSING: CompanyMetricsResponse = {
  companyId: "acme-003",
  companyName: "Partial Data Ltd",
  metrics: {
    totalEmployeesEnrolled: 148,
    // activeThisMonth missing
    weeklyCheckupsCompleted: undefined,
    avgEngagementScore: 7.2,
    // riskAlertsTriggered missing
  },
};

export async function fetchCompanyMetrics(scenario: Scenario): Promise<CompanyMetricsResponse> {
  await new Promise((r) => setTimeout(r, 600));

  if (scenario === "loading") {
    await new Promise((r) => setTimeout(r, 1400));
    return MOCK_NORMAL;
  }

  if (scenario === "error") {
    throw new Error("Failed to load company metrics. Please try again.");
  }

  if (scenario === "zero") return MOCK_ZERO;
  if (scenario === "missing") return MOCK_MISSING;
  return MOCK_NORMAL;
}
