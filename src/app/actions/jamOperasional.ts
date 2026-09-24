"use server";

import { requireUser, requirePetugas } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, CONFIG_ERROR_MESSAGE } from "@/lib/supabase";
import {
  DAFTAR_HARI,
  type HariJam,
  type HariKey,
  type JamOperasional,
} from "@/lib/jamOperasional";
import type { ActionResult } from "@/lib/types";

const KEY = "jam_operasional";

function parse(value: string | undefined | null): JamOperasional {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as JamOperasional) : {};
  } catch {
    return {};
  }
}

function validHHMM(v: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(v)) return false;
  const [h, m] = v.split(":").map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

/** Ambil jam operasional perpustakaan (untuk semua pengguna yang login). */
export async function getJamOperasional(): Promise<{
  data: JamOperasional;
  error?: string;
}> {
  await requireUser();
  if (!isSupabaseConfigured) return { data: {}, error: CONFIG_ERROR_MESSAGE };

  const { data } = await getSupabase()
    .from("pengaturan")
    .select("value")
    .eq("key", KEY)
    .maybeSingle();

  return { data: parse(data?.value) };
}

/** Simpan jam operasional. Hanya petugas. */
export async function updateJamOperasional(
  input: JamOperasional
): Promise<ActionResult> {
  await requirePetugas();
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR_MESSAGE };

  const clean: JamOperasional = {};

  for (const { key } of DAFTAR_HARI) {
    const v = input[key];
    if (!v) continue; // libur / tidak diisi -> tidak disimpan
    const buka = (v.buka ?? "").trim();
    const tutup = (v.tutup ?? "").trim();
    if (!validHHMM(buka) || !validHHMM(tutup)) {
      return { error: `Format jam untuk ${key} tidak valid. Gunakan HH:MM.` };
    }
    if (buka >= tutup) {
      return {
        error:
          "Jam tutup harus setelah jam buka. Atau centang 'Libur' jika perpustakaan tidak buka hari itu.",
      };
    }
    clean[key] = { buka, tutup } satisfies HariJam;
  }

  const { error } = await getSupabase()
    .from("pengaturan")
    .upsert(
      {
        key: KEY,
        value: JSON.stringify(clean),
        deskripsi: "Jam operasional perpustakaan per hari (senin-sabtu, minggu libur)",
      },
      { onConflict: "key" }
    );

  if (error) return { error: "Gagal menyimpan jam operasional: " + error.message };
  return { success: "Jam operasional berhasil disimpan." };
}

export type { HariKey };