# Perpustakaan Sekolah Digital (jajalke)

Aplikasi web **perpustakaan sekolah digital** untuk pengelolaan **peminjaman buku** berbasis web, dengan dua peran pengguna: **Admin** (pengelola perpustakaan) dan **Siswa** (anggota). Dibuat sebagai proyek UKK "Pengembangan Aplikasi Peminjaman Buku".

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

- **Satu tabel `users`** berisi admin & siswa, dibedakan kolom `role` (`admin` / `siswa`).
- Login pakai `username` + `password` (dihash `bcrypt`). Password **tidak pernah** disimpan plaintext.
- Sesi berupa **JWT (HS256, 7 hari)** yang ditandatangani `AUTH_SECRET` dan disimpan di cookie `httpOnly`.
- Proteksi route dua lapis: **Proxy (`src/proxy.ts`)** untuk redirect cepat + **guard role di setiap server action/layout** (tidak hanya mengandalkan proxy).

> Akun admin **tidak** bisa self-register. Admin dibuat lewat script seed (lihat [Setup](#setup-supabase-dan-akun-admin)).

## Fitur

| Fitur                                                   | Siswa | Admin |
| ------------------------------------------------------- | :---: | :---: |
| Registrasi akun (siswa)                                 | ✅    | ✅    |
| Login + pemilihan role                                  | ✅    | ✅    |
| Pemilihan menu (dashboard)                              | ✅    | ✅    |
| Peminjaman & pengembalian buku (transaksi sendiri)      | ✅    | ✅ (CRUD semua transaksi) |
| CRUD Data Buku                                           | ❌    | ✅    |
| CRUD Kelola Anggota (siswa)                             | ❌    | ✅    |
| Pencarian buku (judul/penulis/kategori/ISBN)            | ✅    | ✅    |

Halaman:
- `/` — beranda (redirect sesuai sesi)
- `/login` — form login dengan tab pilihan role
- `/daftar` — registrasi anggota (siswa)
- `/admin/dashboard` — ringkasan jumlah buku, anggota, peminjaman aktif
- `/admin/buku` — CRUD data buku + pencarian
- `/admin/anggota` — CRUD kelola anggota (siswa)
- `/admin/transaksi` — CRUD semua transaksi peminjaman
- `/siswa/dashboard` — ringkasan pinjaman siswa
- `/siswa/buku` — daftar & pencarian buku + tombol pinjam
- `/siswa/transaksi` — riwayat pinjaman + tombol kembalikan

Aturan bisnis:
- Jatuh tempo pinjaman: **7 hari** sejak tanggal pinjam.
- Satu siswa hanya boleh punya **1 peminjaman aktif** per judul buku.
- Pinjam buku → `stok - 1`; kembalikan → `stok + 1` (stok tidak pernah negatif).
- Terlambat otomatis terdeteksi saat tampilkan data; denda **Rp 1.000/hari**.

## Struktur Project

```
.
├── scripts/seed-admin.mjs        # Membuat akun admin dari env
├── supabase/
│   ├── migrations/0001_init.sql  # Schema database (jalankan di Supabase)
│   └── seed.sql                  # Data contoh buku (opsional)
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

Buka **Supabase Dashboard → SQL Editor**, jalankan isi `supabase/migrations/0001_init.sql`, lalu (opsional) `supabase/seed.sql` untuk data contoh. RLS sengaja dinonaktifkan — ini project sekolah tanpa data sensitif.

### 3. Buat akun admin

```bash
npm install
npm run seed:admin   # membaca ADMIN_SEED_USERNAME & ADMIN_SEED_PASSWORD dari .env.local
```

### 4. Jalankan aplikasi

```bash
npm run dev          # development
# atau
npm run build && npm run start   # production
```

Login di `/login` — pilih tab role sesuai akun.

## Checklist Testing Manual

Setelah Supabase dikonfigurasi, uji satu per satu:

1. **Registrasi** `/daftar` → buat akun siswa → berhasil & ter-redirect ke `/login` dengan pesan sukses.
2. **Login salah**: username/password salah → muncul error, kembali ke form. **Login role salah** (akun siswa pilih tab Admin) → error.
3. **Login siswa** → masuk `/siswa/dashboard`, ringkasan tampil.
4. **Cari buku** (siswa) → filter judul/kategori → tombol **Pinjam** → stok berkurang, muncul di *Peminjaman Saya*.
5. **Pinjam buku yang sama berulang** → ditolak sampai dikembalikan. **Buku stok 0** → tidak bisa dipinjam.
6. **Kembalikan buku** → stok bertambah, status berubah, denda dihitung jika terlambat.
7. **Login admin** → `/admin/dashboard` (statistik benar).
8. **CRUD buku** admin: tambah/ubah/hapus + pencarian.
9. **CRUD anggota** admin: tambah/ubah/reset-password/hapus.
10. **Transaksi admin**: buat transaksi (pilih anggota+buku+tanggal), tandai dikembalikan, edit, hapus; filter status bekerja.
11. **Proteksi route**: siswa tidak bisa buka `/admin/*`, admin tidak bisa buka `/siswa/*`, user belum login diarahkan ke `/login`.
12. **Logout** → kembali ke `/login`, halaman terproteksi tertutup.

Cek error di **browser console** dan terminal setiap langkah.

## Deploy ke Vercel

1. Push repo ke GitHub (lihat [Development](#development)).
2. Di [vercel.com](https://vercel.com) → **Add New Project → Import** repo ini.
3. Di tab *Environment Variables*, tambahkan (nilai sama seperti `.env.local`, tanpa `ADMIN_SEED_*`, ketiganya disimpan **Sensitive**):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `AUTH_SECRET`
4. **Deploy**. Setelah sukses, pastikan migration + seed admin sudah dijalankan di Supabase (bagian Setup).
5. Buka URL deploy → login → semua fitur berjalan.

## Development

```bash
npm run dev         # server development
npm run build       # production build
npm run start       # menjalankan hasil build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run seed:admin  # buat/update akun admin
```