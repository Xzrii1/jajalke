"use client";

import { useEffect, useState } from "react";

function formatWaktu(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

function formatTanggal(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function LiveClock() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
      <span className="relative flex h-2.5 w-2.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
      </span>
      <div className="leading-tight">
        <p className="font-display text-lg font-semibold tabular-nums tracking-tight text-slate-900">
          {formatWaktu(now)}
        </p>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          {formatTanggal(now)}
        </p>
      </div>
    </div>
  );
}
