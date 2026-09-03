"use client";

import { useCallback, useEffect, useState } from "react";
import {
  JENIS_BANTUAN_OPTIONS,
  STATUS_BANTUAN_LABEL,
  STATUS_BANTUAN_TONE,
  getPermintaanBantuanList,
  tanggapiPermintaanBantuan,
} from "@/app/actions/bantuan";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Modal,
  Select,
  Spinner,
  Textarea,
} from "@/components/ui";
import { formatTanggal } from "@/lib/utils";
import type { PermintaanBantuan, StatusBantuan } from "@/lib/types";

const jenisLabel = (j: PermintaanBantuan["jenis"]) =>
  JENIS_BANTUAN_OPTIONS.find((o) => o.value === j)?.label ?? j;

export default function AdminBantuanClient() {
  const [permintaan, setPermintaan] = useState<PermintaanBantuan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<string>("semua");

  const [editing, setEditing] = useState<PermintaanBantuan | null>(null);
  const [editStatus, setEditStatus] = useState<StatusBantuan>("baru");
  const [editBalasan, setEditBalasan] = useState("");
  const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await getPermintaanBantuanList();
    if (res.error) setError(res.error);
    else setPermintaan(res.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getPermintaanBantuanList().then((res) => {
      if (cancelled) return;
      if (res.error) setError(res.error);
      else setPermintaan(res.data ?? []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function openEdit(p: PermintaanBantuan) {
    setEditing(p);
    setEditStatus(p.status);
    setEditBalasan(p.balasan ?? "");
    setMessage(null);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    const res = await tanggapiPermintaanBantuan(editing.id, {
      status: editStatus,
      balasan: editBalasan,
    });
    setMessage(res);
    setSaving(false);
    if (res.success) {
      setEditing(null);
      await load();
    }
  }

  const filtered =
    filter === "semua"
      ? permintaan
      : permintaan.filter((p) => p.status === filter);

  const counts = permintaan.reduce<Record<string, number>>(
    (acc, p) => ((acc[p.status] = (acc[p.status] ?? 0) + 1), acc),
    { baru: 0, diproses: 0, selesai: 0 }
  );

  return (
    <div className="anim-rise space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            Pusat Bantuan
          </h1>
          <p className="mt-1 text-slate-500">
            Kelola permintaan bantuan dari pengguna (reset password, pertanyaan,
            keluhan).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["semua", "baru", "diproses", "selesai"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "semua" ? "Semua" : STATUS_BANTUAN_LABEL[f]}
              {f !== "semua" && counts[f] > 0 ? ` (${counts[f]})` : ""}
            </button>
          ))}
        </div>
      </div>

      {error && <Alert kind="error">{error}</Alert>}
      {message?.success && <Alert kind="success">{message.success}</Alert>}

      <Card>
        {loading ? (
          <Spinner label="Memuat permintaan..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Tidak ada permintaan"
            description="Belum ada permintaan bantuan dari pengguna."
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{p.subjek}</p>
                    <p className="text-xs text-slate-400">
                      {jenisLabel(p.jenis)} · {formatTanggal(p.created_at)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Dari: <b>{p.user?.nama_lengkap}</b> (@{p.user?.username})
                      {p.user?.kelas ? ` · Kelas ${p.user.kelas}` : ""} ·{" "}
                      {p.user?.role}
                    </p>
                  </div>
                  <Badge tone={STATUS_BANTUAN_TONE[p.status]}>
                    {STATUS_BANTUAN_LABEL[p.status]}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {p.pesan}
                </p>
                {p.balasan && (
                  <div className="mt-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">
                    <span className="font-semibold">Balasan:</span> {p.balasan}
                  </div>
                )}
                <div className="mt-3">
                  <Button variant="secondary" onClick={() => openEdit(p)}>
                    Tanggapi / Ubah Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Tanggapi Permintaan"
        wide
      >
        {editing && (
          <div className="space-y-4">
            {message?.error && <Alert kind="error">{message.error}</Alert>}
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <p>
                <b>Pengguna:</b> {editing.user?.nama_lengkap} (@
                {editing.user?.username}) · {editing.user?.role}
              </p>
              <p className="mt-1">
                <b>Subjek:</b> {editing.subjek}
              </p>
              <p className="mt-1">{editing.pesan}</p>
            </div>

            <Field label="Status">
              <Select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as StatusBantuan)}
              >
                {(["baru", "diproses", "selesai"] as const).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_BANTUAN_LABEL[s]}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Balasan (opsional)">
              <Textarea
                rows={4}
                value={editBalasan}
                onChange={(e) => setEditBalasan(e.target.value)}
                placeholder="Tulis balasan untuk pengguna. Untuk permintaan reset password, sertakan username baru / instruksi."
                maxLength={1000}
              />
            </Field>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setEditing(null)}
                disabled={saving}
              >
                Batal
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
