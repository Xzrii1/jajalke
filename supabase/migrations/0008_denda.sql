-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0008: manajemen pembayaran denda
--
-- 1) Tambah kolom denda_bayar pada transaksi (jumlah denda yang sudah dibayar).
--    Sisa denda yang belum dibayar = denda - denda_bayar.
--    Denda TETAP tercatat selama belum dibayar; tapi berhenti bertambah
--    setelah buku dikembalikan (status sudah final 'terlambat'/'dikembalikan').
-- 2) Tabel pembayaran_denda: riwayat pembayaran transaksi (metode QRIS fiktif).
--
-- WAJIB dijalankan di Supabase Dashboard -> SQL Editor.
-- ============================================================================

-- --- 1) Kolom denda_bayar pada transaksi -------------------------------------
alter table public.transaksi
  add column if not exists denda_bayar int not null default 0;

-- --- 2) Tabel riwayat pembayaran denda -----------------------------------------
create table if not exists public.pembayaran_denda (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  transaksi_id uuid not null references public.transaksi (id) on delete cascade,
  jumlah int not null check (jumlah >= 0),
  metode text not null default 'qris' check (metode in ('qris')),
  status text not null default 'sukses' check (status in ('sukses')),
  created_at timestamptz not null default now()
);

comment on table public.pembayaran_denda is 'Riwayat pembayaran denda keterlambatan (QRIS fiktif untuk demo)';
comment on column public.pembayaran_denda.jumlah is 'Jumlah denda yang dibayar dalam Rupiah';

create index if not exists idx_pembayaran_user on public.pembayaran_denda (user_id);
create index if not exists idx_pembayaran_trx on public.pembayaran_denda (transaksi_id);

alter table public.pembayaran_denda disable row level security;

-- --- Sinkronkan denda_bayar dengan riwayat (jika ada data lama) --------------
update public.transaksi t
set denda_bayar = coalesce((
  select sum(p.jumlah) from public.pembayaran_denda p where p.transaksi_id = t.id
), 0);
