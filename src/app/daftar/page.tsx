import Link from "next/link";
import { DaftarForm } from "@/components/daftar-form";
import { SchoolBackdrop } from "@/components/school-backdrop";

export default function DaftarPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center px-4 py-12">
      <SchoolBackdrop />

      <div className="anim-rise relative w-full max-w-md">
        <div className="mb-6 text-center">
          <span
            style={{ animationDelay: "70ms" }}
            className="anim-rise mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-indigo-100 backdrop-blur-md"
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </span>
          <h1
            style={{ animationDelay: "140ms" }}
            className="anim-rise mt-4 text-balance font-display text-3xl font-medium text-white"
          >
            Daftar Anggota Perpustakaan
          </h1>
          <p
            style={{ animationDelay: "210ms" }}
            className="anim-rise mt-2 text-sm text-indigo-100/80"
          >
            Registrasi untuk siswa. Akun admin dibuat oleh pengelola.
          </p>
        </div>

        <div
          style={{ animationDelay: "280ms" }}
          className="anim-rise glass-panel rounded-3xl p-6 sm:p-8"
        >
          <DaftarForm />
        </div>

        <p
          style={{ animationDelay: "350ms" }}
          className="anim-rise mt-5 text-center text-sm text-indigo-100/75"
        >
          Kembali ke{" "}
          <Link href="/" className="font-semibold text-white underline decoration-indigo-300/60 underline-offset-4 hover:text-indigo-100">
            beranda
          </Link>
        </p>
      </div>
    </div>
  );
}