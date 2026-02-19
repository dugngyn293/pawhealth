export type Metrics = {
  totalEmployeesEnrolled?: number;
  activeThisMonth?: number;
  weeklyCheckupsCompleted?: number;
  avgEngagementScore?: number;
  riskAlertsTriggered?: number;
};

export type MetricsRange =
  | { type: "last_30_days" }
  | { type: "month"; year: number; month: number }
  | { type: "custom"; from: string; to: string };

export type CompanyMetricsResponse = {
  companyId: string;
  companyName: string;
  range?: MetricsRange;
  metrics: Metrics;
};
