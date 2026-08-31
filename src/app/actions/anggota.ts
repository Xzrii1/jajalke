"use server";

import { hash } from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, CONFIG_ERROR_MESSAGE } from "@/lib/supabase";
import type { ActionResult, User } from "@/lib/types";

export interface AnggotaInput {
  username: string;
  nama_lengkap: string;
  kelas?: string;
  no_induk?: string;
  password?: string;
}

function emptyToNull(v?: string): string | null {
  const t = (v ?? "").trim();
  return t === "" ? null : t;
}

export async function getAnggotaList(opts: {
  search?: string;
} = {}): Promise<{ data: User[]; error?: string }> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { data: [], error: CONFIG_ERROR_MESSAGE };

  let query = getSupabase()
    .from("users")
    .select("*")
    .eq("role", "siswa")
    .order("nama_lengkap", { ascending: true });

  const search = (opts.search ?? "").trim();
  if (search) {
    query = query.or(
      `nama_lengkap.ilike.%${search}%,username.ilike.%${search}%,no_induk.ilike.%${search}%,kelas.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };

  const rows = (data as (User & { password_hash: string })[]).map((u) => ({
    id: u.id,
    username: u.username,
    nama_lengkap: u.nama_lengkap,
    role: u.role,
    kelas: u.kelas,
    no_induk: u.no_induk,
    created_at: u.created_at,
  }));
  return { data: rows };
}

export async function createAnggota(input: AnggotaInput): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const username = input.username.trim();
  const namaLengkap = input.nama_lengkap.trim();
  const password = input.password ?? "";

  if (!username || !namaLengkap) {
    return { error: "Username dan nama lengkap wajib diisi." };
  }
  if (!password || password.length < 6) {
    return { error: "Password anggota minimal 6 karakter." };
  }

  const passwordHash = await hash(password, 10);
  const { error } = await getSupabase().from("users").insert({
    username,
    nama_lengkap: namaLengkap,
    role: "siswa",
    kelas: emptyToNull(input.kelas),
    no_induk: emptyToNull(input.no_induk),
    password_hash: passwordHash,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Username sudah terdaftar. Gunakan username lain." };
    }
    return { error: "Gagal menambah anggota: " + error.message };
  }
  return { success: `Anggota "${namaLengkap}" berhasil ditambahkan.` };
}

export async function updateAnggota(
  id: string,
  input: { nama_lengkap: string; kelas?: string; no_induk?: string; password?: string }
): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const namaLengkap = input.nama_lengkap.trim();
  if (!namaLengkap) return { error: "Nama lengkap wajib diisi." };

  const patch: Record<string, unknown> = {
    nama_lengkap: namaLengkap,
    kelas: emptyToNull(input.kelas),
    no_induk: emptyToNull(input.no_induk),
  };

  if (input.password && input.password.length > 0) {
    if (input.password.length < 6) {
      return { error: "Password baru minimal 6 karakter." };
    }
    patch.password_hash = await hash(input.password, 10);
  }

  const { error } = await getSupabase().from("users").update(patch).eq("id", id);
  if (error) return { error: "Gagal mengupdate anggota: " + error.message };
  return { success: "Data anggota berhasil diperbarui." };
}

export async function deleteAnggota(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const { error } = await getSupabase().from("users").delete().eq("id", id);
  if (error) return { error: "Gagal menghapus anggota: " + error.message };
  return { success: "Anggota berhasil dihapus." };
}