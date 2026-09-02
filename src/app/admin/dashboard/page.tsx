"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "@/app/actions/transaksi";
import { getPengaturan, updateDendaPerHari, type Pengaturan } from "@/app/actions/pengaturan";
import { Alert, Button, Card, Field, Input, Spinner } from "@/components/ui";
import { AdminChart } from "@/components/admin-chart";
import { LiveClock } from "@/components/live-clock";
import type { ActionResult } from "@/lib/types";

function StatCard({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="card-lift group h-full hover:border-indigo-300">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {label}
            </p>
            <p className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-900">
              {value}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 transition-transform duration-300 group-hover:scale-110">
            {icon}
          </span>
        </div>
      </Card>
    </Link>
  );
}

const statIcons = {
  buku: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  stok: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  anggota: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  aktif: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h2v14H5zm4 3h2v8H9zm4-4h2v16h-2zM17 7h2v6h-2z" />
    </svg>
  ),
  pending: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
  menungguKembali: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 119 9 9 9 0 01-9-9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  ),
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pengaturan, setPengaturan] = useState<Pengaturan | null>(null);
  const [dendaInput, setDendaInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<ActionResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminStats().then((res) => {
      if (cancelled) return;
      if (res.error) setError(res.error);
      else setStats(res.data ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getPengaturan().then((res) => {
      if (cancelled) return;
      if (res.error) setError(res.error);
      else {
        setPengaturan(res.data ?? null);
        setDendaInput(String(res.data?.dendaPerHari ?? ""));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (settingsMsg) {
      const t = setTimeout(() => setSettingsMsg(null), 6000);
      return () => clearTimeout(t);
    }
  }, [settingsMsg]);

  async function handleSaveDenda() {
    setSaving(true);
    setSettingsMsg(null);
    const res = await updateDendaPerHari(Number(dendaInput));
    setSettingsMsg(res);
    setSaving(false);
    if (res.success && pengaturan) {
      setPengaturan({ ...pengaturan, dendaPerHari: Math.floor(Number(dendaInput)) });
    }
  }

  if (loading) return <Spinner label="Memuat dashboard..." />;

  return (
    <div className="anim-rise space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            Dashboard Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan kondisi perpustakaan sekolah.
          </p>
        </div>
        <LiveClock />
      </div>

      {error && <Alert kind="info">{error}</Alert>}

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="anim-rise d-1"><StatCard label="Total Judul Buku" value={stats.totalBuku} icon={statIcons.buku} href="/admin/buku" /></div>
          <div className="anim-rise d-1"><StatCard label="Total Stok Buku" value={stats.totalStok} icon={statIcons.stok} href="/admin/buku" /></div>
          <div className="anim-rise d-2"><StatCard label="Jumlah Anggota" value={stats.totalAnggota} icon={statIcons.anggota} href="/admin/anggota" /></div>
          <div className="anim-rise d-2"><StatCard label="Peminjaman Aktif" value={stats.transaksiAktif} icon={statIcons.aktif} href="/admin/transaksi" /></div>
          <div className="anim-rise d-3"><StatCard label="Ajuan Pinjam" value={stats.transaksiPending} icon={statIcons.pending} href="/admin/transaksi" /></div>
          <div className="anim-rise d-3"><StatCard label="Ajuan Kembali" value={stats.menungguKembali} icon={statIcons.menungguKembali} href="/admin/transaksi" /></div>
        </div>
      )}

      <Card className="card-lift">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-[260px] flex-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pengaturan Denda
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Tarif denda keterlambatan pengembalian buku per hari. Berlaku untuk
              peminjaman yang disetujui setelah disimpan.
            </p>
            {pengaturan?.dendaPerHari !== undefined && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">
                Rp {pengaturan.dendaPerHari.toLocaleString("id-ID")} / hari
              </p>
            )}
          </div>
          {pengaturan?.canEdit ? (
            <div className="w-full sm:w-72">
              <Field label="Tarif denda (Rp/hari)">
                <div className="flex gap-2">
                  <Input
                    value={dendaInput}
                    onChange={(e) => setDendaInput(e.target.value)}
                    type="number"
                    min={0}
                    placeholder="1000"
                    disabled={saving}
                  />
                  <Button onClick={handleSaveDenda} disabled={saving || !dendaInput.trim()}>
                    {saving ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </Field>
            </div>
          ) : (
            <p className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Hanya akun <b>Admin</b> yang dapat mengubah tarif denda.
            </p>
          )}
        </div>
        {settingsMsg?.error && (
          <div className="mt-3"><Alert kind="error">{settingsMsg.error}</Alert></div>
        )}
        {settingsMsg?.success && (
          <div className="mt-3"><Alert kind="success">{settingsMsg.success}</Alert></div>
        )}
      </Card>

      <Card className="anim-chart card-lift p-5 sm:p-6">
        <AdminChart />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {stats?.role === "petugas" && (
          <Card className="card-lift">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
              Kelola Data Buku
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Tambah, ubah, hapus, dan cari data buku perpustakaan.
            </p>
            <Link
              href="/admin/buku"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition group-hover:gap-2 hover:underline"
            >
              Buka menu
              <span aria-hidden>→</span>
            </Link>
          </Card>
        )}
        <Card className="card-lift">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-500">
            Kelola Anggota
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Daftar akun siswa dan kelola keanggotaan perpustakaan.
          </p>
          <Link
            href="/admin/anggota"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
          >
            Buka menu
            <span aria-hidden>→</span>
          </Link>
        </Card>
        <Card className="card-lift">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
            Transaksi
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Pantau dan kelola seluruh peminjaman &amp; pengembalian buku.
          </p>
          <Link
            href="/admin/transaksi"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
          >
            Buka menu
            <span aria-hidden>→</span>
          </Link>
        </Card>
      </div>
    </div>
  );
}