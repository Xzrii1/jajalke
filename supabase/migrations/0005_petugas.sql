-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0005: tambah role 'petugas' (mini-admin) + seed akun petugas
-- ============================================================================
-- 1) Menambah nilai 'petugas' pada constraint role di tabel users.
-- 2) Membuat akun petugas awal (seed) dengan password acak yang kuat.
--
-- WAJIB dijalankan di Supabase Dashboard -> SQL Editor.
-- ============================================================================

-- --- 1) Izinkan role 'petugas' -------------------------------------------------
alter table public.users
  drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check check (role in ('admin', 'petugas', 'siswa'));

-- --- 2) Seed akun petugas --------------------------------------------------------
-- Username  : petugas1
-- Password  : Pn3IqoU5e-Ienb!p8   (<-- GANTI bila perlu, lalu hash ulang)
-- Role      : petugas
-- --------------------------------------------------------------------------------
insert into public.users (username, nama_lengkap, password_hash, role, kelas, no_induk)
values (
  'petugas1',
  'Petugas Perpustakaan',
  '$2b$10$.gt5HTXyDJHv3cSswU/4DeARrULi/NG9fK4fvyv/u.p4WPei60Ly.',
  'petugas',
  null,
  null
)
on conflict (username) do nothing;
