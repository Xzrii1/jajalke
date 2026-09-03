-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0012: permintaan bantuan (customer service) - v2
--
-- Membuat ulang fitur bantuan dari nol. Menghapus tabel versi 0011 lalu
-- membuat tabel permintaan_bantuan yang baru.
--
-- WAJIB dijalankan di Supabase Dashboard -> SQL Editor.
-- ============================================================================
drop table if exists public.permintaan_bantuan cascade;

create table if not exists public.permintaan_bantuan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  jenis text not null check (jenis in ('reset_password', 'pertanyaan', 'keluhan', 'lainnya')),
  subjek text not null,
  pesan text not null,
  status text not null default 'baru' check (status in ('baru', 'diproses', 'selesai')),
  balasan text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.permintaan_bantuan is 'Pesan bantuan dari pengguna (customer service)';
comment on column public.permintaan_bantuan.jenis is 'Jenis permintaan: reset_password, pertanyaan, keluhan, lainnya';
comment on column public.permintaan_bantuan.status is 'Status: baru, diproses, selesai';
comment on column public.permintaan_bantuan.balasan is 'Balasan dari admin/petugas (opsional)';

create index if not exists idx_bantuan_user on public.permintaan_bantuan (user_id);
create index if not exists idx_bantuan_status on public.permintaan_bantuan (status);

drop trigger if exists trg_bantuan_updated_at on public.permintaan_bantuan;
create trigger trg_bantuan_updated_at
  before update on public.permintaan_bantuan
  for each row
  execute function public.set_updated_at();

alter table public.permintaan_bantuan disable row level security;
