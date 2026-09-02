-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0010: kondisi fisik buku
--
-- Menambah kolom 'kondisi' pada tabel buku (kondisi fisik buku) yang diatur
-- oleh petugas perpustakaan: 'baru', 'baik', 'bekas', 'rusak'.
--
-- WAJIB dijalankan di Supabase Dashboard -> SQL Editor.
-- ============================================================================
alter table public.buku
  add column if not exists kondisi text not null default 'baik'
  check (kondisi in ('baru', 'baik', 'bekas', 'rusak'));

comment on column public.buku.kondisi is 'Kondisi fisik buku: baru, baik, bekas, rusak';