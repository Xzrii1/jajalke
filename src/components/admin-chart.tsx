"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAdminChartData, type AdminChartData } from "@/app/actions/transaksi";

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const RANGE_OPTIONS = [
  { days: 7, label: "7 Hari" },
  { days: 14, label: "14 Hari" },
  { days: 30, label: "30 Hari" },
] as const;

function shortDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${BULAN[m - 1]}`;
}

function fullDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${HARI[date.getDay()]}, ${d} ${BULAN[m - 1]} ${y}`;
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

  const totalAktivitas = rows.reduce((s, r) => s + r.pinjam + r.kembali, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Aktivitas Peminjaman &amp; Pengembalian
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Total {totalAktivitas} aktivitas selama {days} hari terakhir.
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

      <div className="h-64">
        {error && <p className="text-center text-sm text-slate-500">{error}</p>}
        {loading && (
          <div className="flex h-full items-center justify-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
          </div>
        )}
        {!loading && !error && rows.length > 0 && totalAktivitas > 0 && (
          <div key={days} className="anim-chart h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 4, right: 0, left: -24, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
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
                <Tooltip
                  cursor={{ fill: "rgba(99,102,241,0.06)" }}
                  labelFormatter={(label) => <span className="font-semibold">{label}, {rows.find((r) => r.label === label)?.iso ? fullDate(rows.find((r) => r.label === label)!.iso) : ""}</span>}
                  formatter={(value, name) => [String(value), name === "pinjam" ? "Dipinjam" : "Dikembalikan"]}
                />
                <Bar dataKey="pinjam" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={18} animationDuration={700} animationEasing="ease-out" />
                <Bar dataKey="kembali" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={18} animationDuration={700} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {!loading && !error && totalAktivitas === 0 && (
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
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-600" />
          Dipinjam
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
          Dikembalikan
        </span>
      </div>
    </div>
  );
}