"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSiswaStats, type SiswaStats } from "@/app/actions/transaksi";
import { Alert, Card, Spinner } from "@/components/ui";
import { LiveClock } from "@/components/live-clock";
import { JamOperasionalCard } from "@/components/jam-operasional-card";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { formatRupiah } from "@/lib/utils";

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
      <motion.section
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-600/25 sm:p-8"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 85% 20%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 10% 120%, rgba(217,70,239,0.5), transparent 50%)" }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100/90">
              Perpustakaan Sekolah
            </p>
            <h1 className="mt-1.5 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Halo, {stats?.user.nama_lengkap.split(" ")[0] ?? "Siswa"}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-indigo-100/85">
              {stats?.user.kelas
                ? `Kelas ${stats.user.kelas}${stats.user.no_induk ? ` · NIS ${stats.user.no_induk}` : ""}`
                : "Anggota perpustakaan sekolah."}
            </p>
          </div>
          <LiveClock dark />
        </div>
      </motion.section>

      {error && <Alert kind="info">{error}</Alert>}

      <Reveal delay={0.05}>
        <JamOperasionalCard />
      </Reveal>

      {stats && (
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StaggerItem>
            <Link href="/siswa/transaksi">
              <Card className="card-lift group h-full">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Buku Dipinjam
                    </p>
                    <p className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-900">
                      <Counter value={stats.aktif} />
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 transition-transform duration-300 group-hover:scale-110">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h2v14H5zm4 3h2v8H9zm4-4h2v16h-2zM17 7h2v6h-2z" />
                    </svg>
                  </span>
                </div>
              </Card>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <Link href="/siswa/transaksi">
              <Card className="card-lift group h-full">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Menunggu Persetujuan
                    </p>
                    <p className="mt-1.5 text-3xl font-semibold tracking-tight text-amber-600">
                      <Counter value={stats.pending} className="text-amber-600" />
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                  </span>
                </div>
              </Card>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <Link href="/siswa/transaksi">
              <Card className="card-lift group h-full">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Terlambat
                    </p>
                    <p className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-900">
                      <Counter value={stats.terlambat} />
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/30">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                    </svg>
                  </span>
                </div>
              </Card>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <Link href="/siswa/buku">
              <Card className="card-lift group h-full">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Koleksi Buku
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-emerald-600">
                      Cari &amp; Pinjam →
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </span>
                </div>
              </Card>
            </Link>
          </StaggerItem>
        </Stagger>
      )}

      <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StaggerItem>
          <Card className="h-full">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Langkah meminjam buku
            </h2>
            <ol className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
              <li>Buka menu <b className="font-semibold text-slate-800">Cari Buku</b> dan cari buku yang kamu mau.</li>
              <li>Masukkan lama pinjam (jumlah hari, maks. 30) lalu klik <b className="font-semibold text-slate-800">Ajukan</b>.</li>
              <li>Permintaanmu berstatus <b className="font-semibold text-amber-600">Menunggu Persetujuan</b> sampai disetujui petugas/admin.</li>
              <li>Setelah disetujui, kembalikan melalui menu <b className="font-semibold text-slate-800">Peminjaman Saya</b> — klik <b className="font-semibold text-slate-800">Ajukan Kembali</b>.</li>
              <li>Pengembalianmu juga butuh persetujuan petugas/admin, lalu stok buku baru dihitung kembali.</li>
            </ol>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card className="h-full">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Aturan denda
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Keterlambatan pengembalian dikenakan denda{" "}
              <b className="font-semibold text-slate-800">
                {formatRupiah(stats?.dendaPerHari ?? 0)} per hari
              </b>{" "}
              dihitung sejak lewat tanggal jatuh tempo sampai buku dikembalikan.
            </p>
          </Card>
        </StaggerItem>
      </Stagger>
    </div>
  );
}