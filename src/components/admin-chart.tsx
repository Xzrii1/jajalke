"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAdminChartData, type AdminChartData } from "@/app/actions/transaksi";

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const RANGE_OPTIONS = [
  { days: 7, label: "7 Hari" },
  { days: 14, label: "14 Hari" },
  { days: 30, label: "30 Hari" },
] as const;

function shortDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${BULAN[m - 1]}`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const rows = payload.filter((p) => p.value > 0);
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="mb-1 text-xs font-semibold text-slate-700">{label}</p>
      {rows.length === 0 ? (
        <p className="text-xs text-slate-400">Tidak ada aktivitas</p>
      ) : (
        <ul className="space-y-1">
          {rows.map((p) => (
            <li key={p.dataKey} className="flex items-center gap-2 text-xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  p.dataKey === "pinjam" ? "bg-indigo-500" : "bg-emerald-500"
                }`}
              />
              <span className="text-slate-500">
                {p.dataKey === "pinjam" ? "Dipinjam" : "Dikembalikan"}
              </span>
              <span className="ml-auto pl-4 font-semibold text-slate-900">{p.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AdminChart() {
  const [days, setDays] = useState<number>(14);
  const [data, setData] = useState<AdminChartData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAdminChartData(days).then((res) => {
      if (cancelled) return;
      if (res.error) setError(res.error);
      else setData(res.data ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const rows =
    data?.dates.map((iso, i) => ({
      iso,
      label: shortDate(iso),
      pinjam: data.pinjam[i],
      kembali: data.kembali[i],
    })) ?? [];

  const totalPinjam = rows.reduce((s, r) => s + r.pinjam, 0);
  const totalKembali = rows.reduce((s, r) => s + r.kembali, 0);
  const puncakPinjam = rows.reduce((m, r) => Math.max(m, r.pinjam), 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Aktivitas Perpustakaan
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Tren peminjaman &amp; pengembalian {days} hari terakhir
          </p>
        </div>
        <div className="flex gap-1 rounded-full bg-slate-100 p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              type="button"
              onClick={() => setDays(opt.days)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                days === opt.days
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          label="Total Dipinjam"
          value={totalPinjam}
          accent="indigo"
          icon="pinjam"
          delay="0ms"
        />
        <StatTile
          label="Total Dikembalikan"
          value={totalKembali}
          accent="emerald"
          icon="kembali"
          delay="80ms"
        />
        <StatTile
          label="Puncak Per Hari"
          value={puncakPinjam}
          accent="violet"
          icon="puncak"
          delay="160ms"
        />
      </div>

      <div className="h-64">
        {error && <p className="text-center text-sm text-slate-500">{error}</p>}
        {loading && (
          <div className="flex h-full items-center justify-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
          </div>
        )}
        {!loading && !error && rows.length > 0 && totalPinjam + totalKembali > 0 && (
          <div key={days} className="anim-chart h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPinjam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradKembali" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  interval={days === 30 ? "preserveStartEnd" : undefined}
                  minTickGap={16}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  width={34}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#c7d2fe", strokeDasharray: "4 4" }} />
                <Area
                  type="monotone"
                  dataKey="pinjam"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fill="url(#gradPinjam)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="kembali"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#gradKembali)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {!loading && !error && totalPinjam + totalKembali === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </span>
            <p className="mt-3 text-sm font-medium text-slate-600">
              Belum ada aktivitas di {days} hari terakhir
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          Dipinjam
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Dikembalikan
        </span>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
  icon,
  delay,
}: {
  label: string;
  value: number;
  accent: "indigo" | "emerald" | "violet";
  icon: "pinjam" | "kembali" | "puncak";
  delay: string;
}) {
  const palettes = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", chip: "bg-indigo-100 text-indigo-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", chip: "bg-emerald-100 text-emerald-600" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", chip: "bg-violet-100 text-violet-600" },
  }[accent];

  const icons = {
    pinjam: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 13h18" />
      </svg>
    ),
    kembali: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    puncak: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  }[icon];

  return (
    <div
      style={{ animationDelay: delay }}
      className={`anim-rise flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm`}
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${palettes.chip}`}>
        {icons}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className={`text-xl font-semibold tabular-nums tracking-tight ${palettes.text}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
