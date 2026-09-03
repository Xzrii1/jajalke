"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getSiswaProfil,
  type ProfilDenda,
  type SiswaProfil,
} from "@/app/actions/profil";
import {
  Alert,
  Badge,
  Button,
  Card,
  Spinner,
} from "@/components/ui";
import { QrisModal } from "@/components/qris-modal";
import { formatRupiah, formatTanggal, dendaSisa } from "@/lib/utils";

export default function SiswaProfil() {
  const [profil, setProfil] = useState<SiswaProfil | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<ProfilDenda | null>(null);

  const load = useCallback(async () => {
    const res = await getSiswaProfil();
    if (res.error) setError(res.error);
    else setProfil(res.data ?? null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSiswaProfil().then((res) => {
      if (cancelled) return;
      if (res.error) setError(res.error);
      else setProfil(res.data ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Spinner label="Memuat profil..." />;

  if (!profil) {
    return (
      <div className="anim-rise">
        {error && <Alert kind="info">{error}</Alert>}
      </div>
    );
  }

  const { user } = profil;
  const inisial = user.nama_lengkap
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <div className="anim-rise space-y-6">
      <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
        Profil Saya
      </h1>

      {error && <Alert kind="info">{error}</Alert>}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
              {inisial}
            </div>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">
              {user.nama_lengkap}
            </h2>
            <p className="text-sm text-slate-500">
              @{user.username}
              {user.kelas ? ` · Kelas ${user.kelas}` : ""}
            </p>
            {user.no_induk && (
              <p className="mt-1 text-xs text-slate-400">NIS {user.no_induk}</p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge tone="tersedia">Siswa</Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <Card className="card-lift">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Pinjam
            </p>
            <p className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-900">
              {profil.totalPinjam}
            </p>
          </Card>
          <Card className="card-lift">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sedang Dipinjam
            </p>
            <p className="mt-1.5 text-3xl font-semibold tracking-tight text-indigo-600">
              {profil.aktif}
            </p>
          </Card>
          <Card className="card-lift">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Terlambat
            </p>
            <p className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-900">
              {profil.terlambat}
            </p>
          </Card>
          <Card
            className={`card-lift ${profil.totalDendaBelumBayar > 0 ? "ring-1 ring-rose-300" : ""}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Denda Belum Bayar
            </p>
            <p
              className={`mt-1.5 text-xl font-semibold tracking-tight ${
                profil.totalDendaBelumBayar > 0 ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {formatRupiah(profil.totalDendaBelumBayar)}
            </p>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Denda yang belum dibayar
          </h2>
          <span className="text-sm text-slate-500">
            Total {formatRupiah(profil.totalDendaBelumBayar)}
          </span>
        </div>

        {profil.denda.length === 0 ? (
          <p className="mt-4 text-sm text-emerald-600">
            Tidak ada denda menunggak. Semua bersih!
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {profil.denda.map((d) => (
              <div
                key={d.transaksi_id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
              >
                <div className="flex min-w-[200px] items-center gap-3">
                  <div className="shrink-0">
                    {d.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.cover_url}
                        alt={d.buku}
                        className="h-12 w-9 rounded-md border border-slate-200 object-cover shadow-sm"
                      />
                    ) : (
                      <span className="flex h-12 w-9 items-center justify-center rounded-md bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{d.buku}</p>
                    <p className="text-xs text-slate-500">
                      Kembali {formatTanggal(d.tanggal_kembali)} · terlambat{" "}
                      {d.hariTelat} hari
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-rose-600">
                      {formatRupiah(d.sisa)}
                    </p>
                    <p className="text-xs text-slate-400">
                      dari {formatRupiah(d.denda)}
                    </p>
                  </div>
                  <Button onClick={() => setPaying(d)}>Bayar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Riwayat peminjaman
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-3 font-semibold">Buku</th>
                <th className="pb-2 pr-3 font-semibold">Pinjam</th>
                <th className="pb-2 pr-3 font-semibold">Jatuh Tempo</th>
                <th className="pb-2 pr-3 font-semibold">Kembali</th>
                <th className="pb-2 pr-3 font-semibold">Status</th>
                <th className="pb-2 text-right font-semibold">Denda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profil.riwayat.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-3 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      {t.buku?.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.buku.cover_url}
                          alt={t.buku?.judul ?? "Sampul"}
                          className="h-12 w-9 shrink-0 rounded-md border border-slate-200 object-cover shadow-sm"
                        />
                      ) : (
                        <span className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                          </svg>
                        </span>
                      )}
                      <span>{t.buku?.judul ?? "-"}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-slate-600">
                    {formatTanggal(t.tanggal_pinjam)}
                  </td>
                  <td className="py-3 pr-3 text-slate-600">
                    {formatTanggal(t.tanggal_jatuh_tempo)}
                  </td>
                  <td className="py-3 pr-3 text-slate-600">
                    {formatTanggal(t.tanggal_kembali)}
                  </td>
                  <td className="py-3 pr-3">
                    <Badge tone="pending">{t.status}</Badge>
                  </td>
                  <td className="py-3 text-right text-slate-700">
                    {t.denda > 0 ? formatRupiah(dendaSisa(t)) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <QrisModal
        open={Boolean(paying)}
        onClose={() => setPaying(null)}
        denda={paying}
        onPaid={load}
      />
    </div>
  );
}
