import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; next?: string }>;
}) {
  const { registered, next } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Masuk</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pilih role dan gunakan akunmu untuk masuk ke perpustakaan digital.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoginForm registered={registered} next={next} />
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