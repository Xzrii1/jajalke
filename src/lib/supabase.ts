import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const CONFIG_ERROR_MESSAGE =
  "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local (lihat README).";

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(CONFIG_ERROR_MESSAGE);
  }
  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
}