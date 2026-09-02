"use server";

import { requireAdmin, requirePetugasAdmin } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, CONFIG_ERROR_MESSAGE } from "@/lib/supabase";
import { DENDA_PER_HARI_DEFAULT } from "@/lib/utils";
import type { ActionResult } from "@/lib/types";

export interface Pengaturan {
  dendaPerHari: number;
  canEdit: boolean;
}

/** Tarif denda per hari aktif (fallback: default bila belum diatur). */
export async function getDendaPerHari(): Promise<number> {
  if (!isSupabaseConfigured) return DENDA_PER_HARI_DEFAULT;
  const { data } = await getSupabase()
    .from("pengaturan")
    .select("value")
    .eq("key", "denda_per_hari")
    .maybeSingle();
  const n = Number(data?.value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : DENDA_PER_HARI_DEFAULT;
}

/** Ambil pengaturan untuk ditampilkan di dashboard admin. */
export async function getPengaturan(): Promise<{
  data?: Pengaturan;
  error?: string;
}> {
  const user = await requirePetugasAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };
  return {
    data: {
      dendaPerHari: await getDendaPerHari(),
      canEdit: user.role === "admin",
    },
  };
}

/** Simpan tarif denda per hari. Hanya admin. */
export async function updateDendaPerHari(value: number): Promise<ActionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) {
    return { error: "Tarif denda harus berupa angka tidak negatif." };
  }
  if (n > 10_000_000) {
    return { error: "Tarif denda terlalu besar (maksimal Rp 10.000.000 per hari)." };
  }

  const { error } = await getSupabase()
    .from("pengaturan")
    .upsert(
      { key: "denda_per_hari", value: String(n), deskripsi: "Tarif denda keterlambatan pengembalian buku per hari (Rupiah)" },
      { onConflict: "key" }
    );
  if (error) return { error: "Gagal menyimpan pengaturan: " + error.message };

  return {
    success: `Tarif denda disimpan: Rp ${n.toLocaleString("id-ID")} per hari.`,
  };
}