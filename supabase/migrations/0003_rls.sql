-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0003: AKTIFKAN ROW LEVEL SECURITY & blokir anon/authenticated
-- ============================================================================
--
-- FIX SECURITY KRITIS (P0): Sebelumnya RLS dimatikan (0001_init.sql) sehingga
-- siapa pun dengan anon/public key bisa membaca seluruh tabel (termasuk
-- password_hash users) dan bahkan membuat akun admin sendiri via REST API.
--
-- Setelah migration ini:
--   * RLS AKTIF di users, buku, transaksi.
--   * Role anon & authenticated TIDAK punya hak apa pun (default deny).
--   * SATU-SATUNYA akses lewat SERVICE ROLE key (server-only, dipakai app).
--
-- WAJIB dijalankan BERSAMAAN dengan mengganti SUPABASE_ANON_KEY ->
-- SUPABASE_SERVICE_ROLE_KEY di .env.local dan Vercel, barulah app tetap jalan.
--
-- Cara menjalankan: Supabase Dashboard -> SQL Editor -> paste & Run.
-- ============================================================================

-- 1) Cabut semua privilege pada role publik (anon/authenticated/service_role).
--    Supabase default memberi anon & authenticated akses ke public schema;
--    dengan RLS aktif, tanpa policy mereka otomatis ditolak. Ini lapis ganda.
revoke all on table public.users from anon, authenticated;
revoke all on table public.buku from anon, authenticated;
revoke all on table public.transaksi from anon, authenticated;
revoke all on sequence public.users_id_seq from anon, authenticated;

-- 2) Aktifkan Row Level Security pada semua tabel.
alter table public.users enable row level security;
alter table public.buku enable row level security;
alter table public.transaksi enable row level security;

-- 3) Tidak ada strategy/policy dibuat di sini. Karena RLS aktif & tanpa
--    policy, akses via anon/authenticated (termasuk REST dengan anon key)
--    otomatis DITOLAK. Hanya service_role (bypasses RLS) yang bisa baca/tulis.
--    Jika nanti butuh akses per-user berbasis JWT Supabase Auth, buat policy
--    `using (user_id = auth.uid())` dsb.

-- Verifikasi bahwa RLS aktif:
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relname in ('users', 'buku', 'transaksi')
  and relkind = 'r';
