import type { Transaksi, TransaksiStatus } from "./types";

export const DENDA_PER_HARI = 1000;

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/**
 * Menghitung selisih hari antara dua tanggal ISO (YYYY-MM-DD).
 * kembali - jatuhTempo, bisa negatif.
 */
export function diffDays(kembaliISO: string, jatuhTempoISO: string): number {
  const start = new Date(jatuhTempoISO + "T00:00:00");
  const end = new Date(kembaliISO + "T00:00:00");
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Menentukan status efektif sebuah transaksi.
 * - Sudah dikembalikan: 'terlambat' bila melampaui jatuh tempo, selain itu 'dikembalikan'.
 * - Belum dikembalikan: 'terlambat' bila sekarang melewati jatuh tempo, selain itu 'dipinjam'.
 */
export function resolveStatus(
  t: Pick<Transaksi, "tanggal_kembali" | "tanggal_jatuh_tempo">
): TransaksiStatus {
  const today = todayISO();
  if (t.tanggal_kembali) {
    return diffDays(t.tanggal_kembali, t.tanggal_jatuh_tempo) > 0
      ? "terlambat"
      : "dikembalikan";
  }
  return diffDays(today, t.tanggal_jatuh_tempo) > 0 ? "terlambat" : "dipinjam";
}

/** Denda efektif: dari DB bila sudah dikembalikan, atau hitung ulang bila masih berjalan & terlambat. */
export function resolveDenda(
  t: Pick<Transaksi, "tanggal_kembali" | "tanggal_jatuh_tempo" | "denda">
): number {
  if (t.tanggal_kembali) return t.denda ?? 0;
  const status = resolveStatus(t);
  if (status === "terlambat") {
    return diffDays(todayISO(), t.tanggal_jatuh_tempo) * DENDA_PER_HARI;
  }
  return 0;
}

/** Standarisasi kolom status/denda hasil query agar tampilan konsisten. */
export function normalizeTransaksi(row: Transaksi): Transaksi {
  return {
    ...row,
    status: resolveStatus(row),
    denda: resolveDenda(row),
  };
}

export function formatTanggal(isoDate: string | null | undefined): string {
  if (!isoDate) return "-";
  const d = new Date(isoDate.length === 10 ? isoDate + "T00:00:00" : isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatRupiah(n: number): string {
  return "Rp " + (n ?? 0).toLocaleString("id-ID");
}