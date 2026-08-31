"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="anim-rise flex w-full max-w-md flex-col items-center rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </span>
        <h1 className="mt-5 text-balance font-display text-2xl font-medium tracking-tight text-slate-900">
          Terjadi kesalahan
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Gagal memuat halaman ini. Coba ulangi, atau periksa konfigurasi
          (misalnya environment variable Supabase &amp; AUTH_SECRET).
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 active:scale-[0.98]"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}