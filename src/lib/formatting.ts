export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatINRCompact(value: number): string {
  if (value >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  } else if (value >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(2)} L`;
  }
  return formatINR(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(value));
}

export function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
