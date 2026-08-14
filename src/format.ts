const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** Parses a numeric input's raw string value, falling back to 0 for empty or non-numeric intermediate states (e.g. "-", "."). */
export function parseNumberInput(rawValue: string): number {
  const parsed = Number(rawValue);
  return Number.isNaN(parsed) ? 0 : parsed;
}
