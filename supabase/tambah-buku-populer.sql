-- ============================================================================
-- TAMBAH BUKU POPULER INDONESIA (dari Open Library, cover terverifikasi HTTP 200)
-- Anti-dobel: hanya insert jika judul (case-insensitive, persis) belum ada di tabel buku.
-- Jalankan di Supabase SQL Editor.
-- ============================================================================


insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Sang Penandai', 'Tere Liye', 'Serambi', 2006, 'Fiksi', 3, 'Novel misteri pertama dari serial Dunia Paralel Tere Liye.', 'https://covers.openlibrary.org/b/id/5335215-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Sang Penandai');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Cinta dalam Gelas', 'Andrea Hirata', 'Mizan', 2010, 'Fiksi', 3, 'Novel Andrea Hirata tentang cinta dan perjuangan hidup.', 'https://covers.openlibrary.org/b/id/12777756-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Cinta dalam Gelas');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Sang Pemimpi', 'Andrea Hirata', 'Bentang', 2006, 'Fiksi', 3, 'Kisah Ikal, Arai, dan Jimbron mengejar mimpi menjadi orang sukses.', 'https://covers.openlibrary.org/b/id/15218349-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Sang Pemimpi');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Maryamah Karpov', 'Andrea Hirata', 'Bentang', 2008, 'Fiksi', 3, 'Penutup tetralogi Laskar Pelangi tentang perjalanan Ikal.', 'https://covers.openlibrary.org/b/id/9679890-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Maryamah Karpov');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Anak Semua Bangsa', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, 'Fiksi', 3, 'Jilid kedua tetralogi Buru, lanjutan Bumi Manusia.', 'https://covers.openlibrary.org/b/id/6635926-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Anak Semua Bangsa');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Rumah Kaca', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1988, 'Fiksi', 3, 'Jilid keempat tetralogi Buru.', 'https://covers.openlibrary.org/b/id/3960375-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Rumah Kaca');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Perburuan', 'Pramoedya Ananta Toer', 'Gramedia Pustaka Utama', 1949, 'Fiksi', 3, 'Novel Pramoedya tentang gerilya dan perburuan sebelum kemerdekaan.', 'https://covers.openlibrary.org/b/id/12713454-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Perburuan');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Gadis Pantai', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1987, 'Fiksi', 3, 'Kisah seorang gadis pantai yang dinikahkan dengan seorang priyayi.', 'https://covers.openlibrary.org/b/id/13810472-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Gadis Pantai');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Arus Balik', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1995, 'Fiksi', 3, 'Novel sejarah tentang keruntuhan Majapahit dan datangnya bangsa asing.', 'https://covers.openlibrary.org/b/id/3842927-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Arus Balik');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Hujan', 'Tere Liye', 'Gramedia Pustaka Utama', 2016, 'Fiksi', 3, 'Novel Tere Liye tentang persahabatan, cinta, dan bencana.', 'https://covers.openlibrary.org/b/id/10872657-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Hujan');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Supernova', 'Dee Lestari', 'Truedee Books', 2001, 'Fiksi', 3, 'Novel pertama seri Supernova tentang sains, cinta, dan kehidupan.', 'https://covers.openlibrary.org/b/id/10000969-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Supernova');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Cantik Itu Luka', 'Eka Kurniawan', 'Gramedia Pustaka Utama', 2002, 'Fiksi', 3, 'Novel Eka Kurniawan yang penuh kekerasan, seks, dan sejarah Indonesia.', 'https://covers.openlibrary.org/b/id/13903116-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Cantik Itu Luka');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Lelaki Harimau', 'Eka Kurniawan', 'Gramedia Pustaka Utama', 2004, 'Fiksi', 3, 'Novel tentang Margio, lelaki yang dapat berubah menjadi harimau.', 'https://covers.openlibrary.org/b/id/9084044-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Lelaki Harimau');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Seperti Dendam Rindu Harus Dibayar Tuntas', 'Eka Kurniawan', 'Gramedia Pustaka Utama', 2014, 'Fiksi', 3, 'Novel Eka Kurniawan tentang balas dendam namun mustahil.', 'https://covers.openlibrary.org/b/id/13443800-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Seperti Dendam Rindu Harus Dibayar Tuntas');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Pulang', 'Tere Liye', 'Sabak Grip Nusantara', 2015, 'Fiksi', 3, 'Novel Tere Liye tentang perjalanan seorang agen rahasia.', 'https://covers.openlibrary.org/b/id/12905869-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Pulang');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Pergi', 'Tere Liye', 'Republika', 2018, 'Fiksi', 3, 'Sekuel Pulang, kisah Bujang menelusuri masa lalunya.', 'https://covers.openlibrary.org/b/id/12905873-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Pergi');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Rindu', 'Tere Liye', 'Republika', 2014, 'Fiksi', 3, 'Novel Tere Liye tentang perjalanan haji seorang guru dan muridnya.', 'https://covers.openlibrary.org/b/id/14541663-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Rindu');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Nebula', 'Tere Liye', 'Gramedia Pustaka Utama', 2020, 'Fiksi', 3, 'Novel Tere Liye tentang misteri hingga ujung galaksi.', 'https://covers.openlibrary.org/b/id/14541781-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Nebula');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Pukat', 'Tere Liye', 'Republika', 2010, 'Fiksi', 3, 'Kisah masa kecil Pukat dan keluarganya di sebuah desa.', 'https://covers.openlibrary.org/b/id/9321023-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Pukat');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Ronggeng Dukuh Paruk', 'Ahmad Tohari', 'Gramedia Pustaka Utama', 1982, 'Fiksi', 3, 'Kisah Srintil dan Rasus di tengah kehidupan ronggeng dan desa yang gelap.', 'https://covers.openlibrary.org/b/id/4317176-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Ronggeng Dukuh Paruk');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Tentang Kamu', 'Tere Liye', 'Republica', 2016, 'Fiksi', 3, 'Novel Tere Liye tentang perjuangan sebuah keluarga lintas generasi.', 'https://covers.openlibrary.org/b/id/14541664-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Tentang Kamu');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Negeri 5 Menara', 'Ahmad Fuadi', 'Gramedia Pustaka Utama', 2009, 'Fiksi', 3, 'Kisah enam sahabat berjuang mengejar mimpi dari sebuah pesantren.', 'https://covers.openlibrary.org/b/id/14303993-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Negeri 5 Menara');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Tanah Para Bandit', 'Tere Liye', 'Sabak Grip Nusantara', 2023, 'Fiksi', 3, 'Novel Tere Liye kumpulan kisah tentang keadilan dan kesetaraan.', 'https://covers.openlibrary.org/b/id/14542361-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Tanah Para Bandit');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Bulan', 'Tere Liye', 'Gramedia Pustaka Utama', 2015, 'Fiksi', 3, 'Sekuel serial Bumi, petualangan Raib, Seli, dan Ali.', 'https://covers.openlibrary.org/b/id/14640031-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Bulan');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Matahari', 'Tere Liye', 'Gramedia Pustaka Utama', 2016, 'Fiksi', 3, 'Kelanjutan petualangan Raib dan kawan-kawan di dunia paralel.', 'https://covers.openlibrary.org/b/id/10956534-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Matahari');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Bintang', 'Tere Liye', 'Gramedia Pustaka Utama', 2017, 'Fiksi', 3, 'Petualangan Raib, Seli, dan Ali mencari Ily dan Miss Selena.', 'https://covers.openlibrary.org/b/id/10976102-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Bintang');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Matahari Minor', 'Tere Liye', 'Sabak Grip Nusantara', 2022, 'Fiksi', 3, 'Novel Tere Liye tentang pencarian jati diri.', 'https://covers.openlibrary.org/b/id/14541800-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Matahari Minor');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Pulang-Pergi', 'Tere Liye', 'Sabak Grip Nusantara', 2021, 'Fiksi', 3, 'Kisah persahabatan dan konflik keluarga dalam novel Tere Liye.', 'https://covers.openlibrary.org/b/id/14541785-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Pulang-Pergi');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Kerumunan Terakhir', 'Okky Madasari', 'Gramedia Pustaka Utama', 2016, 'Fiksi', 3, 'Novel Okky Madasari tentang hiruk pikuk kehidupan setelah tragedi.', 'https://covers.openlibrary.org/b/id/11536970-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Kerumunan Terakhir');

-- Selesai. Jumlah baris yang benar-benar ter-insert = jumlah judul baru (buku yang sama tidak dobel).