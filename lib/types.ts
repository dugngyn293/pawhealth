export type Metrics = {
  totalEmployeesEnrolled?: number;
  activeThisMonth?: number;            // renamed from activeThisMonth
  weeklyCheckupsCompleted?: number;
  avgEngagementScore?: number;         // 0–10
  riskAlertsTriggered?: number;
};

export type MetricsRange =
  | { type: "last_30_days" }
  | { type: "month"; year: number; month: number } // month: 1–12
  | { type: "custom"; from: string; to: string };  // ISO dates

export type CompanyMetricsResponse = {
  companyId: string;
  companyName: string;
  range?: MetricsRange;
  metrics: Metrics;
};
