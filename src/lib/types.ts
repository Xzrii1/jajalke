export type Role = "admin" | "petugas" | "siswa";

export type TransaksiStatus =
  | "pending"
  | "dipinjam"
  | "dikembalikan"
  | "terlambat"
  | "ditolak"
  | "menunggu_kembali";

export type KondisiBuku = "baru" | "baik" | "bekas" | "rusak";

export interface User {
  id: string;
  username: string;
  nama_lengkap: string;
  role: Role;
  kelas: string | null;
  no_induk: string | null;
  created_at: string;
}

export interface Buku {
  id: string;
  judul: string;
  penulis: string | null;
  penerbit: string | null;
  tahun_terbit: number | null;
  isbn: string | null;
  kategori: string | null;
  stok: number;
  kondisi?: KondisiBuku | null;
  deskripsi: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaksi {
  id: string;
  user_id: string;
  buku_id: string;
  tanggal_pinjam: string;
  tanggal_jatuh_tempo: string;
  tanggal_kembali: string | null;
  status: TransaksiStatus;
  denda: number;
  denda_bayar: number;
  created_at: string;
  user?: {
    username: string;
    nama_lengkap: string;
    kelas: string | null;
    no_induk: string | null;
  };
  buku?: {
    judul: string;
    penulis: string | null;
    kategori: string | null;
    isbn: string | null;
    cover_url: string | null;
  };
}

export interface ActionResult {
  error?: string;
  success?: string;
}

export interface Ulasan {
  id: string;
  user_id: string;
  buku_id: string;
  rating: number;
  komentar: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    nama_lengkap: string;
    kelas: string | null;
  };
}

/** Ringkasan rating untuk sebuah buku. */
export interface BukuRating {
  count: number;
  avg: number;
  /** Rating milik user yang sedang login (null jika belum memberi). */
  myRating: number | null;
}