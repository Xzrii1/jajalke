"use server";

import { requireSiswa, requireUser } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, CONFIG_ERROR_MESSAGE } from "@/lib/supabase";
import type { ActionResult, BukuRating, Ulasan } from "@/lib/types";

/** Cek apakah user sudah pernah meminjam buku tsb (bukan ajuan yang belum disetujui/ditolak). */
export async function pernahMeminjam(userId: string, bukuId: string): Promise<boolean> {
  const sb = getSupabase();
  const { data } = await sb
    .from("transaksi")
    .select("id")
    .eq("user_id", userId)
    .eq("buku_id", bukuId)
    .in("status", ["dipinjam", "terlambat", "dikembalikan"])
    .limit(1);
  return Boolean(data && data.length > 0);
}

/** Ringkasan rating per buku untuk daftar buku (panggil sekali untuk semua id). */
export async function getRatingInfo(
  bukuIds: string[]
): Promise<{ data?: Record<string, BukuRating>; error?: string }> {
  const user = await requireUser();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  if (bukuIds.length === 0) return { data: {} };

  const sb = getSupabase();
  const [ratingsRes, myRes] = await Promise.all([
    sb.from("ulasan").select("buku_id, rating").in("buku_id", bukuIds),
    sb.from("ulasan").select("buku_id, rating").eq("user_id", user.id).in("buku_id", bukuIds),
  ]);
  if (ratingsRes.error) return { error: ratingsRes.error.message };
  if (myRes.error) return { error: myRes.error.message };

  const map: Record<string, BukuRating> = {};
  for (const id of bukuIds) map[id] = { count: 0, avg: 0, myRating: null };

  const sums: Record<string, { count: number; total: number }> = {};
  for (const row of ratingsRes.data ?? []) {
    const s = (sums[row.buku_id] ??= { count: 0, total: 0 });
    s.count += 1;
    s.total += Number(row.rating) || 0;
  }
  for (const id of Object.keys(sums)) {
    const s = sums[id];
    map[id].count = s.count;
    map[id].avg = s.count ? Math.round((s.total / s.count) * 10) / 10 : 0;
  }
  for (const row of myRes.data ?? []) {
    if (map[row.buku_id]) map[row.buku_id].myRating = Number(row.rating) || null;
  }

  return { data: map };
}

/** Semua ulasan beserta data pemulisnya untuk sebuah buku. */
export async function getUlasanBuku(
  bukuId: string
): Promise<{ data?: Ulasan[]; error?: string }> {
  await requireUser();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const sb = getSupabase();
  const { data, error } = await sb
    .from("ulasan")
    .select("*, user:users(username, nama_lengkap, kelas)")
    .eq("buku_id", bukuId)
    .order("created_at", { ascending: false });
  if (error) return { error: error.message };

  return { data: (data as Ulasan[]) ?? [] };
}

/** Simpan / perbarui ulasan. Hanya boleh jika pernah meminjam, rating 1-5. */
export async function saveUlasan(
  bukuId: string,
  rating: number,
  komentar: string
): Promise<ActionResult> {
  const user = await requireSiswa();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  const sb = getSupabase();

  if (!bukuId) return { error: "Buku tidak valid." };

  const { data: buku, error: bukuErr } = await sb
    .from("buku")
    .select("id, judul")
    .eq("id", bukuId)
    .maybeSingle();
  if (bukuErr || !buku) return { error: "Buku tidak ditemukan." };

  const r = Math.floor(Number(rating));
  if (!Number.isFinite(r) || r < 1 || r > 5) {
    return { error: "Rating harus antara 1 sampai 5 bintang." };
  }
  const text = (komentar ?? "").trim();
  if (text.length > 500) {
    return { error: "Komentar maksimal 500 karakter." };
  }

  const pernah = await pernahMeminjam(user.id, bukuId);
  if (!pernah) {
    return {
      error:
        "Kamu hanya bisa memberi rating & komentar untuk buku yang sudah pernah kamu pinjam.",
    };
  }

  const patch: Record<string, unknown> = { rating: r, komentar: text || null };
  const { error: upsertErr } = await sb
    .from("ulasan")
    .upsert({ user_id: user.id, buku_id: bukuId, ...patch }, {
      onConflict: "user_id,buku_id",
    });
  if (upsertErr) return { error: "Gagal menyimpan ulasan: " + upsertErr.message };

  return { success: `Ulasan untuk "${buku.judul}" berhasil disimpan.` };
}
