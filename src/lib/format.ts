const inrFmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
export const inr = (n: number) => inrFmt.format(n);

export function priceFor(rate: number, dailyCap: number, hours: number) {
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  const base = days * dailyCap + Math.min(rem * rate, dailyCap);
  const fee = Math.max(10, Math.round(base * 0.05));
  return { base, fee, total: base + fee };
}

export function fmtDateTime(ms: number) {
  return new Date(ms).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fmtDuration(ms: number) {
  if (ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec.toString().padStart(2, "0")}s`;
  return `${sec}s`;
}
