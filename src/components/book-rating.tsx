"use client";

import { useState } from "react";
import { getUlasanBuku, saveUlasan } from "@/app/actions/ulasan";
import type { ActionResult, BukuRating, Ulasan } from "@/lib/types";
import { Alert, Button, Modal, Textarea } from "@/components/ui";
import { formatTanggal } from "@/lib/utils";

export function StarDisplay({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "lg";
}) {
  const cls = size === "lg" ? "h-6 w-6" : "h-4 w-4";
  return (
    <span className="inline-flex items-center gap-0.5" title={`${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${cls} ${
            value >= i - 0.25
              ? "text-amber-400"
              : value >= i - 0.75
                ? "text-amber-300/60"
                : "text-slate-300"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.3l-4.94 2.6.94-5.49-4-3.9 5.53-.8z" />
        </svg>
      ))}
    </span>
  );
}

export function BookRating({
  bukuId,
  rating,
  canRate = true,
  onChanged,
}: {
  bukuId: string;
  rating?: BukuRating;
  canRate?: boolean;
  onChanged?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [myRating, setMyRating] = useState(rating?.myRating ?? null);
  const [reviewList, setReviewList] = useState<Ulasan[]>([]);
  const [listOpen, setListOpen] = useState(false);
  const [stars, setStars] = useState(rating?.myRating ?? 5);
  const [komentar, setKomentar] = useState("");
  const [message, setMessage] = useState<ActionResult | null>(null);
  const [saving, setSaving] = useState(false);

  const count = rating?.count ?? 0;
  const avg = rating?.avg ?? 0;

  async function handleOpen() {
    setStars(myRating ?? 5);
    setKomentar("");
    setMessage(null);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await saveUlasan(bukuId, stars, komentar);
    setMessage(res);
    setSaving(false);
    if (res.success) {
      setMyRating(stars);
      setOpen(false);
      onChanged?.();
    }
  }

  async function handleList() {
    setListOpen(true);
    const res = await getUlasanBuku(bukuId);
    if (res.error) setMessage({ error: res.error });
    else setReviewList(res.data ?? []);
  }

  return (
    <div className="flex items-center gap-2">
      <StarDisplay value={avg} />
      <span className="text-xs text-slate-500">
        {avg > 0 ? avg.toFixed(1) : "Belum"} ({count})
      </span>
      <button
        type="button"
        onClick={handleList}
        className="text-xs font-semibold text-indigo-600 hover:underline"
      >
        Lihat
      </button>
      {canRate && (
        <Button
          variant="ghost"
          className="px-2 py-1 text-xs"
          onClick={handleOpen}
        >
          {myRating ? "Edit Rating" : "Beri Rating"}
        </Button>
      )}

      {/* Modal list ulasan */}
      <Modal
        open={listOpen}
        onClose={() => setListOpen(false)}
        title="Ulasan Buku"
      >
        {reviewList.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada komentar untuk buku ini.
          </p>
        ) : (
          <ul className="space-y-3">
            {reviewList.map((r) => (
              <li key={r.id} className="rounded-lg bg-slate-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {r.user?.nama_lengkap ?? "Anggota"}
                    </span>
                    <StarDisplay value={r.rating} />
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatTanggal(r.created_at)}
                  </span>
                </div>
                {r.komentar && (
                  <p className="mt-1.5 text-sm text-slate-600">{r.komentar}</p>
                )}
              </li>
            ))}
          </ul>
        )}
        {message?.error && (
          <div className="mt-3">
            <Alert kind="error">{message.error}</Alert>
          </div>
        )}
      </Modal>

      {/* Modal beri/edit rating */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={myRating ? "Edit Ulasan Buku" : "Beri Ulasan Buku"}
      >
        <p className="text-xs text-slate-400">
          Hanya bisa untuk buku yang pernah kamu pinjam.
        </p>
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Rating bintang
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStars(i)}
                aria-label={`${i} bintang`}
                className="transition-transform hover:scale-110"
              >
                <svg
                  className={`h-8 w-8 ${
                    stars >= i ? "text-amber-400" : "text-slate-300"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.3l-4.94 2.6.94-5.49-4-3.9 5.53-.8z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Komentar (opsional)
          </p>
          <Textarea
            className="mt-2"
            rows={4}
            value={komentar}
            maxLength={500}
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="Tulis ulasan singkat pengalaman membacamu..."
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {komentar.length}/500
          </p>
        </div>
        {message?.error && (
          <div className="mt-3">
            <Alert kind="error">{message.error}</Alert>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Ulasan"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
