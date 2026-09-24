-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0011: seed jam operasional perpustakaan (opsional)
--
-- Mengisi nilai default jam operasional, disimpan sebagai JSON pada tabel
-- pengaturan (key 'jam_operasional'). Opsional: bila dilewati, aplikasi tetap
-- berjalan dan petugas bisa mengatur jam dari dashboard.
--
-- Format JSON: { <hari>: { "buka": "HH:MM", "tutup": "HH:MM" }, ... }
-- Hari yang libur tidak memiliki kunci (contoh: 'minggu' tidak disertakan).
-- ============================================================================
insert into public.pengaturan (key, value, deskripsi)
values (
  'jam_operasional',
  '{"senin":{"buka":"08:00","tutup":"16:00"},"selasa":{"buka":"08:00","tutup":"16:00"},"rabu":{"buka":"08:00","tutup":"16:00"},"kamis":{"buka":"08:00","tutup":"16:00"},"jumat":{"buka":"08:00","tutup":"16:00"},"sabtu":{"buka":"08:00","tutup":"12:00"}}',
  'Jam operasional perpustakaan per hari (senin-sabtu, minggu libur)'
)
on conflict (key) do nothing;