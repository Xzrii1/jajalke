"use server";

import { requireAdmin, requireUser } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, CONFIG_ERROR_MESSAGE } from "@/lib/supabase";
import type { ActionResult, Buku } from "@/lib/types";

export interface BukuInput {
  judul: string;
  penulis?: string;
  penerbit?: string;
  tahun_terbit?: string;
  isbn?: string;
  kategori?: string;
  stok?: string;
  deskripsi?: string;
}

function emptyToNull(v?: string): string | null {
  const t = (v ?? "").trim();
  return t === "" ? null : t;
}

export async function getBukuList(opts: {
  search?: string;
  kategori?: string;
} = {}): Promise<{ data: Buku[]; error?: string }> {
  await requireUser();
  if (!isSupabaseConfigured) return { data: [], error: CONFIG_ERROR_MESSAGE };

  let query = getSupabase()
    .from("buku")
    .select("*")
    .order("judul", { ascending: true });

  const search = (opts.search ?? "").trim();
  if (search) {
    query = query.or(
      `judul.ilike.%${search}%,penulis.ilike.%${search}%,kategori.ilike.%${search}%,isbn.ilike.%${search}%`
    );
  }
  if (opts.kategori) {
    query = query.eq("kategori", opts.kategori);
  }

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: data as Buku[] };
}

export async function getKategoriList(): Promise<string[]> {
  await requireUser();
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getSupabase()
    .from("buku")
    .select("kategori")
    .not("kategori", "is", null);
  if (error) return [];
  return Array.from(new Set(data.map((r) => r.kategori as string))).sort();
}

export async function createBuku(input: BukuInput): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const judul = input.judul.trim();
  if (!judul) return { error: "Judul buku wajib diisi." };
  const stok = Math.max(0, Number(input.stok ?? 0) || 0);
  const tahun = emptyToNull(input.tahun_terbit);
  if (tahun && !/^\d{4}$/.test(tahun)) {
    return { error: "Tahun terbit harus 4 digit angka." };
  }

  const { error } = await getSupabase().from("buku").insert({
    judul,
    penulis: emptyToNull(input.penulis),
    penerbit: emptyToNull(input.penerbit),
    tahun_terbit: tahun ? Number(tahun) : null,
    isbn: emptyToNull(input.isbn),
    kategori: emptyToNull(input.kategori),
    stok,
    deskripsi: emptyToNull(input.deskripsi),
  });

  if (error) return { error: "Gagal menyimpan buku: " + error.message };
  return { success: `Buku "${judul}" berhasil ditambahkan.` };
}

export async function updateBuku(id: string, input: BukuInput): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const judul = input.judul.trim();
  if (!judul) return { error: "Judul buku wajib diisi." };
  const stok = Math.max(0, Number(input.stok ?? 0) || 0);
  const tahun = emptyToNull(input.tahun_terbit);
  if (tahun && !/^\d{4}$/.test(tahun)) {
    return { error: "Tahun terbit harus 4 digit angka." };
  }

  const { error } = await getSupabase()
    .from("buku")
    .update({
      judul,
      penulis: emptyToNull(input.penulis),
      penerbit: emptyToNull(input.penerbit),
      tahun_terbit: tahun ? Number(tahun) : null,
      isbn: emptyToNull(input.isbn),
      kategori: emptyToNull(input.kategori),
      stok,
      deskripsi: emptyToNull(input.deskripsi),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: "Gagal mengupdate buku: " + error.message };
  return { success: "Data buku berhasil diperbarui." };
}

export async function deleteBuku(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const { error } = await getSupabase().from("buku").delete().eq("id", id);
  if (error) return { error: "Gagal menghapus buku: " + error.message };
  return { success: "Buku berhasil dihapus." };
}