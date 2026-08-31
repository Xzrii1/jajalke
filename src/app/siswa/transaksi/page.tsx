"use client";

import { useCallback, useEffect, useState } from "react";
import { getTransaksiSaya, kembalikanBuku } from "@/app/actions/transaksi";
import { formatRupiah, formatTanggal } from "@/lib/utils";
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
  dipinjam: "aktif",
  dikembalikan: "dikembalikan",
  terlambat: "terlambat",
};

const statusLabel: Record<TransaksiStatus, string> = {
  dipinjam: "Dipinjam",
  dikembalikan: "Dikembalikan",
  terlambat: "Terlambat",
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

  const aktif = transaksi.filter((t) => t.tanggal_kembali === null);
  const jumlahDenda = transaksi.reduce((sum, t) => sum + t.denda, 0);

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
                      <div className="font-medium text-slate-900">
                        {t.buku?.judul ?? "-"}
                      </div>
                      <div className="text-xs text-slate-400">{t.buku?.penulis ?? ""}</div>
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
                          {formatRupiah(t.denda)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {t.tanggal_kembali === null ? (
                        <Button
                          variant="success"
                          onClick={() => handleKembali(t)}
                          disabled={kembalikanId === t.id}
                        >
                          {kembalikanId === t.id ? "Memproses..." : "Kembalikan"}
                        </Button>
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