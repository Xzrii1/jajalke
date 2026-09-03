"use client";

import { useCallback, useEffect, useState } from "react";
import { getDendaBelumBayar, type ProfilDenda } from "@/app/actions/profil";
import { Button, Card, Modal } from "@/components/ui";
import { QrisModal } from "@/components/qris-modal";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export function DendaReminder() {
  const [denda, setDenda] = useState<ProfilDenda[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState<ProfilDenda | null>(null);

  const load = useCallback(async () => {
    const res = await getDendaBelumBayar();
    if (res.data) {
      setDenda(res.data.denda);
      setTotal(res.data.total);
      setOpen(res.data.denda.length > 0);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getDendaBelumBayar().then((res) => {
      if (cancelled) return;
      if (res.data) {
        setDenda(res.data.denda);
        setTotal(res.data.total);
        setOpen(res.data.denda.length > 0);
      }
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || denda.length === 0) return null;

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} title="">
        <div className="flex flex-col items-center pt-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <svg className="h-9 w-9 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Kamu punya denda belum dibayar!
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Terdapat {denda.length} transaksi denda dengan total{" "}
            <b className="font-semibold text-rose-600">{formatRupiah(total)}</b>.
            Segera bayar agar akun tetap aktif.
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          {denda.map((d) => (
            <Card key={d.transaksi_id} className="!p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="shrink-0">
                    {d.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.cover_url}
                        alt={d.buku}
                        className="h-11 w-8 rounded border border-slate-200 object-cover shadow-sm"
                      />
                    ) : (
                      <span className="flex h-11 w-8 items-center justify-center rounded bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{d.buku}</p>
                    <p className="text-xs text-slate-500">
                      Kembali {formatTanggal(d.tanggal_kembali)} · terlambat {d.hariTelat} hari
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPaying(d)}
                  className="shrink-0 rounded-full bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
                >
                  Bayar {formatRupiah(d.sisa)}
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Nanti
          </Button>
          {denda.length === 1 && (
            <Button onClick={() => setPaying(denda[0])}>Bayar Sekarang</Button>
          )}
        </div>
      </Modal>

      <QrisModal
        open={Boolean(paying)}
        onClose={() => setPaying(null)}
        denda={paying}
        onPaid={load}
      />
    </>
  );
}