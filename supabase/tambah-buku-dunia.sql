-- ============================================================================
-- TAMBAH BUKU POPULER DUNIA (Open Library, cover terverifikasi HTTP 200)
-- Anti-dobel: hanya insert jika judul (case-insensitive, persis) belum ada.
-- Jalankan di Supabase SQL Editor.
-- ============================================================================

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'To Kill a Mockingbird', 'Harper Lee', '', 1960, 'Fiksi', 3, 'Novel klasik tentang keadilan rasial di Amerika melalui mata anak-anak.', 'https://covers.openlibrary.org/b/id/14351077-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'To Kill a Mockingbird');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Animal Farm', 'George Orwell', '', 1945, 'Fiksi', 3, 'Satire alegori tentang kekuasaan dan revolusi melalui binatang ternak.', 'https://covers.openlibrary.org/b/id/11261770-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Animal Farm');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Nineteen Eighty-Four', 'George Orwell', '', 1949, 'Fiksi', 3, 'Novel distopia Orwell tentang dunia yang diawasi secara totaliter.', 'https://covers.openlibrary.org/b/id/9267242-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Nineteen Eighty-Four');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Great Gatsby', 'F. Scott Fitzgerald', '', 1925, 'Fiksi', 3, 'Novel Amerika tentang mimpi, kelas sosial, dan era Jazz Age.', 'https://covers.openlibrary.org/b/id/10590366-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Great Gatsby');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Old Man and the Sea', 'Ernest Hemingway', '', 1952, 'Fiksi', 3, 'Perjuangan seorang nelayan tua melawan ikan marlin raksasa.', 'https://covers.openlibrary.org/b/id/463307-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Old Man and the Sea');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Little Prince', 'Antoine de Saint-Exupéry', '', 1943, 'Fiksi', 3, 'Kisah pangeran kecil yang penuh makna tentang persahabatan dan kehidupan.', 'https://covers.openlibrary.org/b/id/10708272-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Little Prince');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Alchemist', 'Paulo Coelho', '', 1988, 'Fiksi', 3, 'Perjalanan spiritual seorang gembala mengejar mimpinya.', 'https://covers.openlibrary.org/b/id/7414780-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Alchemist');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Charlotte''s Web', 'E. B. White', '', 1952, 'Fiksi', 3, 'Persahabatan antara anak perempuan dan seekor laba-laba.', 'https://covers.openlibrary.org/b/id/8461797-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Charlotte''s Web');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Hobbit', 'J. R. R. Tolkien', '', 1937, 'Fiksi', 3, 'Petualangan hobbit Bilbo menuju gunung penuh harta dan naga.', 'https://covers.openlibrary.org/b/id/14627509-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Hobbit');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Catcher in the Rye', 'J. D. Salinger', '', 1951, 'Fiksi', 3, 'Kisah remaja Holden Caulfield yang penuh kegelisahan dan kritik sosial.', 'https://covers.openlibrary.org/b/id/9273490-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Catcher in the Rye');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Diary of a Young Girl', 'Anne Frank', '', 1947, 'Fiksi', 3, 'Diary gadis Yahudi Anne Frank saat bersembunyi dari Nazi.', 'https://covers.openlibrary.org/b/id/8584021-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Diary of a Young Girl');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Charlie and the Chocolate Factory', 'Roald Dahl', '', 1964, 'Fiksi', 3, 'Charlie memenangkan tiket emas menuju pabrik coklat Willy Wonka.', 'https://covers.openlibrary.org/b/id/12459564-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Charlie and the Chocolate Factory');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Matilda', 'Roald Dahl', '', 1988, 'Fiksi', 3, 'Gadis jenius Matilda melawan orang tuanya dan kepala sekolah yang kejam.', 'https://covers.openlibrary.org/b/id/12889769-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Matilda');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Wonder', 'R. J. Palacio', '', 2012, 'Fiksi', 3, 'Kisah Auggie, anak dengan kelainan wajah, yang masuk sekolah umum.', 'https://covers.openlibrary.org/b/id/8223160-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Wonder');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Giver', 'Lois Lowry', '', 1993, 'Fiksi', 3, 'Dunia yang diatur tanpa pilihan, hingga seorang anak mulai bertanya.', 'https://covers.openlibrary.org/b/id/8352502-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Giver');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Harry Potter and the Philosopher''s Stone', 'J. K. Rowling', '', 1997, 'Fiksi', 3, 'Harry Potter menemukan dunia sihir dan sekolah Hogwarts.', 'https://covers.openlibrary.org/b/id/15155833-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Harry Potter and the Philosopher''s Stone');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Harry Potter and the Chamber of Secrets', 'J. K. Rowling', '', 1998, 'Fiksi', 3, 'Harry kembali ke Hogwarts menghadapi misteri Ruang Rahasia.', 'https://covers.openlibrary.org/b/id/15158664-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Harry Potter and the Chamber of Secrets');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Hunger Games', 'Suzanne Collins', '', 2008, 'Fiksi', 3, 'Katniss berjuang hidup dalam Hunger Games yang mematikan.', 'https://covers.openlibrary.org/b/id/12646537-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Hunger Games');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Divergent', 'Veronica Roth', '', 2011, 'Fiksi', 3, 'Beatrice memilih faksi dan mengguncang tatanan dunia.', 'https://covers.openlibrary.org/b/id/13274634-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Divergent');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Lightning Thief', 'Rick Riordan', '', 2005, 'Fiksi', 3, 'Percy Jackson, anak setengah dewa, memulai misi menyelamatkan dunia.', 'https://covers.openlibrary.org/b/id/7239831-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Lightning Thief');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'A Wrinkle in Time', 'Madeleine L''Engle', '', 1962, 'Fiksi', 3, 'Petualangan waktu Meg mencari ayahnya yang hilang.', 'https://covers.openlibrary.org/b/id/8709146-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'A Wrinkle in Time');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Holes', 'Louis Sachar', '', 1998, 'Fiksi', 3, 'Stanley dihukum ke kamp gurun dan mengungkap rahasia.', 'https://covers.openlibrary.org/b/id/19797-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Holes');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Bridge to Terabithia', 'Katherine Paterson', '', 1977, 'Fiksi', 3, 'Persahabatan Jesse dan Leslie di kerajaan imajinasi Terabithia.', 'https://covers.openlibrary.org/b/id/12627341-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Bridge to Terabithia');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Number the Stars', 'Lois Lowry', '', 1989, 'Fiksi', 3, 'Gadis Denmark Annemarie membantu menyelamatkan sahabat Yahudinya.', 'https://covers.openlibrary.org/b/id/13249599-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Number the Stars');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Esperanza Rising', 'Pam Muñoz Ryan', '', 2000, 'Fiksi', 3, 'Imigran Meksiko Esperanza kehilangan kemewahan dan menemukan kekuatan baru.', 'https://covers.openlibrary.org/b/id/275937-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Esperanza Rising');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Because of Winn-Dixie', 'Kate DiCamillo', '', 2000, 'Fiksi', 3, 'Gadis pemalu Opal menemukan anjing bernama Winn-Dixie.', 'https://covers.openlibrary.org/b/id/2241356-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Because of Winn-Dixie');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Tale of Despereaux', 'Kate DiCamillo', '', 2003, 'Fiksi', 3, 'Tikus bernama Despereaux memberanikan diri menyelamatkan seorang putri.', 'https://covers.openlibrary.org/b/id/541143-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Tale of Despereaux');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'James and the Giant Peach', 'Roald Dahl', '', 1961, 'Fiksi', 3, 'James menaiki buah persik raksasa bersama serangga-serangga.', 'https://covers.openlibrary.org/b/id/8252454-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'James and the Giant Peach');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Stuart Little', 'E. B. White', '', 1945, 'Fiksi', 3, 'Petualangan seekor tikus bernama Stuart Little.', 'https://covers.openlibrary.org/b/id/10522876-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Stuart Little');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Lion, the Witch and the Wardrobe', 'C. S. Lewis', '', 1950, 'Fiksi', 3, 'Saudara Pevensie masuk lemari menuju Negeri Narnia.', 'https://covers.openlibrary.org/b/id/8441376-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Lion, the Witch and the Wardrobe');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Peter Pan', 'J. M. Barrie', '', 1911, 'Fiksi', 3, 'Peter Pan mengajak Wendy terbang ke Negeri Neverland.', 'https://covers.openlibrary.org/b/id/8237052-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Peter Pan');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Alice''s Adventures in Wonderland', 'Lewis Carroll', '', 1865, 'Fiksi', 3, 'Alice mengejar kelinci putih ke dunia ajaib Wonderland.', 'https://covers.openlibrary.org/b/id/10527843-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Alice''s Adventures in Wonderland');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Adventures of Pinocchio', 'Carlo Collodi', '', 1883, 'Fiksi', 3, 'Boneka kayu Pinokio yang hidungnya tumbuh saat berbohong.', 'https://covers.openlibrary.org/b/id/8597022-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Adventures of Pinocchio');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Jungle Book', 'Rudyard Kipling', '', 1894, 'Fiksi', 3, 'Mowgli anak hutan yang dibesarkan serigala di dalam rimba.', 'https://covers.openlibrary.org/b/id/3344204-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Jungle Book');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Treasure Island', 'Robert Louis Stevenson', '', 1883, 'Fiksi', 3, 'Jim Hawkins berlayar mencari harta karun bajak laut.', 'https://covers.openlibrary.org/b/id/13859660-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Treasure Island');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Little Women', 'Louisa May Alcott', '', 1868, 'Fiksi', 3, 'Kisah empat saudara perempuan March di masa perang.', 'https://covers.openlibrary.org/b/id/8775559-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Little Women');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Secret Garden', 'Frances Hodgson Burnett', '', 1911, 'Fiksi', 3, 'Mary menemukan taman rahasia yang mengubah hidupnya.', 'https://covers.openlibrary.org/b/id/12622062-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Secret Garden');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Black Beauty', 'Anna Sewell', '', 1877, 'Fiksi', 3, 'Kisah seekor kuda hitam bernama Black Beauty.', 'https://covers.openlibrary.org/b/id/14770679-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Black Beauty');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Call of the Wild', 'Jack London', '', 1903, 'Fiksi', 3, 'Anjing Buck kembali ke alam liar menjadi pemimpin serigala.', 'https://covers.openlibrary.org/b/id/12393037-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Call of the Wild');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'White Fang', 'Jack London', '', 1906, 'Fiksi', 3, 'Serigala White Fang menjinakkan diri dalam kehidupan manusia.', 'https://covers.openlibrary.org/b/id/8236920-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'White Fang');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Moby Dick', 'Herman Melville', '', 1851, 'Fiksi', 3, 'Kapten Ahab memburu paus putih Moby Dick.', 'https://covers.openlibrary.org/b/id/10544254-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Moby Dick');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Adventures of Tom Sawyer', 'Mark Twain', '', 1876, 'Fiksi', 3, 'Petualangan Tom Sawyer di sepanjang Sungai Mississippi.', 'https://covers.openlibrary.org/b/id/12043351-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Adventures of Tom Sawyer');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Adventures of Huckleberry Finn', 'Mark Twain', '', 1884, 'Fiksi', 3, 'Huck Finn dan Jim berlayar mencari kehidupan bebas.', 'https://covers.openlibrary.org/b/id/8157718-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Adventures of Huckleberry Finn');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Oliver Twist', 'Charles Dickens', '', 1837, 'Fiksi', 3, 'Anak yatim Oliver Twist di tengah jalanan London.', 'https://covers.openlibrary.org/b/id/13300802-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Oliver Twist');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'A Christmas Carol', 'Charles Dickens', '', 1843, 'Fiksi', 3, 'Scrooge dihantui tiga roh pada malam Natal.', 'https://covers.openlibrary.org/b/id/12875748-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'A Christmas Carol');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Great Expectations', 'Charles Dickens', '', 1861, 'Fiksi', 3, 'Pip mengejar cita-cita menjadi seorang gentleman.', 'https://covers.openlibrary.org/b/id/13322313-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Great Expectations');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Les Misérables', 'Victor Hugo', '', 1862, 'Fiksi', 3, 'Jean Valjean berjuang menebus kesalahan di Prancis.', 'https://covers.openlibrary.org/b/id/12721865-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Les Misérables');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Hunchback of Notre-Dame', 'Victor Hugo', '', 1831, 'Fiksi', 3, 'Kisah Quasimodo si bungkuk dari Notre-Dame.', 'https://covers.openlibrary.org/b/id/2626880-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Hunchback of Notre-Dame');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Around the World in Eighty Days', 'Jules Verne', '', 1872, 'Fiksi', 3, 'Phileas Fogg berkeliling dunia dalam delapan puluh hari.', 'https://covers.openlibrary.org/b/id/6976035-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Around the World in Eighty Days');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Twenty Thousand Leagues Under the Sea', 'Jules Verne', '', 1870, 'Fiksi', 3, 'Kapten Nemo menjelajahi kedalaman lautan.', 'https://covers.openlibrary.org/b/id/6573517-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Twenty Thousand Leagues Under the Sea');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Journey to the Center of the Earth', 'Jules Verne', '', 1864, 'Fiksi', 3, 'Perjalanan ke pusat bumi oleh Axel dan pamannya.', 'https://covers.openlibrary.org/b/id/5890987-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Journey to the Center of the Earth');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Frankenstein', 'Mary Shelley', '', 1818, 'Fiksi', 3, 'Ilmuwan Victor menciptakan makhluk hidup dari mayat.', 'https://covers.openlibrary.org/b/id/12356249-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Frankenstein');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Dracula', 'Bram Stoker', '', 1897, 'Fiksi', 3, 'Kisah vampir Dracula dan pemburunya.', 'https://covers.openlibrary.org/b/id/12216503-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Dracula');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Strange Case of Dr. Jekyll and Mr. Hyde', 'Robert Louis Stevenson', '', 1886, 'Fiksi', 3, 'Dokter Jekyll berubah menjadi Mr. Hyde yang jahat.', 'https://covers.openlibrary.org/b/id/295773-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Strange Case of Dr. Jekyll and Mr. Hyde');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'A Study in Scarlet', 'Arthur Conan Doyle', '', 1887, 'Fiksi', 3, 'Sherlock Holmes pertama kali menangani kasus misterius.', 'https://covers.openlibrary.org/b/id/13405534-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'A Study in Scarlet');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Hound of the Baskervilles', 'Arthur Conan Doyle', '', 1902, 'Fiksi', 3, 'Sherlock menyelidiki kutukan anjing di Baskerville.', 'https://covers.openlibrary.org/b/id/8063264-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Hound of the Baskervilles');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Pride and Prejudice', 'Jane Austen', '', 1813, 'Fiksi', 3, 'Elizabeth Bennet dan Mr. Darcy dalam novel cinta klasik.', 'https://covers.openlibrary.org/b/id/14348537-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Pride and Prejudice');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Sense and Sensibility', 'Jane Austen', '', 1811, 'Fiksi', 3, 'Kisah dua saudari kakak-beradik Dashwood mencari cinta.', 'https://covers.openlibrary.org/b/id/9278292-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Sense and Sensibility');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Jane Eyre', 'Charlotte Brontë', '', 1847, 'Fiksi', 3, 'Jane Eyre yang yatim bertahan mengejar kemandirian dan cinta.', 'https://covers.openlibrary.org/b/id/8235363-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Jane Eyre');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'Wuthering Heights', 'Emily Brontë', '', 1847, 'Fiksi', 3, 'Cinta penuh badai antara Heathcliff dan Catherine.', 'https://covers.openlibrary.org/b/id/12818862-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'Wuthering Heights');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Time Machine', 'H. G. Wells', '', 1895, 'Fiksi', 3, 'Penjelajah waktu melompat ke masa depan yang jauh.', 'https://covers.openlibrary.org/b/id/9009316-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Time Machine');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The Invisible Man', 'H. G. Wells', '', 1897, 'Fiksi', 3, 'Seorang ilmuwan menjadi tak terlihat dan hilang kendali.', 'https://covers.openlibrary.org/b/id/6419199-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The Invisible Man');

insert into public.buku (judul, penulis, penerbit, tahun_terbit, kategori, stok, deskripsi, cover_url)
select 'The War of the Worlds', 'H. G. Wells', '', 1898, 'Fiksi', 3, 'Invasi makhluk Mars ke bumi.', 'https://covers.openlibrary.org/b/id/36314-L.jpg'
where not exists (select 1 from public.buku b where b.judul ilike 'The War of the Worlds');

-- Selesai.