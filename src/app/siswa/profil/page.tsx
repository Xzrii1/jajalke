"use client";

import { useCallback, useEffect, useState } from "react";
import {
  bayarDenda,
  getSiswaProfil,
  type ProfilDenda,
  type SiswaProfil,
} from "@/app/actions/profil";
import {
  Alert,
  Badge,
  Button,
  Card,
  Modal,
  Spinner,
} from "@/components/ui";
import { formatRupiah, formatTanggal, dendaSisa } from "@/lib/utils";

function QrisModal({
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
                <div className="min-w-[200px]">
                  <p className="font-semibold text-slate-800">{d.buku}</p>
                  <p className="text-xs text-slate-500">
                    Kembali {formatTanggal(d.tanggal_kembali)} · terlambat{" "}
                    {d.hariTelat} hari
                  </p>
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
                    {t.buku?.judul ?? "-"}
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
