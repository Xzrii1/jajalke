-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0006: alur persetujuan peminjaman & pengembalian
--
-- Status tambahan:
--   - 'pending'          : siswa mengajukan peminjaman (stok BELUM berkurang).
--   - 'ditolak'          : permintaan peminjaman ditolak (stok tidak berubah).
--   - 'menunggu_kembali' : siswa mengajukan pengembalian (stok BELUM kembali).
--
-- Stok baru berkurang saat peminjaman disetujui (-> 'dipinjam'), dan baru
-- kembali saat pengembalian disetujui (-> 'dikembalikan'/'terlambat').
--
-- WAJIB dijalankan di Supabase Dashboard -> SQL Editor.
-- ============================================================================
alter table public.transaksi
  drop constraint if exists transaksi_status_check;

alter table public.transaksi
  add constraint transaksi_status_check
  check (status in ('pending', 'dipinjam', 'dikembalikan', 'terlambat', 'ditolak', 'menunggu_kembali'));
