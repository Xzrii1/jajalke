-- ============================================================================
-- Aplikasi Perpustakaan Sekolah Digital
-- Migration 0004: ROTASI PASSWORD default akun seed
-- ============================================================================
--
-- Alasan: karena RLS sempat nonaktif (P0), password_hash semua user sempat
-- bisa dibaca publik. Password default yang lemah (admin/admin123,
-- siswa1/siswa123) sangat mudah di-crack offline. Migration ini mengganti
-- hash dengan password acak yang kuat.
--
-- Pasang password sesuai kebutuhan (ganti nilai di bawah sebelum Run).
-- ============================================================================

-- Admin: gunakan password acak yang kuat (contoh di bawah, GANTI bila perlu).
update public.users
set password_hash = '$2b$10$pVf4eh0/wzCu7LnjGFi6PeCb9HZJJOpF41IfoFTbeTnWAAxU0Or/u'
where username = 'admin'
  and role = 'admin';

-- Akun siswa demo (opsional, hapus baris ini jika tidak dipakai).
update public.users
set password_hash = '$2b$10$95pRjQtaRknRJO.Ea9IKi.zYMlX3MtvMnUjTssSJ.CfcqSu/uD6f6'
where username = 'siswa1';
