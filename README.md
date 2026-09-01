# Perpustakaan Sekolah Digital (jajalke)

Aplikasi web **perpustakaan sekolah digital** untuk pengelolaan **peminjaman buku** berbasis web, dengan tiga peran pengguna: **Admin** (pengelola penuh), **Petugas** (petugas perpustakaan / mini-admin), dan **Siswa** (anggota). Dibuat sebagai proyek UKK "Pengembangan Aplikasi Peminjaman Buku".

## Tech Stack

| Bagian        | Teknologi                                                  |
| ------------- | ----------------------------------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19 + TypeScript            |
| Styling       | Tailwind CSS v4                                             |
| Database      | Supabase (PostgreSQL)                                       |
| Auth/Sesi     | Custom JWT (library `jose`) dalam cookie httpOnly            |
| Password hash | `bcryptjs`                                                  |
| Hosting       | Vercel (deploy-ready)                                       |

## Keputusan Arsitektur: Auth custom, bukan Supabase Auth

Skema soal memakai **`username`** (bukan email) dan kolom `role` di satu tabel `users`. Supabase Auth hanya mendukung email/password sebagai identitas login, sehingga pemetaannya tidak natural. Karena itu dipilih:

- **Satu tabel `users`** berisi admin, petugas & siswa, dibedakan kolom `role` (`admin` / `petugas` / `siswa`).
- Login pakai `username` + `password` (dihash `bcrypt`). Password **tidak pernah** disimpan plaintext.
- Sesi berupa **JWT (HS256, 7 hari)** yang ditandatangani `AUTH_SECRET` dan disimpan di cookie `httpOnly`.
- Proteksi route dua lapis: **Proxy (`src/proxy.ts`)** untuk redirect cepat + **guard role di setiap server action/layout** (tidak hanya mengandalkan proxy).

> Akun admin **tidak** bisa self-register. Admin dibuat lewat script seed (lihat [Setup](#setup-supabase-dan-akun-admin)).

## Fitur

| Fitur                                                   | Siswa | Petugas | Admin |
| ------------------------------------------------------- | :---: | :-----: | :---: |
| Registrasi akun (siswa)                                 | ✅    | —       | —    |
| Login + pemilihan role                                  | ✅    | ✅      | ✅   |
| Dashboard + statistik                                   | ✅    | ✅      | ✅   |
| Peminjaman & pengembalian buku (transaksi sendiri)      | ✅    | ❌      | ❌   |
| CRUD Data Buku                                           | ❌    | ✅      | ✅   |
| Catat/ubah/hapus semua transaksi                        | ❌    | ✅      | ✅   |
| CRUD Kelola Anggota (**hanya siswa**)                   | ❌    | ✅      | ✅   |
| Laporan transaksi (Excel/PDF/cetak)                     | ❌    | ✅      | ✅   |
| Jam realtime (WIB) di dashboard                          | ✅    | ✅      | ✅   |
| Kelola akun admin/petugas (promosi/ubah/hapus)          | ❌    | ❌      | ✅   |
| Pencarian buku (judul/penulis/kategori/ISBN)            | ✅    | ✅      | ✅   |

Halaman:
- `/` — beranda (redirect sesuai sesi)
- `/login` — form login dengan tab pilihan role
- `/daftar` — registrasi anggota (siswa)
- `/admin/dashboard` — ringkasan jumlah buku, anggota, peminjaman aktif + grafik + jam realtime
- `/admin/buku` — CRUD data buku + pencarian
- `/admin/anggota` — CRUD kelola anggota (siswa)
- `/admin/transaksi` — CRUD semua transaksi peminjaman
- `/admin/laporan` — laporan transaksi (Excel/PDF/cetak)
- `/siswa/dashboard` — ringkasan pinjaman siswa + jam realtime
- `/siswa/buku` — daftar & pencarian buku + tombol pinjam
- `/siswa/transaksi` — riwayat pinjaman + tombol kembalikan

> `/admin/*` dapat diakses oleh **Admin** dan **Petugas**. Siswa hanya memakai `/siswa/*`.

Aturan bisnis:
- Durasi pinjam dipilih siswa: **1–30 hari** (default 7 hari) saat meminjam.
- Satu siswa hanya boleh punya **1 peminjaman aktif** per judul buku.
- Pinjam buku → `stok - 1`; kembalikan → `stok + 1` (stok tidak pernah negatif).
- Terlambat otomatis terdeteksi saat tampilkan data; denda **Rp 1.000/hari**.

## Struktur Project

```
.
├── scripts/seed-admin.mjs        # Membuat akun admin dari env
├── supabase/
│   ├── migrations/0001_init.sql        # Schema database (users, buku, transaksi)
│   ├── migrations/0002_cover.sql       # Kolom cover_url (foto sampul buku)
│   ├── migrations/0005_petugas.sql     # Izinkan + seed role petugas
│   └── seed.sql                        # Data contoh buku (opsional)
└── src/
    ├── proxy.ts                  # Proteksi route per role (JWT)
    ├── lib/                      # supabase client, session JWT, auth, utils, types
    ├── app/
    │   ├── actions/              # Server actions (auth, buku, anggota, transaksi)
    │   ├── admin/...             # Halaman admin
    │   ├── siswa/...             # Halaman siswa
    │   └── ...                   # Landing, login, daftar
    └── components/               # UI primitives + form + nav
```

## Setup Lokal

Prasyarat: Node.js ≥ 20.9 dan satu project **Supabase** (dibuat manual di [supabase.com](https://supabase.com) atau `supabase init`).

### 1. Environment variable

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```env
SUPABASE_URL=                    # Project Settings > API > Project URL
SUPABASE_ANON_KEY=               # Project Settings > API > anon public key
SUPABASE_SERVICE_ROLE_KEY=       # Service role key (khusus script seed)
AUTH_SECRET=                     # openssl rand -base64 32
ADMIN_SEED_USERNAME=admin        # username admin yang diinginkan
ADMIN_SEED_PASSWORD=Ganti123!    # password admin yang diinginkan
```

> **Jangan commit `.env.local`** (sudah di `.gitignore`). Hanya `.env.example` yang masuk repo dan tanpa isi asli.
>
> Variabel Supabase **tidak** memakai prefix `NEXT_PUBLIC_` karena seluruh akses ke database hanya terjadi lewat Server Actions (server-side). Ini menjaga URL & key tidak ikut dikirim ke browser. Untuk variabel baru di Next.js, prefix `NEXT_PUBLIC_` hanya diperlukan jika nilainya dibaca langsung di komponen **client**.

### 2. Buat schema database

Buka **Supabase Dashboard → SQL Editor**, jalankan isi `supabase/migrations/0001_init.sql`, lalu jalankan **sesuai urutan**:
- `0002_cover.sql` — menambah kolom `cover_url` pada tabel buku.
- `0005_petugas.sql` — mengizinkan role `petugas` pada constraint + **seed akun petugas** (username `petugas1`, password tertera di file tersebut).

Opsional: `supabase/seed.sql` untuk data contoh buku.

> **Catatan keamanan (P0 / wajib bagi deploy publik):** RLS pada tabel-tabel Supabase **saat ini nonaktif**, sehingga `SUPABASE_ANON_KEY` publik bisa membaca/menulis tabel (termasuk kolom `password_hash`). Ini disengaja **sementara** untuk kemudahan pengembangan. **Jangan** deploy ke publik tanpa menutup ini. Langkah aman yang direncanakan: (1) set `SUPABASE_SERVICE_ROLE_KEY` di Vercel, (2) pindahkan kode akses DB ke service_role, (3) aktifkan migration RLS + rotasi password. (Cadangan migration tersedia di stash `wip-rls-migration`.) Sampai RLS aktif, jangan isi data sensitif di Supabase.

### 3. Buat akun admin

```bash
npm install
npm run seed:admin   # membaca ADMIN_SEED_USERNAME & ADMIN_SEED_PASSWORD dari .env.local
```

Akun **petugas** (mini-admin) dibuat lewat migration `0005_petugas.sql` (username `petugas1`). Role `petugas` hanya bisa kelola buku, transaksi, dan akun **siswa** — ia **tidak** bisa membuat/ubah/hapus akun admin atau petugas lain.

### 4. Jalankan aplikasi

```bash
npm run dev          # development
# atau
npm run build && npm run start   # production
```

Login di `/login` — pilih tab role sesuai akun (Siswa / Petugas / Admin).

## Checklist Testing Manual

Setelah Supabase dikonfigurasi, uji satu per satu:

1. **Registrasi** `/daftar` → buat akun siswa → berhasil & ter-redirect ke `/login` dengan pesan sukses.
2. **Login salah**: username/password salah → muncul error, kembali ke form. **Login role salah** (akun siswa pilih tab Admin) → error.
3. **Login siswa** → masuk `/siswa/dashboard`, ringkasan tampil + jam realtime.
4. **Cari buku** (siswa) → filter judul/kategori → tombol **Pinjam** → pilih durasi (1–30 hari) → stok berkurang, muncul di *Peminjaman Saya*.
5. **Pinjam buku yang sama berulang** → ditolak sampai dikembalikan. **Buku stok 0** → tidak bisa dipinjam.
6. **Kembalikan buku** → stok bertambah, status berubah, denda dihitung jika terlambat.
7. **Login admin** → `/admin/dashboard` (statistik benar, grafik & jam tampil).
8. **Login petugas** (username `petugas1`) → bisa buka `/admin/*`; nav menampilkan badge "Petugas Perpustakaan".
9. **CRUD buku** admin ataupun petugas: tambah/ubah/hapus + pencarian.
10. **CRUD anggota**: tambah/ubah/reset-password/hapus **hanya untuk siswa**.
11. **Pembatasan petugas**: di halaman anggota, petugas **tidak** bisa mengubah/menghapus akun admin atau petugas lain.
12. **Transaksi admin**: buat transaksi (pilih anggota+buku+tanggal), tandai dikembalikan, edit, hapus; filter status bekerja.
13. **Laporan** `/admin/laporan` → export Excel, PDF, dan tombol cetak berfungsi.
14. **Proteksi route**: siswa tidak bisa buka `/admin/*`, admin/petugas tidak bisa buka `/siswa/*`, user belum login diarahkan ke `/login`.
15. **Logout** → kembali ke `/login`, halaman terproteksi tertutup.

Cek error di **browser console** dan terminal setiap langkah.

## Deploy ke Vercel

1. Push repo ke GitHub (lihat [Development](#development)).
2. Di [vercel.com](https://vercel.com) → **Add New Project → Import** repo ini.
3. Di tab *Environment Variables*, tambahkan (nilai sama seperti `.env.local`, tanpa `ADMIN_SEED_*`; simpan sebagai **Sensitive**):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `AUTH_SECRET`
4. **Deploy**. Setelah sukses, pastikan migration `0001`–`0005` + seed admin sudah dijalankan di Supabase (bagian Setup).
5. Buka URL deploy → login → semua fitur berjalan.

> ⚠️ **Sebelum go-public:** tutup P0 — RLS masih nonaktif (lihat bagian Setup, langkah 2). Rencana aman & migration cadangannya sudah dicatat di sana.

## Development

```bash
npm run dev         # server development
npm run build       # production build
npm run start       # menjalankan hasil build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run seed:admin  # buat/update akun admin
```