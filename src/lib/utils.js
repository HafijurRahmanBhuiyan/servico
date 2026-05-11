export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}
