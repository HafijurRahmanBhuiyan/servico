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

import { BASE_URL } from "@/lib/api";

const MEDIA_BASE =
  import.meta.env.VITE_MEDIA_URL ||
  (() => {
    try {
      return new URL(BASE_URL).origin;
    } catch {
      return "http://localhost:8000";
    }
  })();

export function resolveMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${String(MEDIA_BASE).replace(/\/+$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function getAvatarUrl(path) {
  return resolveMediaUrl(path);
}
