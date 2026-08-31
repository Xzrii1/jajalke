"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createAnggota,
  deleteAnggota,
  getAnggotaList,
  updateAnggota,
} from "@/app/actions/anggota";
import type { ActionResult, User } from "@/lib/types";
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
  kelas: string;
  no_induk: string;
  password: string;
}

const emptyForm: FormState = {
  username: "",
  nama_lengkap: "",
  kelas: "",
  no_induk: "",
  password: "",
};

export default function AdminAnggota() {
  const [anggota, setAnggota] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<ActionResult | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [toDelete, setToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = useCallback(() => getAnggotaList({ search }), [search]);

  useEffect(() => {
    let cancelled = false;
    fetchList().then((res) => {
      if (cancelled) return;
      setAnggota(res.data);
      if (res.error) setError(res.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchList]);

  const refresh = useCallback(async () => {
    const res = await fetchList();
    setAnggota(res.data);
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

  function openEdit(u: User) {
    setEditing(u);
    setForm({
      username: u.username,
      nama_lengkap: u.nama_lengkap,
      kelas: u.kelas ?? "",
      no_induk: u.no_induk ?? "",
      password: "",
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    const res = editing
      ? await updateAnggota(editing.id, {
          nama_lengkap: form.nama_lengkap,
          kelas: form.kelas,
          no_induk: form.no_induk,
          password: form.password || undefined,
        })
      : await createAnggota(form);
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
    const res = await deleteAnggota(toDelete.id);
    setMessage(res);
    setDeleting(false);
    setToDelete(null);
    if (res.success) await refresh();
  }

  return (
    <div className="anim-rise space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">Kelola Anggota</h1>
          <p className="mt-1 text-sm text-slate-500">{anggota.length} siswa terdaftar</p>
        </div>
        <Button onClick={openCreate}>+ Tambah Anggota</Button>
      </div>

      {message?.error && <Alert kind="error">{message.error}</Alert>}
      {message?.success && <Alert kind="success">{message.success}</Alert>}
      {error && <Alert kind="info">{error}</Alert>}

      <Card>
        <Input
          placeholder="Cari nama, username, NIS, atau kelas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-3 font-semibold">Nama Lengkap</th>
                <th className="pb-2 pr-3 font-semibold">Username</th>
                <th className="pb-2 pr-3 font-semibold">NIS</th>
                <th className="pb-2 pr-3 font-semibold">Kelas</th>
                <th className="pb-2 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading &&
                anggota.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {u.nama_lengkap}
                        </span>
                        <Badge tone="siswa">siswa</Badge>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">{u.username}</td>
                    <td className="py-3 pr-3 text-slate-600">{u.no_induk ?? "-"}</td>
                    <td className="py-3 pr-3 text-slate-600">{u.kelas ?? "-"}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs"
                          onClick={() => openEdit(u)}
                        >
                          Ubah
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                          onClick={() => setToDelete(u)}
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
          {!loading && anggota.length === 0 && (
            <EmptyState
              title="Belum ada anggota"
              description="Tambahkan anggota baru atau ubah kata kunci pencarian."
            />
          )}
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Ubah Anggota: ${editing.username}` : "Tambah Anggota"}
        wide
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Lengkap *">
            <Input
              value={form.nama_lengkap}
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
              placeholder="Nama lengkap siswa"
            />
          </Field>
          <Field label="NIS">
            <Input
              value={form.no_induk}
              onChange={(e) => setForm({ ...form, no_induk: e.target.value })}
              placeholder="No. induk siswa"
            />
          </Field>
          <Field label="Kelas">
            <Input
              value={form.kelas}
              onChange={(e) => setForm({ ...form, kelas: e.target.value })}
              placeholder="Contoh: X IPA 1"
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
            {submitting ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah Anggota"}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        pending={deleting}
        title="Hapus Anggota"
        message={
          <>
            Yakin ingin menghapus anggota <b>{toDelete?.nama_lengkap}</b>?
            Riwayat transaksi miliknya juga ikut terhapus.
          </>
        }
      />
    </div>
  );
}