"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createPetugas,
  deletePetugas,
  getStafList,
  updatePetugas,
  type Staf,
} from "@/app/actions/petugas";
import type { ActionResult } from "@/lib/types";
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
  Spinner,
} from "@/components/ui";

interface FormState {
  username: string;
  nama_lengkap: string;
  password: string;
}

const emptyForm: FormState = {
  username: "",
  nama_lengkap: "",
  password: "",
};

export default function AdminPetugas() {
  const [staf, setStaf] = useState<Staf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<ActionResult | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Staf | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [toDelete, setToDelete] = useState<Staf | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = useCallback(() => getStafList(), []);

  useEffect(() => {
    let cancelled = false;
    fetchList().then((res) => {
      if (cancelled) return;
      setStaf(res.data);
      if (res.error) setError(res.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchList]);

  const refresh = useCallback(async () => {
    const res = await fetchList();
    setStaf(res.data);
    if (res.error) setError(res.error);
  }, [fetchList]);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(t);
    }
  }, [message]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(s: Staf) {
    setEditing(s);
    setForm({
      username: s.username,
      nama_lengkap: s.nama_lengkap,
      password: "",
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    const res = editing
      ? await updatePetugas(editing.id, {
          nama_lengkap: form.nama_lengkap,
          password: form.password || undefined,
        })
      : await createPetugas(form);
    setMessage(res);
    setSubmitting(false);
    if (res.success) {
      setModalOpen(false);
      await refresh();
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const res = await deletePetugas(toDelete.id);
    setMessage(res);
    setDeleting(false);
    setToDelete(null);
    if (res.success) await refresh();
  }

  const jumlahPetugas = staf.filter((s) => s.role === "petugas").length;

  return (
    <div className="anim-rise space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            Kelola Petugas
          </h1>
          <p className="mt-1 text-sm text-slate-500">{jumlahPetugas} akun petugas terdaftar</p>
        </div>
        <Button onClick={openCreate}>+ Tambah Petugas</Button>
      </div>

      {message?.error && <Alert kind="error">{message.error}</Alert>}
      {message?.success && <Alert kind="success">{message.success}</Alert>}
      {error && <Alert kind="info">{error}</Alert>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-3 font-semibold">Nama Lengkap</th>
                <th className="pb-2 pr-3 font-semibold">Username</th>
                <th className="pb-2 pr-3 font-semibold">Role</th>
                <th className="pb-2 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading &&
                staf.map((s) => {
                  const isPetugas = s.role === "petugas";
                  return (
                    <tr key={s.id} className={isPetugas ? "hover:bg-slate-50" : ""}>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">
                            {s.nama_lengkap}
                          </span>
                          {isPetugas ? (
                            <Badge tone="petugas">petugas</Badge>
                          ) : (
                            <Badge tone="admin">admin</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-slate-600">{s.username}</td>
                      <td className="py-3 pr-3 text-slate-600">
                        {isPetugas ? (
                          "Akses kelola buku & transaksi"
                        ) : (
                          <span className="text-slate-400">Tidak dapat dikelola di sini</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {isPetugas ? (
                          <div className="inline-flex gap-1">
                            <Button
                              variant="ghost"
                              className="px-2 py-1 text-xs"
                              onClick={() => openEdit(s)}
                            >
                              Ubah
                            </Button>
                            <Button
                              variant="ghost"
                              className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                              onClick={() => setToDelete(s)}
                            >
                              Hapus
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {loading && <Spinner />}
          {!loading && staf.length === 0 && (
            <EmptyState
              title="Belum ada akun petugas"
              description="Tambahkan petugas agar bisa mengelola buku dan transaksi."
            />
          )}
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Ubah Petugas: ${editing.username}` : "Tambah Petugas"}
        wide
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Lengkap *">
            <Input
              value={form.nama_lengkap}
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
              placeholder="Nama lengkap petugas"
            />
          </Field>
          <Field label="Username *">
            <Input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username untuk login"
              disabled={Boolean(editing)}
            />
          </Field>
          {editing ? (
            <div className="sm:col-span-2">
              <Field label="Reset Password (kosongkan jika tidak diubah)">
                <Input
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  type="password"
                  placeholder="Password baru (min. 6 karakter)"
                />
              </Field>
            </div>
          ) : (
            <Field label="Password *">
              <Input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                type="password"
                placeholder="Min. 6 karakter"
              />
            </Field>
          )}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !form.nama_lengkap.trim() || !form.username.trim()}
          >
            {submitting ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah Petugas"}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        pending={deleting}
        title="Hapus Petugas"
        message={
          <>
            Yakin ingin menghapus petugas <b>{toDelete?.nama_lengkap}</b>?
            Akun ini tidak bisa login lagi setelah dihapus.
          </>
        }
      />
    </div>
  );
}