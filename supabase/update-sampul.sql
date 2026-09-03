-- ============================================================================
-- UPDATE SAMPUL BUKU
-- Sumber: Open Library (covers.openlibrary.org)
-- Semua URL di bawah sudah DI-VERIFIKASI mengembalikan HTTP 200 (gambar nyata).
-- Cocokkan per judul (ilike) sehingga aman terhadap perbedaan ISBN di database.
-- Buku yang tidak ditemukan sampul publik dibiarkan kosong collapse
-- (aplikasi otomatis menampilkan placeholder ikon buku).
-- ============================================================================

-- Laskar Pelangi - Andrea Hirata (Open Library cover id 7079796)
update public.buku set cover_url = 'https://covers.openlibrary.org/b/id/7079796-L.jpg'
where judul ilike 'Laskar Pelangi' and cover_url is null;

-- Bumi Manusia - Pramoedya Ananta Toer (Open Library cover id 6643692)
update public.buku set cover_url = 'https://covers.openlibrary.org/b/id/6643692-L.jpg'
where judul ilike 'Bumi Manusia' and cover_url is null;

-- Bumi - Tere Liye (Open Library cover id 12810708)
update public.buku set cover_url = 'https://covers.openlibrary.org/b/id/12810708-L.jpg'
where judul ilike 'Bumi' and cover_url is null;

-- Atomic Habits - James Clear (Open Library cover id 12539702)
update public.buku set cover_url = 'https://covers.openlibrary.org/b/id/12539702-L.jpg'
where judul ilike 'Atomic Habits' and cover_url is null;

-- Komik Naruto Vol. 1 - Masashi Kishimoto (Open Library cover id 1020779)
update public.buku set cover_url = 'https://covers.openlibrary.org/b/id/1020779-L.jpg'
where (judul ilike 'Komik Naruto%' or judul ilike '%Naruto Vol. 1%') and cover_url is null;

-- ============================================================================
-- Selesai. Jalankan di Supabase SQL Editor.
-- Catatan: buku pelajaran (Fisika SMA, Matematika Wajib, Bahasa Indonesia)
-- tidak disertakan karena tidak ditemukan sampul publik yang valid.
-- ============================================================================
