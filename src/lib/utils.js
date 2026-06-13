export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount) {
  const val = Number(amount) || 0;
  return `৳${val.toLocaleString("en-BD")}`;
}

export function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

const API_BASE = 'http://localhost:8000';

export function getAvatarUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}
