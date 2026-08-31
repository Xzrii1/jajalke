"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "@/app/actions/transaksi";
import { Alert, Card, Spinner } from "@/components/ui";

function StatCard({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number | string;
  icon: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition hover:border-indigo-300 hover:shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </Card>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Spinner label="Memuat dashboard..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan kondisi perpustakaan sekolah.
        </p>
      </div>

      {error && <Alert kind="info">{error}</Alert>}

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Judul Buku" value={stats.totalBuku} icon="📚" href="/admin/buku" />
          <StatCard label="Total Stok Buku" value={stats.totalStok} icon="🗂️" href="/admin/buku" />
          <StatCard label="Jumlah Anggota" value={stats.totalAnggota} icon="👥" href="/admin/anggota" />
          <StatCard label="Peminjaman Aktif" value={stats.transaksiAktif} icon="📖" href="/admin/transaksi" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="text-sm font-semibold text-slate-900">Kelola Data Buku</h2>
          <p className="mt-1 text-sm text-slate-500">
            Tambah, ubah, hapus, dan cari data buku perpustakaan.
          </p>
          <Link
            href="/admin/buku"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
          >
            Buka menu →
          </Link>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-slate-900">Kelola Anggota</h2>
          <p className="mt-1 text-sm text-slate-500">
            Daftar akun siswa dan kelola keanggotaan perpustakaan.
          </p>
          <Link
            href="/admin/anggota"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
          >
            Buka menu →
          </Link>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-slate-900">Transaksi</h2>
          <p className="mt-1 text-sm text-slate-500">
            Pantau dan kelola seluruh peminjaman &amp; pengembalian buku.
          </p>
          <Link
            href="/admin/transaksi"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
          >
            Buka menu →
          </Link>
        </Card>
      </div>
    </div>
  );
}