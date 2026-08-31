import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin/dashboard" : "/siswa/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4">
      <main className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </span>
        <h1 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
          Perpustakaan Sekolah Digital
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          Sistem peminjaman buku perpustakaan sekolah. Kelola koleksi buku,
          anggota, dan transaksi peminjaman dalam satu tempat.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Daftar sebagai Siswa
          </Link>
        </div>
      </main>
    </div>
  );
}