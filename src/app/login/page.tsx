import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { SchoolBackdrop } from "@/components/school-backdrop";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; next?: string }>;
}) {
  const { registered, next } = await searchParams;

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <h1
            style={{ animationDelay: "140ms" }}
            className="anim-rise mt-4 text-balance font-display text-3xl font-medium text-white"
          >
            Masuk ke Perpustakaan
          </h1>
          <p
            style={{ animationDelay: "210ms" }}
            className="anim-rise mt-2 text-sm text-indigo-100/80"
          >
            Pilih role dan gunakan akunmu untuk masuk ke perpustakaan digital.
          </p>
        </div>

        <div
          style={{ animationDelay: "280ms" }}
          className="anim-rise glass-panel rounded-3xl p-6 sm:p-8"
        >
          <LoginForm registered={registered} next={next} />
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