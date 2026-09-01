-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0007: tabel ulasan (komentar + rating bintang) buku
--
-- Aturan: hanya siswa yang sudah meminjam buku tersebut (status transaksi
-- 'dipinjam' / 'terlambat' / 'dikembalikan') yang boleh memberi rating &
-- komentar. CONSTRAINT unique (user_id, buku_id) memastikan satu siswa hanya
-- punya satu ulasan per buku; mengulang berarti memperbarui ulasan lama.
--
-- WAJIB dijalankan di Supabase Dashboard -> SQL Editor.
-- ============================================================================
create table if not exists public.ulasan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  buku_id uuid not null references public.buku (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  komentar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ulasan_unique_user_buku unique (user_id, buku_id)
);

comment on table public.ulasan is 'Komentar dan rating bintang untuk buku';
comment on column public.ulasan.rating is 'Rating bintang 1-5';
comment on column public.ulasan.komentar is 'Komentar/tulisan ulasan (opsional)';

create index if not exists idx_ulasan_buku on public.ulasan (buku_id);
create index if not exists idx_ulasan_user on public.ulasan (user_id);

-- Trigger update otomatis kolom updated_at
drop trigger if exists trg_ulasan_updated_at on public.ulasan;
create trigger trg_ulasan_updated_at
  before update on public.ulasan
  for each row
  execute function public.set_updated_at();

-- Keamanan konsisten dengan tabel lain: RLS nonaktif
alter table public.ulasan disable row level security;
