import { useEffect, useState } from "react";
import { DAYS } from "../data/demo";

export function formatCountdown(ms: number) {
  if (ms <= 0) return "¡Ahora!";
  const totalMin = Math.floor(ms / 60000);
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatDate(ts: number) {
  const d = new Date(ts);
  return `${DAYS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const money = (n: number) => `$${Math.round(n).toLocaleString("es-AR")}`;

export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
