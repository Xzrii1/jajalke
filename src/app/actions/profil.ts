"use server";

import { requireSiswa } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, CONFIG_ERROR_MESSAGE } from "@/lib/supabase";
import { getDendaPerHari } from "@/app/actions/pengaturan";
import { dendaSisa, normalizeTransaksi } from "@/lib/utils";
import type { ActionResult, Transaksi, User } from "@/lib/types";

const BASE_SELECT =
  "*, user:users(username, nama_lengkap, kelas, no_induk), buku:buku(judul, penulis, kategori, isbn, cover_url)";

export interface ProfilDenda {
  transaksi_id: string;
  buku: string;
  cover_url: string | null;
  tanggal_pinjam: string;
  tanggal_jatuh_tempo: string;
  tanggal_kembali: string;
  hariTelat: number;
  denda: number;
  denda_bayar: number;
  sisa: number;
}

export interface SiswaProfil {
  user: User;
  totalPinjam: number;
  aktif: number;
  terlambat: number;
  riwayat: Transaksi[];
  denda: ProfilDenda[];
  totalDendaBelumBayar: number;
}

export async function getDendaBelumBayar(): Promise<{
  data?: { denda: ProfilDenda[]; total: number };
  error?: string;
}> {
  const user = await requireSiswa();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  const { data, error } = await sb
    .from("transaksi")
    .select(BASE_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return { error: error.message };

  const dendaPerHari = await getDendaPerHari();
  const rows = ((data as Transaksi[]) ?? []).map((row) =>
    normalizeTransaksi(row, dendaPerHari)
  );

  const denda: ProfilDenda[] = rows
    .filter((t) => t.tanggal_kembali && dendaSisa(t) > 0)
    .map((t) => {
      const diff = diffDaysHelper(t.tanggal_kembali!, t.tanggal_jatuh_tempo);
      return {
        transaksi_id: t.id,
        buku: t.buku?.judul ?? "Buku",
        cover_url: t.buku?.cover_url ?? null,
        tanggal_pinjam: t.tanggal_pinjam,
        tanggal_jatuh_tempo: t.tanggal_jatuh_tempo,
        tanggal_kembali: t.tanggal_kembali!,
        hariTelat: Math.max(0, diff),
        denda: t.denda,
        denda_bayar: t.denda_bayar,
        sisa: dendaSisa(t),
      };
    });

  return {
    data: {
      denda,
      total: denda.reduce((s, d) => s + d.sisa, 0),
    },
  };
}

export async function getSiswaProfil(): Promise<{
  data?: SiswaProfil;
  error?: string;
}> {
  const user = await requireSiswa();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  const { data, error } = await sb
    .from("transaksi")
    .select(BASE_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return { error: error.message };

  const dendaPerHari = await getDendaPerHari();
  const rows = ((data as Transaksi[]) ?? []).map((row) =>
    normalizeTransaksi(row, dendaPerHari)
  );

  const aktif = rows.filter(
    (t) => t.status === "dipinjam" || t.status === "terlambat"
  );
  const terlambat = rows.filter((t) => t.status === "terlambat");

  // Denda yang bisa dibayar hanya untuk buku yang SUDAH dikembalikan
  const denda: ProfilDenda[] = rows
    .filter((t) => t.tanggal_kembali && dendaSisa(t) > 0)
    .map((t) => {
      const diff = diffDaysHelper(t.tanggal_kembali!, t.tanggal_jatuh_tempo);
      return {
        transaksi_id: t.id,
        buku: t.buku?.judul ?? "Buku",
        cover_url: t.buku?.cover_url ?? null,
        tanggal_pinjam: t.tanggal_pinjam,
        tanggal_jatuh_tempo: t.tanggal_jatuh_tempo,
        tanggal_kembali: t.tanggal_kembali!,
        hariTelat: Math.max(0, diff),
        denda: t.denda,
        denda_bayar: t.denda_bayar,
        sisa: dendaSisa(t),
      };
    });

  return {
    data: {
      user,
      totalPinjam: rows.length,
      aktif: aktif.length,
      terlambat: terlambat.length,
      riwayat: rows,
      denda,
      totalDendaBelumBayar: denda.reduce((s, d) => s + d.sisa, 0),
    },
  };
}

function diffDaysHelper(kembali: string, jatuhTempo: string): number {
  const start = new Date(jatuhTempo + "T00:00:00");
  const end = new Date(kembali + "T00:00:00");
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/** Menandai denda sebagai lunas via pembayaran QRIS fiktif (full payment). */
export async function bayarDenda(transaksiId: string): Promise<ActionResult> {
  const user = await requireSiswa();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  const { data: trx, error: trxErr } = await sb
    .from("transaksi")
    .select("*")
    .eq("id", transaksiId)
    .maybeSingle();
  if (trxErr || !trx) return { error: "Transaksi tidak ditemukan." };
  if (trx.user_id !== user.id) {
    return { error: "Transaksi ini bukan milikmu." };
  }
  if (!trx.tanggal_kembali) {
    return { error: "Buku ini belum dikembalikan. Denda dapat dibayar setelah buku dikembalikan." };
  }

  const normalized = normalizeTransaksi(trx as Transaksi);
  const sisa = dendaSisa(normalized);
  if (sisa <= 0) {
    return { error: "Denda untuk transaksi ini sudah lunas." };
  }

  const sisaCheck = await sb
    .from("transaksi")
    .update({ denda_bayar: normalized.denda })
    .eq("id", transaksiId);
  if (sisaCheck.error) {
    return { error: "Gagal memproses pembayaran: " + sisaCheck.error.message };
  }

  const { error: payErr } = await sb.from("pembayaran_denda").insert({
    user_id: user.id,
    transaksi_id: transaksiId,
    jumlah: sisa,
    metode: "qris",
    status: "sukses",
  });
  if (payErr) {
    return { error: "Pembayaran berhasil namun pencatatan gagal: " + payErr.message };
  }

  return {
    success: `Pembayaran denda Rp ${sisa.toLocaleString("id-ID")} berhasil (QRIS demo).`,
  };
}
