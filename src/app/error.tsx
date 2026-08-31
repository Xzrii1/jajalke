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
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-4xl">😵</div>
        <h1 className="mt-3 text-lg font-bold text-slate-900">
          Terjadi kesalahan
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Gagal memuat halaman ini. Coba ulangi, atau periksa konfigurasi
          (misalnya environment variable Supabase & AUTH_SECRET).
        </p>
        <button
          onClick={reset}
          className="mt-5 inline-flex rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}