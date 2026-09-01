export type Role = "admin" | "siswa";

export type TransaksiStatus = "dipinjam" | "dikembalikan" | "terlambat";

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
  };
}

export interface ActionResult {
  error?: string;
  success?: string;
}