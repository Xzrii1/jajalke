"use server";

import { requireAdmin, requireSiswa } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, CONFIG_ERROR_MESSAGE } from "@/lib/supabase";
import {
  addDays,
  DENDA_PER_HARI,
  diffDays,
  normalizeTransaksi,
  todayISO,
  toISODate,
} from "@/lib/utils";
import type { ActionResult, Transaksi, User } from "@/lib/types";

const BASE_SELECT =
  "*, user:users(username, nama_lengkap, kelas, no_induk), buku:buku(judul, penulis, kategori, isbn)";

function mapRow(row: Transaksi): Transaksi {
  return normalizeTransaksi(row);
}

export async function getTransaksiSaya(): Promise<{
  data: Transaksi[];
  error?: string;
}> {
  const user = await requireSiswa();
  return getTransaksiUser(user.id);
}

export async function getTransaksiList(opts: {
  search?: string;
  status?: string;
} = {}): Promise<{ data: Transaksi[]; error?: string }> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { data: [], error: CONFIG_ERROR_MESSAGE };

  let query = getSupabase()
    .from("transaksi")
    .select(BASE_SELECT)
    .order("created_at", { ascending: false });

  const search = (opts.search ?? "").trim();
  if (search) {
    query = query.or(
      `user.nama_lengkap.ilike.%${search}%,user.username.ilike.%${search}%,buku.judul.ilike.%${search}%,buku.penulis.ilike.%${search}%`
    );
  }
  if (opts.status && opts.status !== "semua") {
    if (opts.status === "aktif") {
      query = query.is("tanggal_kembali", null);
    } else if (opts.status === "dikembalikan") {
      query = query.not("tanggal_kembali", "is", null);
    }
  }

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: (data as Transaksi[]).map(mapRow) };
}

export async function getTransaksiUser(userId: string): Promise<{
  data: Transaksi[];
  error?: string;
}> {
  await requireSiswa();
  if (!isSupabaseConfigured) return { data: [], error: CONFIG_ERROR_MESSAGE };

  const { data, error } = await getSupabase()
    .from("transaksi")
    .select(BASE_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data as Transaksi[]).map(mapRow) };
}

export async function pinjamBuku(bukuId: string): Promise<ActionResult> {
  const user = await requireSiswa();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  const { data: buku, error: bukuErr } = await sb
    .from("buku")
    .select("*")
    .eq("id", bukuId)
    .maybeSingle();
  if (bukuErr || !buku) return { error: "Buku tidak ditemukan." };
  if (buku.stok <= 0) return { error: `Stok buku "${buku.judul}" sedang habis.` };

  const { data: active } = await sb
    .from("transaksi")
    .select("id")
    .eq("user_id", user.id)
    .eq("buku_id", bukuId)
    .is("tanggal_kembali", null)
    .limit(1);

  if (active && active.length > 0) {
    return { error: "Kamu masih punya peminjaman aktif untuk buku ini. Kembalikan dulu." };
  }

  const now = new Date();
  const tanggalPinjam = toISODate(now);
  const jatuhTempo = toISODate(addDays(now, 7));

  const { error: stokErr } = await sb
    .from("buku")
    .update({ stok: buku.stok - 1, updated_at: now.toISOString() })
    .eq("id", bukuId);
  if (stokErr) return { error: "Gagal mengupdate stok: " + stokErr.message };

  const { error: trxErr } = await sb.from("transaksi").insert({
    user_id: user.id,
    buku_id: bukuId,
    tanggal_pinjam: tanggalPinjam,
    tanggal_jatuh_tempo: jatuhTempo,
    status: "dipinjam",
  });
  if (trxErr) {
    await sb
      .from("buku")
      .update({ stok: buku.stok, updated_at: new Date().toISOString() })
      .eq("id", bukuId);
    return { error: "Gagal membuat transaksi: " + trxErr.message };
  }

  return {
    success: `Berhasil meminjam "${buku.judul}". Jatuh tempo ${jatuhTempo}.`,
  };
}

export async function kembalikanBuku(transaksiId: string): Promise<ActionResult> {
  await requireSiswa();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  const { data: trx, error: trxErr } = await sb
    .from("transaksi")
    .select("*")
    .eq("id", transaksiId)
    .maybeSingle();
  if (trxErr || !trx) return { error: "Transaksi tidak ditemukan." };
  if (trx.tanggal_kembali) {
    return { error: "Buku ini sudah dikembalikan." };
  }

  const tanggalKembali = todayISO();
  const hariTelat = diffDays(tanggalKembali, trx.tanggal_jatuh_tempo);
  const terlambat = hariTelat > 0;
  const denda = terlambat ? hariTelat * DENDA_PER_HARI : 0;
  const status = terlambat ? "terlambat" : "dikembalikan";

  const { error: upErr } = await sb
    .from("transaksi")
    .update({ tanggal_kembali: tanggalKembali, status, denda })
    .eq("id", transaksiId);
  if (upErr) return { error: "Gagal update transaksi: " + upErr.message };

  const b = await sb.from("buku").select("stok").eq("id", trx.buku_id).maybeSingle();
  if (!b.data) return { error: "Buku terkait tidak ditemukan." };
  const { error: stokErr } = await sb
    .from("buku")
    .update({ stok: b.data.stok + 1, updated_at: new Date().toISOString() })
    .eq("id", trx.buku_id);
  if (stokErr) return { error: "Gagal update stok: " + stokErr.message };

  return {
    success: `Buku berhasil dikembalikan${terlambat ? ` (terlambat ${hariTelat} hari, denda Rp ${(denda).toLocaleString("id-ID")})` : ""}.`,
  };
}

export interface AdminCreateTransaksi {
  user_id: string;
  buku_id: string;
  tanggal_pinjam: string;
  tanggal_jatuh_tempo: string;
}

export async function createTransaksi(input: AdminCreateTransaksi): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  if (!input.user_id || !input.buku_id) return { error: "Anggota dan buku wajib dipilih." };
  if (!input.tanggal_pinjam || !input.tanggal_jatuh_tempo) {
    return { error: "Tanggal pinjam dan jatuh tempo wajib diisi." };
  }
  if (input.tanggal_jatuh_tempo < input.tanggal_pinjam) {
    return { error: "Tanggal jatuh tempo tidak boleh sebelum tanggal pinjam." };
  }

  const { data: buku, error: bukuErr } = await sb
    .from("buku")
    .select("*")
    .eq("id", input.buku_id)
    .maybeSingle();
  if (bukuErr || !buku) return { error: "Buku tidak ditemukan." };
  if (buku.stok <= 0) return { error: `Stok buku "${buku.judul}" habis.` };

  const { error: stokErr } = await sb
    .from("buku")
    .update({ stok: buku.stok - 1, updated_at: new Date().toISOString() })
    .eq("id", input.buku_id);
  if (stokErr) return { error: "Gagal update stok: " + stokErr.message };

  const { error: trxErr } = await sb.from("transaksi").insert({
    user_id: input.user_id,
    buku_id: input.buku_id,
    tanggal_pinjam: input.tanggal_pinjam,
    tanggal_jatuh_tempo: input.tanggal_jatuh_tempo,
    status: "dipinjam",
  });
  if (trxErr) {
    await sb
      .from("buku")
      .update({ stok: buku.stok, updated_at: new Date().toISOString() })
      .eq("id", input.buku_id);
    return { error: "Gagal membuat transaksi: " + trxErr.message };
  }

  return { success: "Transaksi peminjaman berhasil dibuat." };
}

export interface AdminUpdateTransaksi {
  tanggal_pinjam: string;
  tanggal_jatuh_tempo: string;
  tanggal_kembali?: string | null;
  denda?: string;
}

export async function updateTransaksi(
  id: string,
  input: AdminUpdateTransaksi
): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  if (!input.tanggal_jatuh_tempo || !input.tanggal_pinjam) {
    return { error: "Tanggal pinjam dan jatuh tempo wajib diisi." };
  }
  if (input.tanggal_jatuh_tempo < input.tanggal_pinjam) {
    return { error: "Tanggal jatuh tempo tidak boleh sebelum tanggal pinjam." };
  }

  const { data: old, error: oldErr } = await sb
    .from("transaksi")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (oldErr || !old) return { error: "Transaksi tidak ditemukan." };

  const newKembali = input.tanggal_kembali || null;
  const wasActive = !old.tanggal_kembali;
  const nowActive = !newKembali;

  const patch: Record<string, unknown> = {
    tanggal_pinjam: input.tanggal_pinjam,
    tanggal_jatuh_tempo: input.tanggal_jatuh_tempo,
    tanggal_kembali: newKembali,
  };

  if (newKembali) {
    const hariTelat = diffDays(newKembali, input.tanggal_jatuh_tempo);
    patch.status = hariTelat > 0 ? "terlambat" : "dikembalikan";
    patch.denda = hariTelat > 0 ? hariTelat * DENDA_PER_HARI : 0;
  } else {
    patch.status = "dipinjam";
    patch.denda = 0;
  }
  if (input.denda !== undefined && input.denda !== "") {
    patch.denda = Math.max(0, Number(input.denda) || 0);
  }

  let stokErr: string | null = null;

  if (old.buku_id && wasActive !== nowActive) {
    const b = await sb.from("buku").select("stok").eq("id", old.buku_id).maybeSingle();
    if (b.data) {
      let s = b.data.stok;
      if (wasActive && !nowActive) s += 1; // buku dikembalikan -> stok kembali
      if (!wasActive && nowActive) s -= 1; // dibuka ulang -> stok berkurang
      const { error } = await sb
        .from("buku")
        .update({ stok: Math.max(0, s), updated_at: new Date().toISOString() })
        .eq("id", old.buku_id);
      if (error) stokErr = error.message;
    }
  }
  if (stokErr) return { error: "Gagal update stok: " + stokErr };

  const { error } = await sb.from("transaksi").update(patch).eq("id", id);
  if (error) return { error: "Gagal update transaksi: " + error.message };

  return { success: "Transaksi berhasil diperbarui." };
}

export async function deleteTransaksi(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  const { data: trx, error: trxErr } = await sb
    .from("transaksi")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (trxErr || !trx) return { error: "Transaksi tidak ditemukan." };

  if (!trx.tanggal_kembali) {
    const b = await sb.from("buku").select("stok").eq("id", trx.buku_id).maybeSingle();
    if (b.data) {
      await sb
        .from("buku")
        .update({ stok: b.data.stok + 1, updated_at: new Date().toISOString() })
        .eq("id", trx.buku_id);
    }
  }

  const { error } = await sb.from("transaksi").delete().eq("id", id);
  if (error) return { error: "Gagal menghapus transaksi: " + error.message };
  return { success: "Transaksi berhasil dihapus." };
}

export interface AdminStats {
  totalBuku: number;
  totalStok: number;
  totalAnggota: number;
  transaksiAktif: number;
}

export async function getAdminStats(): Promise<{ data?: AdminStats; error?: string }> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  const [buku, stok, anggota, aktif] = await Promise.all([
    sb.from("buku").select("id", { count: "exact", head: true }),
    sb.from("buku").select("stok"),
    sb.from("users").select("id", { count: "exact", head: true }).eq("role", "siswa"),
    sb.from("transaksi").select("id", { count: "exact", head: true }).is("tanggal_kembali", null),
  ]);

  if (buku.error || anggota.error || aktif.error) {
    return { error: "Gagal mengambil statistik." };
  }

  const totalStok = (stok.data ?? []).reduce(
    (sum, row) => sum + (Number(row.stok) || 0),
    0
  );

  return {
    data: {
      totalBuku: buku.count ?? 0,
      totalStok,
      totalAnggota: anggota.count ?? 0,
      transaksiAktif: aktif.count ?? 0,
    },
  };
}

export interface SiswaStats {
  aktif: number;
  terlambat: number;
  total: number;
  user: User;
}

export async function getSiswaStats(): Promise<{ data?: SiswaStats; error?: string }> {
  const user = await requireSiswa();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const { data, error } = await getTransaksiUser(user.id);
  if (error) return { error };

  const aktif = data.filter((t) => t.status !== "dikembalikan");
  const terlambat = data.filter((t) => t.status === "terlambat");

  return {
    data: {
      aktif: aktif.length,
      terlambat: terlambat.length,
      total: data.length,
      user,
    },
  };
}

export interface AdminChartData {
  dates: string[];
  pinjam: number[];
  kembali: number[];
}

export async function getAdminChartData(
  days = 14
): Promise<{ data?: AdminChartData; error?: string }> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  const start = toISODate(addDays(new Date(), -(days - 1)));
  const end = todayISO();

  const [pinjamRes, kembaliRes] = await Promise.all([
    sb
      .from("transaksi")
      .select("tanggal_pinjam")
      .gte("tanggal_pinjam", start)
      .lte("tanggal_pinjam", end),
    sb
      .from("transaksi")
      .select("tanggal_kembali")
      .gte("tanggal_kembali", start)
      .lte("tanggal_kembali", end)
      .not("tanggal_kembali", "is", null),
  ]);

  if (pinjamRes.error) return { error: pinjamRes.error.message };
  if (kembaliRes.error) return { error: kembaliRes.error.message };

  const indexes = new Map<string, number>();
  const dates: string[] = [];
  for (let d = 0; d < days; d++) {
    const iso = toISODate(addDays(new Date(), d - (days - 1)));
    indexes.set(iso, d);
    dates.push(iso);
  }

  const pinjam = new Array(days).fill(0);
  const kembali = new Array(days).fill(0);

  for (const row of pinjamRes.data ?? []) {
    const i = indexes.get(row.tanggal_pinjam);
    if (i !== undefined) pinjam[i] += 1;
  }
  for (const row of kembaliRes.data ?? []) {
    const i = indexes.get(row.tanggal_kembali);
    if (i !== undefined) kembali[i] += 1;
  }

  return { data: { dates, pinjam, kembali } };
}