import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SchoolBackdrop } from "@/components/school-backdrop";

export default async function Home() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin/dashboard" : "/siswa/dashboard");
  }

  return (
    <div className="relative flex flex-1 items-center justify-center px-4 py-20">
      <SchoolBackdrop />

      <main className="anim-rise relative mx-auto w-full max-w-3xl text-center">
        <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-100/90">
          <span className="h-px w-8 bg-indigo-200/60" />
          Perpustakaan Sekolah
          <span className="h-px w-8 bg-indigo-200/60" />
        </p>

        <h1
          style={{ animationDelay: "90ms" }}
          className="anim-rise mt-5 text-balance font-display text-4xl font-medium leading-[1.06] text-white sm:text-6xl"
        >
          Perpustakaan Sekolah{" "}
          <em className="font-display italic text-indigo-100">Digital</em>
        </h1>

        <p
          style={{ animationDelay: "180ms" }}
          className="anim-rise mx-auto mt-6 max-w-xl px-2 text-pretty text-base leading-relaxed text-indigo-100/85 sm:text-lg"
        >
          Sistem peminjaman buku perpustakaan sekolah — kelola koleksi, anggota,
          dan transaksi peminjaman dalam satu tempat yang rapi.
        </p>

        <div
          style={{ animationDelay: "280ms" }}
          className="anim-rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/login"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-900 shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-indigo-50 active:scale-[0.98] sm:w-auto"
          >
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 active:scale-[0.98] sm:w-auto"
          >
            Daftar sebagai Siswa
          </Link>
        </div>
      </main>
    </div>
  );
}