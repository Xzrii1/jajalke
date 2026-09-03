"use client";

import { useCallback, useEffect, useState } from "react";
import { getTransaksiSaya, kembalikanBuku } from "@/app/actions/transaksi";
import { formatRupiah, formatTanggal, dendaSisa } from "@/lib/utils";
import { cetakStruk } from "@/lib/struk";
import type { ActionResult, Transaksi, TransaksiStatus } from "@/lib/types";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Spinner,
} from "@/components/ui";

const statusTone: Record<TransaksiStatus, string> = {
  pending: "pending",
  dipinjam: "aktif",
  dikembalikan: "dikembalikan",
  terlambat: "terlambat",
  ditolak: "ditolak",
  menunggu_kembali: "menunggu-kembali",
};

const statusLabel: Record<TransaksiStatus, string> = {
  pending: "Menunggu Persetujuan",
  dipinjam: "Dipinjam",
  dikembalikan: "Dikembalikan",
  terlambat: "Terlambat",
  ditolak: "Ditolak",
  menunggu_kembali: "Menunggu Kembali",
};

export default function SiswaTransaksi() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<ActionResult | null>(null);
  const [kembalikanId, setKembalikanId] = useState<string | null>(null);

  const fetchList = useCallback(() => getTransaksiSaya(), []);

  useEffect(() => {
    let cancelled = false;
    fetchList().then((res) => {
      if (cancelled) return;
      setTransaksi(res.data);
      if (res.error) setError(res.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchList]);

  const refresh = useCallback(async () => {
    const res = await fetchList();
    setTransaksi(res.data);
    if (res.error) setError(res.error);
  }, [fetchList]);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(t);
    }
  }, [message]);

  async function handleKembali(trx: Transaksi) {
    setKembalikanId(trx.id);
    const res = await kembalikanBuku(trx.id);
    setMessage(res);
    setKembalikanId(null);
    await refresh();
  }

  const aktif = transaksi.filter(
    (t) =>
      t.tanggal_kembali === null &&
      t.status !== "pending" &&
      t.status !== "ditolak" &&
      t.status !== "menunggu_kembali"
  );
  const jumlahDenda = transaksi.reduce((sum, t) => sum + dendaSisa(t), 0);

  return (
    <div className="anim-rise space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">Peminjaman Saya</h1>
          <p className="mt-1 text-sm text-slate-500">
            {aktif.length} buku sedang dipinjam · total denda {formatRupiah(jumlahDenda)}
          </p>
        </div>
      </div>

      {message?.error && <Alert kind="error">{message.error}</Alert>}
      {message?.success && <Alert kind="success">{message.success}</Alert>}
      {error && <Alert kind="info">{error}</Alert>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-3 font-semibold">Buku</th>
                <th className="pb-2 pr-3 font-semibold">Tgl Pinjam</th>
                <th className="pb-2 pr-3 font-semibold">Jatuh Tempo</th>
                <th className="pb-2 pr-3 font-semibold">Tgl Kembali</th>
                <th className="pb-2 pr-3 font-semibold">Status</th>
                <th className="pb-2 pr-3 font-semibold">Denda</th>
                <th className="pb-2 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading &&
                transaksi.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        {t.buku?.cover_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={t.buku.cover_url}
                            alt={t.buku?.judul ?? "Sampul"}
                            className="h-14 w-10 shrink-0 rounded-md border border-slate-200 object-cover shadow-sm"
                          />
                        ) : (
                          <span className="flex h-14 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                            </svg>
                          </span>
                        )}
                        <div className="font-medium text-slate-900">
                          {t.buku?.judul ?? "-"}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-slate-400">{t.buku?.penulis ?? ""}</div>
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
                      <Badge tone={statusTone[t.status]}>{statusLabel[t.status]}</Badge>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">
                      {t.denda > 0 ? (
                        <span className="font-medium text-rose-600">
                          {formatRupiah(dendaSisa(t))}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {t.status === "menunggu_kembali" ? (
                        <span className="text-xs text-orange-600">Menunggu</span>
                      ) : t.tanggal_kembali === null &&
                        (t.status === "dipinjam" || t.status === "terlambat") ? (
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" onClick={() => cetakStruk(t)}>
                            Struk
                          </Button>
                          <Button
                            variant="success"
                            onClick={() => handleKembali(t)}
                            disabled={kembalikanId === t.id}
                          >
                            {kembalikanId === t.id ? "Mengajukan..." : "Ajukan Kembali"}
                          </Button>
                        </div>
                      ) : t.status === "pending" ? (
                        <span className="text-xs text-amber-600">Menunggu</span>
                      ) : t.status === "ditolak" ? (
                        <span className="text-xs text-slate-400">Ditolak</span>
                      ) : (
                        <span className="text-xs text-slate-400">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loading && <Spinner />}
          {!loading && transaksi.length === 0 && (
            <EmptyState
              title="Belum ada peminjaman"
              description="Kunjungi menu Cari Buku untuk meminjam buku pertama kamu."
            />
          )}
        </div>
      </Card>
    </div>
  );
}