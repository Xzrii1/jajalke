-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0002: kolom foto sampul (cover) pada tabel buku
--
-- Cara menjalankan: jalankan isi file ini di Supabase Dashboard -> SQL Editor.
-- ============================================================================

alter table public.buku
  add column if not exists cover_url text;

comment on column public.buku.cover_url is 'URL foto/gambar sampul buku';
