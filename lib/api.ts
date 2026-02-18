import type { CompanyMetricsResponse } from "./types";

type InternalMockMode = "normal" | "missing" | "zero" | "error";

/**
 * Change this during development to simulate edge cases.
 * In a real app this wouldn't exist.
 */
const MOCK_MODE: InternalMockMode = "normal";

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
  companyName: "Acme Corp",
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
  companyName: "Acme Corp",
  metrics: {
    totalEmployeesEnrolled: 148,
    // activeThisMonth missing
    weeklyCheckupsCompleted: undefined,
    avgEngagementScore: 7.2,
    // riskAlertsTriggered missing
  },
};

export async function fetchCompanyMetrics(): Promise<CompanyMetricsResponse> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 700));

  if (MOCK_MODE === "error") {
    throw new Error("Failed to load company metrics. Please try again.");
  }

  if (MOCK_MODE === "zero") return MOCK_ZERO;
  if (MOCK_MODE === "missing") return MOCK_MISSING;

  return MOCK_NORMAL;
}
