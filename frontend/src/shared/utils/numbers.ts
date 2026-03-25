export function formatKg(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} t`;
  }
  return `${value.toFixed(1)} kg`;
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
