-- ============================================================================
-- SEED DATA AWAAL (opsional, untuk pengujian)
-- Jalankan setelah migration 0001_init.sql.
--
-- CATATAN: Akun admin TIDAK dibuat di sini karena password-nya di-hash
-- dengan bcrypt di dalam script `npm run seed:admin` (membaca env
-- ADMIN_SEED_USERNAME & ADMIN_SEED_PASSWORD). Jangan simpan password
-- plaintext maupun hash di file SQL yang ikut masuk git.
-- ============================================================================

-- Contoh data buku
insert into public.buku (judul, penulis, penerbit, tahun_terbit, isbn, kategori, stok, deskripsi) values
  ('Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, '9789793062792', 'Fiksi', 5, 'Novel tentang perjuangan anak-anak Belitung bersekolah.'),
  ('Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, '9789799731234', 'Fiksi', 3, 'Novel sejarah tetralogi Buru.'),
  ('Fisika SMA Kelas 10', 'Tim Penyusun', 'Erlangga', 2021, '9786022988099', 'Pelajaran', 8, 'Buku pelajaran fisika kurikulum merdeka.'),
  ('Matematika Wajib Kelas 11', 'Retno S. Sari', 'Yudhistira', 2020, '9789790193668', 'Pelajaran', 6, 'Buku pelajaran matematika SMA.'),
  ('Bumi', 'Tere Liye', 'Gramedia Pustaka Utama', 2014, '9786020301029', 'Fiksi', 4, 'Novel petualangan berlatar dunia paralel.'),
  ('Atomic Habits', 'James Clear', 'Gramedia Pustaka Utama', 2019, '9786020633182', 'Non-Fiksi', 7, 'Membangun kebiasaan kecil untuk hasil besar.'),
  ('Komik Naruto Vol. 1', 'Masashi Kishimoto', 'Elex Media Komputindo', 2000, '9789792088636', 'Komik', 10, 'Komik ninja populer.'),
  ('Bahasa Indonesia Kelas 12', 'Tim Edukatif', 'Kemendikbud', 2022, '9786022820000', 'Pelajaran', 4, 'Buku teks bahasa Indonesia.')
on conflict do nothing;