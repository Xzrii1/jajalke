"use client";

import { useCallback, useEffect, useState } from "react";
import {
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

const statusOptions: StatusBantuan[] = ["baru", "diproses", "selesai"];

function RoleBadge({ role }: { role: "admin" | "petugas" | "siswa" }) {
  const tone =
    role === "admin" ? "aktif" : role === "petugas" ? "pending" : "tersedia";
  return <Badge tone={tone}>{role}</Badge>;
}

export default function AdminBantuanClient() {
  const [data, setData] = useState<PermintaanBantuan[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);

  const [replying, setReplying] = useState<PermintaanBantuan | null>(null);
  const [statusVal, setStatusVal] = useState<StatusBantuan>("baru");
  const [balasan, setBalasan] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const res = await getPermintaanBantuanList();
    if (res.error) setError(res.error);
    else setData(res.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getPermintaanBantuanList().then((res) => {
      if (cancelled) return;
      if (res.error) setError(res.error);
      else setData(res.data ?? []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(t);
    }
  }, [message]);

  function openReply(p: PermintaanBantuan) {
    setReplying(p);
    setStatusVal(p.status);
    setBalasan(p.balasan ?? "");
  }

  async function handleSave() {
    if (!replying) return;
    setSaving(true);
    const res = await tanggapiPermintaanBantuan(replying.id, {
      status: statusVal,
      balasan,
    });
    setSaving(false);
    setMessage(res);
    if (res.success) {
      setReplying(null);
      await fetchList();
    }
  }

  const filtered =
    filter === "" ? data : data.filter((p) => p.status === filter);

  return (
    <div className="anim-rise space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            Kelola Permintaan Bantuan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {data.length} permintaan masuk dari pengguna
          </p>
        </div>
      </div>

      {message?.error && <Alert kind="error">{message.error}</Alert>}
      {message?.success && <Alert kind="success">{message.success}</Alert>}
      {error && <Alert kind="info">{error}</Alert>}

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          {(["", ...statusOptions] as ("" | StatusBantuan)[]).map((s) => (
            <Button
              key={s || "all"}
              variant={filter === s ? "primary" : "secondary"}
              className="px-3 py-1.5 text-xs"
              onClick={() => setFilter(s)}
            >
              {s === "" ? "Semua" : STATUS_BANTUAN_LABEL[s]}
            </Button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {!loading &&
            filtered.length === 0 && (
              <EmptyState
                title="Tidak ada permintaan"
                description="Belum ada permintaan bantuan dengan status ini."
              />
            )}

          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800">{p.subjek}</p>
                  <p className="text-xs text-slate-400">
                    {p.jenis.replace("_", " ").toUpperCase()} ·{" "}
                    {formatTanggal(p.created_at)}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-medium text-slate-600">
                      {p.user?.nama_lengkap ?? "Pengguna"}
                    </span>
                    {p.user && <RoleBadge role={p.user.role} />}
                    {p.user?.username && (
                      <span className="text-slate-400">@{p.user.username}</span>
                    )}
                    {p.user?.kelas && (
                      <span className="text-slate-400">{p.user.kelas}</span>
                    )}
                  </div>
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

              <div className="mt-3 flex justify-end">
                <Button
                  variant="secondary"
                  className="px-3 py-1.5 text-xs"
                  onClick={() => openReply(p)}
                >
                  Tanggapi
                </Button>
              </div>
            </div>
          ))}
          {loading && <Spinner />}
        </div>
      </Card>

      <Modal
        open={Boolean(replying)}
        onClose={() => setReplying(null)}
        title="Tanggapi Permintaan"
      >
        {replying && (
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-slate-800">{replying.subjek}</p>
              <p className="mt-1 text-sm text-slate-500">{replying.pesan}</p>
            </div>
            <Field label="Status">
              <Select
                value={statusVal}
                onChange={(e) => setStatusVal(e.target.value as StatusBantuan)}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_BANTUAN_LABEL[s]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Balasan">
              <Textarea
                rows={4}
                value={balasan}
                onChange={(e) => setBalasan(e.target.value)}
                placeholder="Tulis balasan untuk pengguna"
                maxLength={1000}
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setReplying(null)}>
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
