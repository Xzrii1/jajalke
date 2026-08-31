import Link from "next/link";
import { DaftarForm } from "@/components/daftar-form";

export default function DaftarPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </span>
          <h1 className="mt-3 text-xl font-bold text-slate-900">
            Daftar Anggota Perpustakaan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Registrasi untuk siswa. Akun admin dibuat oleh pengelola.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <DaftarForm />
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          Kembali ke{" "}
          <Link href="/" className="font-medium text-indigo-600 hover:underline">
            beranda
          </Link>
        </p>
      </div>
    </div>
  );
}