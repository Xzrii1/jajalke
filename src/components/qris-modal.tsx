"use client";

import { useState } from "react";
import { bayarDenda } from "@/app/actions/profil";
import type { ProfilDenda } from "@/app/actions/profil";
import { Alert, Button, Modal } from "@/components/ui";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export function QrisModal({
  open,
  onClose,
  denda,
  onPaid,
}: {
  open: boolean;
  onClose: () => void;
  denda: ProfilDenda | null;
  onPaid: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleBayar() {
    if (!denda) return;
    setSaving(true);
    setMessage(null);
    const res = await bayarDenda(denda.transaksi_id);
    setMessage(res.success ? null : (res.error ?? null));
    setSaving(false);
    if (res.success) {
      onPaid();
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Bayar Denda (QRIS Demo)">
      {denda && (
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Buku</span>
              <span className="font-semibold text-slate-800">{denda.buku}</span>
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="text-slate-500">Kembali</span>
              <span className="text-slate-700">{formatTanggal(denda.tanggal_kembali)}</span>
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="text-slate-500">Keterlambatan</span>
              <span className="text-slate-700">{denda.hariTelat} hari</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-2">
              <span className="font-medium text-slate-700">Total Bayar</span>
              <span className="text-lg font-semibold text-rose-600">
                {formatRupiah(denda.sisa)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-5">
            <svg className="h-36 w-36 rounded-lg bg-white" viewBox="0 0 120 120" shapeRendering="crispEdges">
              <rect width="120" height="120" fill="#fff" />
              <g fill="#111827">
                <rect x="10" y="10" width="8" height="8" />
                <rect x="18" y="10" width="8" height="8" />
                <rect x="26" y="10" width="8" height="8" />
                <rect x="10" y="18" width="8" height="8" />
                <rect x="26" y="18" width="8" height="8" />
                <rect x="10" y="26" width="8" height="8" />
                <rect x="18" y="26" width="8" height="8" />
                <rect x="26" y="26" width="8" height="8" />

                <rect x="86" y="10" width="8" height="8" />
                <rect x="94" y="10" width="8" height="8" />
                <rect x="102" y="10" width="8" height="8" />
                <rect x="102" y="18" width="8" height="8" />
                <rect x="86" y="18" width="8" height="8" />
                <rect x="94" y="26" width="8" height="8" />
                <rect x="86" y="26" width="8" height="8" />
                <rect x="102" y="26" width="8" height="8" />

                <rect x="10" y="86" width="8" height="8" />
                <rect x="18" y="86" width="8" height="8" />
                <rect x="26" y="86" width="8" height="8" />
                <rect x="10" y="94" width="8" height="8" />
                <rect x="26" y="94" width="8" height="8" />
                <rect x="10" y="102" width="8" height="8" />
                <rect x="18" y="102" width="8" height="8" />
                <rect x="26" y="102" width="8" height="8" />

                <rect x="42" y="14" width="6" height="6" />
                <rect x="58" y="22" width="6" height="6" />
                <rect x="38" y="34" width="6" height="6" />
                <rect x="54" y="42" width="6" height="6" />
                <rect x="70" y="50" width="6" height="6" />
                <rect x="44" y="58" width="6" height="6" />
                <rect x="62" y="66" width="6" height="6" />
                <rect x="78" y="40" width="6" height="6" />
                <rect x="50" y="76" width="6" height="6" />
                <rect x="66" y="84" width="6" height="6" />
                <rect x="42" y="92" width="6" height="6" />
                <rect x="58" y="100" width="6" height="6" />
              </g>
            </svg>
            <p className="mt-3 text-sm font-medium text-slate-700">
              Scan untuk membayar (demo)
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Ini QRIS fiktif untuk keperluan demo — tidak ada pembayaran nyata.
            </p>
          </div>

          {message && <Alert kind="error">{message}</Alert>}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Batal
            </Button>
            <Button onClick={handleBayar} disabled={saving}>
              {saving ? "Memproses..." : "Saya Sudah Bayar"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}