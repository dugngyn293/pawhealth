const INT_FORMATTER = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const ONE_DECIMAL_FORMATTER = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function formatInt(value: number): string {
  return INT_FORMATTER.format(value);
}

export function formatOneDecimal(value: number): string {
  return ONE_DECIMAL_FORMATTER.format(value);
}

export function formatPercent(value01: number): string {
  return `${ONE_DECIMAL_FORMATTER.format(value01 * 100)}%`;
}
