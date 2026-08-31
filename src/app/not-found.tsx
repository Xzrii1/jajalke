import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="anim-rise flex w-full max-w-md flex-col items-center rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10 9v3m0 3h.01" />
          </svg>
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">404</p>
        <h1 className="mt-2 text-balance font-display text-2xl font-medium tracking-tight text-slate-900">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Halaman yang kamu cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 active:scale-[0.98]"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}