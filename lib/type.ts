export type Metrics = {
  totalEmployeesEnrolled?: number;
  activeThisMonth?: number;
  weeklyCheckupsCompleted?: number;
  avgEngagementScore?: number; // assume 0–10
  riskAlertsTriggered?: number;
};

export type CompanyMetricsResponse = {
  companyId: string;
  companyName: string;
  metrics: Metrics;
};
