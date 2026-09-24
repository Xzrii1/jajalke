"use server";

import { hash } from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, CONFIG_ERROR_MESSAGE } from "@/lib/supabase";
import type { ActionResult } from "@/lib/types";

export interface Staf {
  id: string;
  username: string;
  nama_lengkap: string;
  role: "admin" | "petugas";
  created_at: string;
}

export interface PetugasInput {
  username: string;
  nama_lengkap: string;
  password: string;
}

/** Daftar akun admin & petugas (untuk konteks). Hanya admin. */
export async function getStafList(): Promise<{ data: Staf[]; error?: string }> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { data: [], error: CONFIG_ERROR_MESSAGE };

  const { data, error } = await getSupabase()
    .from("users")
    .select("id, username, nama_lengkap, role, created_at")
    .in("role", ["admin", "petugas"])
    .order("role", { ascending: true })
    .order("nama_lengkap", { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Staf[] };
}

export async function createPetugas(input: PetugasInput): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const username = input.username.trim();
  const namaLengkap = input.nama_lengkap.trim();
  const password = input.password ?? "";

  if (!username || !namaLengkap) {
    return { error: "Username dan nama lengkap wajib diisi." };
  }
  if (!password || password.length < 6) {
    return { error: "Password petugas minimal 6 karakter." };
  }

  const passwordHash = await hash(password, 10);
  const { error } = await getSupabase().from("users").insert({
    username,
    nama_lengkap: namaLengkap,
    role: "petugas",
    password_hash: passwordHash,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Username sudah terdaftar. Gunakan username lain." };
    }
    return { error: "Gagal menambah petugas: " + error.message };
  }
  return { success: `Petugas "${namaLengkap}" berhasil ditambahkan.` };
}

export async function updatePetugas(
  id: string,
  input: { nama_lengkap: string; password?: string }
): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const { data: target, error: targetErr } = await getSupabase()
    .from("users")
    .select("id, role")
    .eq("id", id)
    .maybeSingle();
  if (targetErr || !target) return { error: "Petugas tidak ditemukan." };
  if (target.role !== "petugas") {
    return { error: "Akun ini tidak dapat dikelola lewat menu Petugas." };
  }

  const namaLengkap = input.nama_lengkap.trim();
  if (!namaLengkap) return { error: "Nama lengkap wajib diisi." };

  const patch: Record<string, unknown> = { nama_lengkap: namaLengkap };
  if (input.password && input.password.length > 0) {
    if (input.password.length < 6) {
      return { error: "Password baru minimal 6 karakter." };
    }
    patch.password_hash = await hash(input.password, 10);
  }

  const { error } = await getSupabase().from("users").update(patch).eq("id", id);
  if (error) return { error: "Gagal mengupdate petugas: " + error.message };
  return { success: "Data petugas berhasil diperbarui." };
}

export async function deletePetugas(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const { data: target, error: targetErr } = await getSupabase()
    .from("users")
    .select("id, role")
    .eq("id", id)
    .maybeSingle();
  if (targetErr || !target) return { error: "Petugas tidak ditemukan." };
  if (target.role !== "petugas") {
    return { error: "Akun ini tidak dapat dihapus lewat menu Petugas." };
  }

  const { error } = await getSupabase().from("users").delete().eq("id", id);
  if (error) return { error: "Gagal menghapus petugas: " + error.message };
  return { success: "Petugas berhasil dihapus." };
}