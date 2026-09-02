-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0009: pengaturan aplikasi (key-value)
--
-- Menyimpan nilai-nilai pengaturan aplikasi yang bisa diubah dari dashboard
-- admin, misalnya tarif denda keterlambatan per hari.
--
-- WAJIB dijalankan di Supabase Dashboard -> SQL Editor.
-- ============================================================================
create table if not exists public.pengaturan (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  deskripsi text,
  updated_at timestamptz not null default now()
);

comment on table public.pengaturan is 'Pengaturan aplikasi (key-value)';
comment on column public.pengaturan.key is 'Kunci pengaturan, contoh denda_per_hari';
comment on column public.pengaturan.value is 'Nilai pengaturan (disimpan sebagai teks)';

insert into public.pengaturan (key, value, deskripsi)
values ('denda_per_hari', '1000', 'Tarif denda keterlambatan pengembalian buku per hari (Rupiah)')
on conflict (key) do nothing;

drop trigger if exists trg_pengaturan_updated_at on public.pengaturan;
create trigger trg_pengaturan_updated_at
  before update on public.pengaturan
  for each row
  execute function public.set_updated_at();

alter table public.pengaturan disable row level security;