"use client";

import { useCallback, useEffect, useState } from "react";
import {
  JENIS_BANTUAN_OPTIONS,
  STATUS_BANTUAN_LABEL,
  STATUS_BANTUAN_TONE,
  getPermintaanSaya,
  kirimPermintaanBantuan,
} from "@/app/actions/bantuan";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Select,
  Spinner,
  Textarea,
} from "@/components/ui";
import { formatTanggal } from "@/lib/utils";
import type { JenisBantuan, PermintaanBantuan } from "@/lib/types";

const faq = [
  {
    q: "Bagaimana cara meminjam buku?",
    a: "Buka menu Cari Buku, pilih judul yang kamu inginkan, tentukan lama pinjam (maks. 30 hari), lalu klik Ajukan. Permintaanmu akan menunggu persetujuan petugas.",
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
  {
    q: "Bagaimana cara mengganti / reset password?",
    a: "Kirim permintaan lewat form di halaman ini dengan jenis 'Reset / Ganti Password'. Petugas/admin akan mereset kata sandi akunmu dan membalas lewat balasan permintaan.",
    tone: "bg-rose-50 text-rose-700 ring-rose-100",
  },
  {
    q: "Kenapa pengajuan peminjaman saya ditolak?",
    a: "Pengajuan bisa ditolak jika stok buku habis, kamu sudah meminjam judul yang sama, atau durasi pinjam melebihi ketentuan. Periksa status pengajuan di Peminjaman Saya.",
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  {
    q: "Bagaimana aturan denda keterlambatan?",
    a: "Denda dihitung otomatis per hari keterlambatan sejak lewat tanggal jatuh tempo sampai buku dikembalikan, sesuai tarif yang berlaku di pengaturan perpustakaan.",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    q: "Bagaimana saya tahu batas waktu meminjam?",
    a: "Ada pengingat denda di dashboard, dan kamu bisa memantau batas waktu di menu Peminjaman Saya serta Profil Saya kapan saja.",
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
  },
];

export default function BantuanClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [jenis, setJenis] = useState<JenisBantuan>("reset_password");
  const [subjek, setSubjek] = useState("");
  const [pesan, setPesan] = useState("");
  const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [riwayat, setRiwayat] = useState<PermintaanBantuan[]>([]);
  const [riwayatError, setRiwayatError] = useState<string | null>(null);
  const [riwayatLoading, setRiwayatLoading] = useState(Boolean(isLoggedIn));

  const load = useCallback(async () => {
    if (!isLoggedIn) return;
    const res = await getPermintaanSaya();
    if (res.error) setRiwayatError(res.error);
    else setRiwayat(res.data ?? []);
    setRiwayatLoading(false);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    getPermintaanSaya().then((res) => {
      if (cancelled) return;
      if (res.error) setRiwayatError(res.error);
      else setRiwayat(res.data ?? []);
      setRiwayatLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  async function handleSubmit() {
    setSubmitting(true);
    setMessage(null);
    const res = await kirimPermintaanBantuan({ jenis, subjek, pesan });
    setSubmitting(false);
    setMessage(res);
    if (res.success) {
      setSubjek("");
      setPesan("");
      await load();
    }
  }

  return (
    <div className="anim-rise space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
          Pusat Bantuan
        </h1>
        <p className="mt-1 text-slate-500">
          Butuh bantuan memakai aplikasi atau mengganti password? Temukan jawaban
          di bawah atau kirim permintaan ke tim perpustakaan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pertanyaan yang sering diajukan
          </h2>
          <div className="mt-4 space-y-3">
            {faq.map((f) => (
              <div
                key={f.q}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
              >
                <p className="font-semibold text-slate-800">{f.q}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{f.a}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Kirim permintaan bantuan
            </h2>
            {!isLoggedIn ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-600">
                  Kamu perlu masuk terlebih dahulu untuk mengirim permintaan
                  bantuan ke tim perpustakaan.
                </p>
                <a
                  href="/login?next=/bantuan"
                  className="mt-3 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Masuk untuk melanjutkan
                </a>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {message?.error && <Alert kind="error">{message.error}</Alert>}
                {message?.success && <Alert kind="success">{message.success}</Alert>}

                <Field label="Jenis permintaan" htmlFor="jenis">
                  <Select
                    id="jenis"
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value as JenisBantuan)}
                  >
                    {JENIS_BANTUAN_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Subjek" htmlFor="subjek">
                  <Input
                    id="subjek"
                    value={subjek}
                    onChange={(e) => setSubjek(e.target.value)}
                    placeholder={jenis === "reset_password" ? "Contoh: Lupa password akun siswa" : "Ringkasan singkat masalah"}
                    maxLength={120}
                  />
                </Field>

                <Field label="Pesan" htmlFor="pesan">
                  <Textarea
                    id="pesan"
                    rows={4}
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    placeholder={
                      jenis === "reset_password"
                        ? "Jelaskan username/akun yang lupa password beserta kelas/NIS jika ada."
                        : "Jelaskan masalah atau pertanyaanmu secara detail."
                    }
                    maxLength={1000}
                  />
                </Field>

                <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                  {submitting ? "Mengirim..." : "Kirim Permintaan"}
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Riwayat permintaan saya
            </h2>
            {!isLoggedIn ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-600">
                  Masuk untuk melihat dan mengirim permintaan bantuan.
                </p>
                <a
                  href="/login?next=/bantuan"
                  className="mt-3 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Masuk ke akun
                </a>
              </div>
            ) : riwayatLoading ? (
              <Spinner label="Memuat..." />
            ) : riwayatError ? (
              <p className="mt-4 text-sm text-rose-600">{riwayatError}</p>
            ) : riwayat.length === 0 ? (
              <EmptyState
                title="Belum ada permintaan"
                description="Permintaan bantuan yang kamu kirim akan tampil di sini."
              />
            ) : (
              <div className="mt-4 space-y-3">
                {riwayat.map((p) => (
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
                        <span className="font-semibold">Balasan admin:</span>{" "}
                        {p.balasan}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
