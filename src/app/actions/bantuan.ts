"use server";

import { getCurrentUser, requirePetugasAdmin } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, CONFIG_ERROR_MESSAGE } from "@/lib/supabase";
import type { ActionResult, JenisBantuan, PermintaanBantuan, StatusBantuan } from "@/lib/types";

export const JENIS_BANTUAN_OPTIONS: { value: JenisBantuan; label: string }[] = [
  { value: "reset_password", label: "Reset / Ganti Password" },
  { value: "pertanyaan", label: "Pertanyaan Penggunaan" },
  { value: "keluhan", label: "Keluhan / Masalah" },
  { value: "lainnya", label: "Lainnya" },
];

export const STATUS_BANTUAN_LABEL: Record<StatusBantuan, string> = {
  baru: "Baru",
  diproses: "Diproses",
  selesai: "Selesai",
};

export const STATUS_BANTUAN_TONE: Record<StatusBantuan, string> = {
  baru: "pending",
  diproses: "aktif",
  selesai: "dikembalikan",
};

/** Kirim pesan bantuan oleh user yang sudah login. */
export async function kirimPermintaanBantuan(input: {
  jenis: JenisBantuan;
  subjek: string;
  pesan: string;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  if (!user) return { error: "Kamu harus masuk terlebih dahulu untuk mengirim permintaan." };

  const subjek = (input.subjek ?? "").trim();
  const pesan = (input.pesan ?? "").trim();

  if (!subjek || !pesan) {
    return { error: "Subjek dan pesan wajib diisi." };
  }
  if (subjek.length > 120) {
    return { error: "Subjek maksimal 120 karakter." };
  }
  if (pesan.length > 1000) {
    return { error: "Pesan maksimal 1000 karakter." };
  }
  if (!JENIS_BANTUAN_OPTIONS.some((o) => o.value === input.jenis)) {
    return { error: "Jenis permintaan tidak valid." };
  }

  const { error } = await getSupabase().from("permintaan_bantuan").insert({
    user_id: user.id,
    jenis: input.jenis,
    subjek,
    pesan,
    status: "baru",
  });
  if (error) return { error: "Gagal mengirim permintaan: " + error.message };

  return { success: "Permintaan bantuan berhasil dikirim. Admin akan segera menanganinya." };
}

/** Daftar permintaan bantuan milik user yang sedang login. */
export async function getPermintaanSaya(): Promise<{
  data?: PermintaanBantuan[];
  error?: string;
}> {
  const user = await getCurrentUser();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  if (!user) return { error: "Kamu harus masuk terlebih dahulu untuk melihat permintaan." };

  const { data, error } = await getSupabase()
    .from("permintaan_bantuan")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return { error: error.message };

  return { data: (data as PermintaanBantuan[]) ?? [] };
}

/** Semua permintaan untuk admin/petugas. */
export async function getPermintaanBantuanList(): Promise<{
  data?: PermintaanBantuan[];
  error?: string;
}> {
  await requirePetugasAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const { data, error } = await getSupabase()
    .from("permintaan_bantuan")
    .select("*, user:users(username, nama_lengkap, role, kelas, no_induk)")
    .order("created_at", { ascending: false });
  if (error) return { error: error.message };

  return { data: (data as PermintaanBantuan[]) ?? [] };
}

/** Update status + balasan oleh admin/petugas. */
export async function tanggapiPermintaanBantuan(
  id: string,
  input: { status?: StatusBantuan; balasan?: string }
): Promise<ActionResult> {
  await requirePetugasAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  if (!id) return { error: "Permintaan tidak valid." };

  const patch: Record<string, unknown> = {};
  if (input.status && STATUS_BANTUAN_LABEL[input.status]) {
    patch.status = input.status;
  }
  if (typeof input.balasan === "string") {
    const b = input.balasan.trim();
    if (b.length > 1000) return { error: "Balasan maksimal 1000 karakter." };
    patch.balasan = b || null;
  }

  const { error } = await getSupabase()
    .from("permintaan_bantuan")
    .update(patch)
    .eq("id", id);
  if (error) return { error: "Gagal memperbarui permintaan: " + error.message };

  return { success: "Permintaan berhasil diperbarui." };
}
