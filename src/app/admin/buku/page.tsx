"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createBuku,
  deleteBuku,
  getBukuList,
  getKategoriList,
  updateBuku,
} from "@/app/actions/buku";
import type { ActionResult, Buku } from "@/lib/types";
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
  Textarea,
} from "@/components/ui";

interface FormState {
  judul: string;
  penulis: string;
  penerbit: string;
  tahun_terbit: string;
  isbn: string;
  kategori: string;
  stok: string;
  deskripsi: string;
  cover_url: string;
}

const emptyForm: FormState = {
  judul: "",
  penulis: "",
  penerbit: "",
  tahun_terbit: "",
  isbn: "",
  kategori: "",
  stok: "0",
  deskripsi: "",
  cover_url: "",
};

export default function AdminBuku() {
  const [buku, setBuku] = useState<Buku[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<ActionResult | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Buku | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [toDelete, setToDelete] = useState<Buku | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = useCallback(
    () => getBukuList({ search, kategori: kategoriFilter || undefined }),
    [search, kategoriFilter]
  );

  useEffect(() => {
    let cancelled = false;
    fetchList().then((res) => {
      if (cancelled) return;
      setBuku(res.data);
      if (res.error) setError(res.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchList]);

  const refresh = useCallback(async () => {
    const res = await fetchList();
    setBuku(res.data);
    if (res.error) setError(res.error);
  }, [fetchList]);

  useEffect(() => {
    getKategoriList().then(setKategoriOptions);
  }, []);

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

  function openEdit(b: Buku) {
    setEditing(b);
    setForm({
      judul: b.judul,
      penulis: b.penulis ?? "",
      penerbit: b.penerbit ?? "",
      tahun_terbit: b.tahun_terbit ? String(b.tahun_terbit) : "",
      isbn: b.isbn ?? "",
      kategori: b.kategori ?? "",
      stok: String(b.stok),
      deskripsi: b.deskripsi ?? "",
      cover_url: b.cover_url ?? "",
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    const res = editing
      ? await updateBuku(editing.id, form)
      : await createBuku(form);
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
    const res = await deleteBuku(toDelete.id);
    setMessage(res);
    setDeleting(false);
    setToDelete(null);
    if (res.success) await refresh();
  }

  const totalJudul = buku.length;
  const totalStok = buku.reduce((sum, b) => sum + b.stok, 0);

  return (
    <div className="anim-rise space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">Kelola Data Buku</h1>
          <p className="mt-1 text-sm text-slate-500">
            {totalJudul} judul · {totalStok} eksemplar tersedia
          </p>
        </div>
        <Button onClick={openCreate}>+ Tambah Buku</Button>
      </div>

      {message?.error && <Alert kind="error">{message.error}</Alert>}
      {message?.success && <Alert kind="success">{message.success}</Alert>}
      {error && <Alert kind="info">{error}</Alert>}

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Cari judul, penulis, kategori, atau ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sm:w-56">
            <Select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {kategoriOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Select>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setSearch("");
              setKategoriFilter("");
            }}
          >
            Reset
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-3 font-semibold">Sampul</th>
                <th className="pb-2 pr-3 font-semibold">Judul</th>
                <th className="pb-2 pr-3 font-semibold">Penulis</th>
                <th className="pb-2 pr-3 font-semibold">Kategori</th>
                <th className="pb-2 pr-3 font-semibold">Tahun</th>
                <th className="pb-2 pr-3 font-semibold">Stok</th>
                <th className="pb-2 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading &&
                buku.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-3">
                      {b.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.cover_url}
                          alt={b.judul}
                          className="h-14 w-10 rounded object-cover shadow-sm"
                        />
                      ) : (
                        <span className="flex h-14 w-10 items-center justify-center rounded bg-slate-100 text-xs text-slate-300">
                          -
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-medium text-slate-900">{b.judul}</div>
                      {b.isbn && (
                        <div className="text-xs text-slate-400">ISBN {b.isbn}</div>
                      )}
                    </td>
                    <td className="py-3 pr-3 text-slate-600">{b.penulis ?? "-"}</td>
                    <td className="py-3 pr-3">
                      {b.kategori ? <Badge tone="aktif">{b.kategori}</Badge> : "-"}
                    </td>
                    <td className="py-3 pr-3 text-slate-600">{b.tahun_terbit ?? "-"}</td>
                    <td className="py-3 pr-3">
                      {b.stok > 0 ? (
                        <Badge tone="tersedia">{b.stok} tersedia</Badge>
                      ) : (
                        <Badge tone="habis">Habis</Badge>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs"
                          onClick={() => openEdit(b)}
                        >
                          Ubah
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                          onClick={() => setToDelete(b)}
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
          {!loading && buku.length === 0 && (
            <EmptyState
              title="Belum ada buku ditemukan"
              description="Coba ubah kata kunci pencarian atau tambahkan buku baru."
            />
          )}
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Ubah Data Buku" : "Tambah Buku Baru"}
        wide
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Judul *">
              <Input
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                placeholder="Judul buku"
              />
            </Field>
          </div>
          <Field label="Penulis">
            <Input
              value={form.penulis}
              onChange={(e) => setForm({ ...form, penulis: e.target.value })}
              placeholder="Nama penulis"
            />
          </Field>
          <Field label="Penerbit">
            <Input
              value={form.penerbit}
              onChange={(e) => setForm({ ...form, penerbit: e.target.value })}
              placeholder="Nama penerbit"
            />
          </Field>
          <Field label="Tahun Terbit">
            <Input
              value={form.tahun_terbit}
              onChange={(e) => setForm({ ...form, tahun_terbit: e.target.value })}
              placeholder="2020"
              inputMode="numeric"
            />
          </Field>
          <Field label="ISBN">
            <Input
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
              placeholder="ISBN"
            />
          </Field>
          <Field label="Kategori">
            <Input
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              placeholder="Contoh: Fiksi, Pelajaran"
              list="kategori-list"
            />
            <datalist id="kategori-list">
              {kategoriOptions.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          </Field>
          <Field label="Stok *">
            <Input
              value={form.stok}
              onChange={(e) => setForm({ ...form, stok: e.target.value })}
              type="number"
              min={0}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Deskripsi">
              <Textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                rows={3}
                placeholder="Deskripsi singkat buku"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Foto Sampul (URL)">
              <Input
                value={form.cover_url}
                onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                placeholder="https://.../sampul.jpg"
              />
            </Field>
            {form.cover_url && (
              <div className="mt-2 flex items-center gap-3 rounded-lg bg-slate-50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.cover_url}
                  alt="Pratinjau sampul"
                  className="h-20 w-14 rounded object-cover shadow-sm"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
                  }}
                />
                <span className="text-xs text-slate-400">
                  Pratinjau sampul buku. Kosongkan jika belum ada.
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !form.judul.trim()}>
            {submitting ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah Buku"}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        pending={deleting}
        title="Hapus Buku"
        message={
          <>
            Yakin ingin menghapus buku{" "}
            <b>{toDelete?.judul}</b>? Riwayat transaksi terkait juga ikut terhapus.
          </>
        }
      />
    </div>
  );
}