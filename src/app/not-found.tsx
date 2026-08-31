import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-4xl">🔍</div>
        <h1 className="mt-3 text-lg font-bold text-slate-900">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Halaman yang kamu cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}