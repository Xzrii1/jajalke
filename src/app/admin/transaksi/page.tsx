"use client";

import { useCallback, useEffect, useState } from "react";
import { getAnggotaList } from "@/app/actions/anggota";
import { getBukuList } from "@/app/actions/buku";
import {
  createTransaksi,
  deleteTransaksi,
  getTransaksiList,
  setujuiPeminjaman,
  setujuiPengembalian,
  tolakPeminjaman,
  tolakPengembalian,
  updateTransaksi,
} from "@/app/actions/transaksi";
import { formatRupiah, formatTanggal, todayISO, dendaSisa } from "@/lib/utils";
import { cetakStruk } from "@/lib/struk";
import type { ActionResult, Transaksi, TransaksiStatus, User } from "@/lib/types";
import {
  Alert,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  Modal,
  Select,
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
  pending: "Menunggu",
  dipinjam: "Dipinjam",
  dikembalikan: "Dikembalikan",
  terlambat: "Terlambat",
  ditolak: "Ditolak",
  menunggu_kembali: "Menunggu Kembali",
};

interface CreateForm {
  user_id: string;
  buku_id: string;
  tanggal_pinjam: string;
  tanggal_jatuh_tempo: string;
}

interface EditForm {
  tanggal_pinjam: string;
  tanggal_jatuh_tempo: string;
  tanggal_kembali: string;
  denda: string;
}

function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AdminTransaksi() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<ActionResult | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>({
    user_id: "",
    buku_id: "",
    tanggal_pinjam: todayISO(),
    tanggal_jatuh_tempo: addDaysISO(7),
  });
  const [anggotaOptions, setAnggotaOptions] = useState<User[]>([]);
  const [bukuOptions, setBukuOptions] = useState<{ id: string; judul: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [toDelete, setToDelete] = useState<Transaksi | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [approvingKembaliId, setApprovingKembaliId] = useState<string | null>(null);
  const [rejectingKembaliId, setRejectingKembaliId] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Transaksi | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    tanggal_pinjam: todayISO(),
    tanggal_jatuh_tempo: addDaysISO(7),
    tanggal_kembali: "",
    denda: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchList = useCallback(
    () => getTransaksiList({ search, status: statusFilter }),
    [search, statusFilter]
  );

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

  async function openCreate() {
    const [a, b] = await Promise.all([
      getAnggotaList({}),
      getBukuList({}).then((r) => ({ ...r, data: r.data.filter((x) => x.stok > 0) })),
    ]);
    if (a.error) setError(a.error);
    if (b.error) setError(b.error);
    setAnggotaOptions(a.data);
    setBukuOptions(b.data.map((x) => ({ id: x.id, judul: x.judul })));
    setCreateForm({
      user_id: "",
      buku_id: "",
      tanggal_pinjam: todayISO(),
      tanggal_jatuh_tempo: addDaysISO(7),
    });
    setCreateOpen(true);
  }

  async function handleCreate() {
    setSubmitting(true);
    const res = await createTransaksi(createForm);
    setMessage(res);
    setSubmitting(false);
    if (res.success) {
      setCreateOpen(false);
      await refresh();
    }
  }

  async function handleApprove(trx: Transaksi) {
    setApprovingId(trx.id);
    const res = await setujuiPeminjaman(trx.id);
    setMessage(res);
    setApprovingId(null);
    if (res.success) await refresh();
  }

  async function handleReject(trx: Transaksi) {
    setRejectingId(trx.id);
    const res = await tolakPeminjaman(trx.id);
    setMessage(res);
    setRejectingId(null);
    if (res.success) await refresh();
  }

  async function handleApproveKembali(trx: Transaksi) {
    setApprovingKembaliId(trx.id);
    const res = await setujuiPengembalian(trx.id);
    setMessage(res);
    setApprovingKembaliId(null);
    if (res.success) await refresh();
  }

  async function handleRejectKembali(trx: Transaksi) {
    setRejectingKembaliId(trx.id);
    const res = await tolakPengembalian(trx.id);
    setMessage(res);
    setRejectingKembaliId(null);
    if (res.success) await refresh();
  }

  function openEdit(t: Transaksi) {
    setEditing(t);
    setEditForm({
      tanggal_pinjam: t.tanggal_pinjam,
      tanggal_jatuh_tempo: t.tanggal_jatuh_tempo,
      tanggal_kembali: t.tanggal_kembali ?? "",
      denda: t.denda ? String(t.denda) : "",
    });
    setEditOpen(true);
  }

  async function handleEdit() {
    if (!editing) return;
    setEditSubmitting(true);
    const res = await updateTransaksi(editing.id, {
      tanggal_pinjam: editForm.tanggal_pinjam,
      tanggal_jatuh_tempo: editForm.tanggal_jatuh_tempo,
      tanggal_kembali: editForm.tanggal_kembali || null,
      denda: editForm.denda,
    });
    setMessage(res);
    setEditSubmitting(false);
    if (res.success) {
      setEditOpen(false);
      await refresh();
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const res = await deleteTransaksi(toDelete.id);
    setMessage(res);
    setDeleting(false);
    setToDelete(null);
    if (res.success) await refresh();
  }

  return (
    <div className="anim-rise space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">Transaksi Peminjaman</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola seluruh peminjaman dan pengembalian buku.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={openCreate}>+ Buat Transaksi</Button>
        </div>
      </div>

      {message?.error && <Alert kind="error">{message.error}</Alert>}
      {message?.success && <Alert kind="success">{message.success}</Alert>}
      {error && <Alert kind="info">{error}</Alert>}

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Cari nama anggota atau judul buku..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="semua">Semua Status</option>
              <option value="pending">Menunggu Persetujuan</option>
              <option value="aktif">Masih Dipinjam</option>
              <option value="menunggu_kembali">Menunggu Kembali</option>
              <option value="dikembalikan">Sudah Dikembalikan</option>
              <option value="ditolak">Ditolak</option>
            </Select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-3 font-semibold">Anggota</th>
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
                        {t.user?.nama_lengkap ?? "-"}
                      </div>
                      <div className="text-xs text-slate-400">{t.user?.username}</div>
                    </td>
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
                        <span className="font-medium text-slate-900">{t.buku?.judul ?? "-"}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">{formatTanggal(t.tanggal_pinjam)}</td>
                    <td className="py-3 pr-3 text-slate-600">{formatTanggal(t.tanggal_jatuh_tempo)}</td>
                    <td className="py-3 pr-3 text-slate-600">{formatTanggal(t.tanggal_kembali)}</td>
                    <td className="py-3 pr-3">
                      <Badge tone={statusTone[t.status]}>{statusLabel[t.status]}</Badge>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">
                      {dendaSisa(t) > 0 ? formatRupiah(dendaSisa(t)) : "-"}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex flex-wrap justify-end gap-1">
                        {t.status === "pending" && (
                          <>
                            <Button
                              variant="success"
                              className="px-2 py-1 text-xs"
                              onClick={() => handleApprove(t)}
                              disabled={approvingId === t.id || rejectingId === t.id}
                            >
                              {approvingId === t.id ? "..." : "Setujui"}
                            </Button>
                            <Button
                              variant="danger"
                              className="px-2 py-1 text-xs"
                              onClick={() => handleReject(t)}
                              disabled={approvingId === t.id || rejectingId === t.id}
                            >
                              {rejectingId === t.id ? "..." : "Tolak"}
                            </Button>
                          </>
                        )}
                        {t.status === "menunggu_kembali" && (
                          <>
                            <Button
                              variant="success"
                              className="px-2 py-1 text-xs"
                              onClick={() => handleApproveKembali(t)}
                              disabled={approvingKembaliId === t.id || rejectingKembaliId === t.id}
                            >
                              {approvingKembaliId === t.id ? "..." : "Setujui Kembali"}
                            </Button>
                            <Button
                              variant="danger"
                              className="px-2 py-1 text-xs"
                              onClick={() => handleRejectKembali(t)}
                              disabled={approvingKembaliId === t.id || rejectingKembaliId === t.id}
                            >
                              {rejectingKembaliId === t.id ? "..." : "Tolak"}
                            </Button>
                          </>
                        )}
                        {(t.status === "dipinjam" || t.status === "terlambat") && (
                          <Button
                            variant="ghost"
                            className="px-2 py-1 text-xs"
                            onClick={() => cetakStruk(t)}
                          >
                            Struk
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs"
                          onClick={() => openEdit(t)}
                        >
                          Ubah
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                          onClick={() => setToDelete(t)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loading && <Spinner />}
          {!loading && transaksi.length === 0 && (
            <EmptyState
              title="Belum ada transaksi"
              description="Buat transaksi peminjaman baru atau coba ubah filter."
            />
          )}
        </div>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Buat Transaksi Peminjaman"
        wide
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Anggota *">
            <Select
              value={createForm.user_id}
              onChange={(e) => setCreateForm({ ...createForm, user_id: e.target.value })}
            >
              <option value="">-- Pilih anggota --</option>
              {anggotaOptions.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama_lengkap} ({u.username})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Buku *">
            <Select
              value={createForm.buku_id}
              onChange={(e) => setCreateForm({ ...createForm, buku_id: e.target.value })}
            >
              <option value="">-- Pilih buku (stok tersedia) --</option>
              {bukuOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.judul}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tanggal Pinjam *">
            <Input
              type="date"
              value={createForm.tanggal_pinjam}
              onChange={(e) =>
                setCreateForm({ ...createForm, tanggal_pinjam: e.target.value })
              }
            />
          </Field>
          <Field label="Tanggal Jatuh Tempo *">
            <Input
              type="date"
              value={createForm.tanggal_jatuh_tempo}
              onChange={(e) =>
                setCreateForm({ ...createForm, tanggal_jatuh_tempo: e.target.value })
              }
            />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setCreateOpen(false)}>
            Batal
          </Button>
          <Button
            onClick={handleCreate}
            disabled={
              submitting || !createForm.user_id || !createForm.buku_id
            }
          >
            {submitting ? "Menyimpan..." : "Buat Transaksi"}
          </Button>
        </div>
      </Modal>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={
          editing
            ? `Edit Transaksi: ${editing.buku?.judul ?? ""}`
            : "Edit Transaksi"
        }
        wide
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tanggal Pinjam *">
            <Input
              type="date"
              value={editForm.tanggal_pinjam}
              onChange={(e) =>
                setEditForm({ ...editForm, tanggal_pinjam: e.target.value })
              }
            />
          </Field>
          <Field label="Tanggal Jatuh Tempo *">
            <Input
              type="date"
              value={editForm.tanggal_jatuh_tempo}
              onChange={(e) =>
                setEditForm({ ...editForm, tanggal_jatuh_tempo: e.target.value })
              }
            />
          </Field>
          <Field label="Tanggal Kembali (kosongkan jika belum kembali)">
            <Input
              type="date"
              value={editForm.tanggal_kembali}
              onChange={(e) =>
                setEditForm({ ...editForm, tanggal_kembali: e.target.value })
              }
            />
          </Field>
          <Field label="Denda (Rp)">
            <Input
              type="number"
              min={0}
              value={editForm.denda}
              onChange={(e) => setEditForm({ ...editForm, denda: e.target.value })}
              placeholder="0"
            />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleEdit} disabled={editSubmitting}>
            {editSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        pending={deleting}
        title="Hapus Transaksi"
        message={
          <>
            Yakin ingin menghapus transaksi peminjaman{" "}
            <b>{toDelete?.buku?.judul}</b> oleh <b>{toDelete?.user?.nama_lengkap}</b>?
          </>
        }
      />
    </div>
  );
}