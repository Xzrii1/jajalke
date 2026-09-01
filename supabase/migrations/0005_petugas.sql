-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0005: tambah role 'petugas' (mini-admin)
-- ============================================================================
-- Menambah nilai 'petugas' pada constraint role di tabel users.
-- WAJIB dijalankan di Supabase Dashboard -> SQL Editor sebelum login role
-- "Petugas" bisa digunakan (kalau belum, insert user role=petugas akan gagal).
-- ============================================================================

alter table public.users
  drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check check (role in ('admin', 'petugas', 'siswa'));
