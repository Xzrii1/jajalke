-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0001: schema awal (users, buku, transaksi)
--
-- Cara menjalankan: jalankan isi file ini di Supabase Dashboard -> SQL Editor.
-- Sesuaikan password admin di file seed/seed-admin.sql sebelum menjalankan.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- users: admin & siswa dalam satu tabel, dibedakan kolom role
-- ----------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  nama_lengkap text not null,
  role text not null check (role in ('admin', 'siswa')),
  kelas text,
  no_induk text,
  created_at timestamptz not null default now()
);

comment on table public.users is 'Pengguna aplikasi: admin dan siswa/anggota';
comment on column public.users.password_hash is 'Hash bcrypt dari password (tidak disimpan plaintext)';

create index if not exists idx_users_role on public.users (role);
create index if not exists idx_users_nama on public.users (nama_lengkap);

-- ----------------------------------------------------------------------------
-- buku: data buku perpustakaan
-- ----------------------------------------------------------------------------
create table if not exists public.buku (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  penulis text,
  penerbit text,
  tahun_terbit int,
  isbn text,
  kategori text,
  stok int not null default 0 check (stok >= 0),
  deskripsi text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.buku is 'Koleksi buku perpustakaan';
comment on column public.buku.stok is 'Jumlah eksemplar tersedia untuk dipinjam';

create index if not exists idx_buku_judul on public.buku (judul);
create index if not exists idx_buku_kategori on public.buku (kategori);
create index if not exists idx_buku_penulis on public.buku (penulis);

-- ----------------------------------------------------------------------------
-- transaksi: peminjaman & pengembalian buku
-- ----------------------------------------------------------------------------
create table if not exists public.transaksi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  buku_id uuid not null references public.buku (id) on delete cascade,
  tanggal_pinjam date not null default current_date,
  tanggal_jatuh_tempo date not null,
  tanggal_kembali date,
  status text not null default 'dipinjam' check (status in ('dipinjam', 'dikembalikan', 'terlambat')),
  denda int not null default 0 check (denda >= 0),
  created_at timestamptz not null default now()
);

comment on table public.transaksi is 'Catatan peminjaman dan pengembalian buku';
comment on column public.transaksi.tanggal_kembali is 'NULL = masih dipinjam';
comment on column public.transaksi.denda is 'Denda keterlambatan dalam Rupiah';

create index if not exists idx_transaksi_user on public.transaksi (user_id);
create index if not exists idx_transaksi_buku on public.transaksi (buku_id);
create index if not exists idx_transaksi_status on public.transaksi (status);

-- ----------------------------------------------------------------------------
-- Fungsi kecil untuk update otomatis kolom updated_at pada tabel buku
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_buku_updated_at on public.buku;
create trigger trg_buku_updated_at
  before update on public.buku
  for each row
  execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Keamanan: RLS dinonaktifkan supaya aplikasi (via Supabase anon key) dapat
-- melakukan operasi langsung. Project sekolah — tidak ada data sensitif.
-- ----------------------------------------------------------------------------
alter table public.users disable row level security;
alter table public.buku disable row level security;
alter table public.transaksi disable row level security;