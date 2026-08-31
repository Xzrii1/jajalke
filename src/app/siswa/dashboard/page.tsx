"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSiswaStats, type SiswaStats } from "@/app/actions/transaksi";
import { Alert, Card, Spinner } from "@/components/ui";

export default function SiswaDashboard() {
  const [stats, setStats] = useState<SiswaStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getSiswaStats().then((res) => {
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
        <h1 className="text-2xl font-bold text-slate-900">
          Halo, {stats?.user.nama_lengkap.split(" ")[0] ?? "Siswa"} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {stats?.user.kelas
            ? `Kelas ${stats.user.kelas}${stats.user.no_induk ? ` · NIS ${stats.user.no_induk}` : ""}`
            : "Anggota perpustakaan sekolah."}
        </p>
      </div>

      {error && <Alert kind="info">{error}</Alert>}

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/siswa/transaksi">
            <Card className="h-full transition hover:border-indigo-300 hover:shadow">
              <p className="text-sm font-medium text-slate-500">Buku Dipinjam</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.aktif}</p>
            </Card>
          </Link>
          <Link href="/siswa/transaksi">
            <Card className="h-full transition hover:border-amber-300 hover:shadow">
              <p className="text-sm font-medium text-slate-500">Terlambat</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.terlambat}</p>
            </Card>
          </Link>
          <Link href="/siswa/buku">
            <Card className="h-full transition hover:border-emerald-300 hover:shadow">
              <p className="text-sm font-medium text-slate-500">Koleksi Buku</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">Cari &amp; Pinjam →</p>
            </Card>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold text-slate-900">Langkah meminjam buku</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>Buka menu <b>Cari Buku</b> dan cari buku yang kamu mau.</li>
            <li>Klik <b>Pinjam</b> jika stok tersedia.</li>
            <li>Jatuh tempo peminjaman 7 hari sejak dipinjam.</li>
            <li>Kembalikan melalui menu <b>Peminjaman Saya</b> agar tidak kena denda.</li>
          </ol>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-slate-900">Aturan denda</h2>
          <p className="mt-3 text-sm text-slate-600">
            Keterlambatan pengembalian dikenakan denda{" "}
            <b>Rp 1.000 per hari</b> dihitung sejak lewat tanggal jatuh tempo
            sampai buku dikembalikan.
          </p>
        </Card>
      </div>
    </div>
  );
}