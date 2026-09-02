import type { KondisiBuku } from "./types";

export const KONDISI_OPTIONS: KondisiBuku[] = ["baru", "baik", "bekas", "rusak"];

export const KONDISI_LABELS: Record<KondisiBuku, string> = {
  baru: "Baru",
  baik: "Baik",
  bekas: "Bekas",
  rusak: "Rusak",
};

/** Tone Badge untuk tiap kondisi fisik buku. */
export const KONDISI_TONES: Record<KondisiBuku, string> = {
  baru: "tersedia",
  baik: "aktif",
  bekas: "pending",
  rusak: "terlambat",
};