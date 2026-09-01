import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SchoolBackdrop } from "@/components/school-backdrop";

function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: string;
}) {
  return (
    <div
      style={{ animationDelay: delay }}
      className="anim-rise card-lift group rounded-2xl border border-white/12 bg-white/8 p-5 text-left backdrop-blur-md"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/90 to-violet-600/90 text-white shadow-lg shadow-indigo-600/30 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <h3 className="mt-3 font-display text-base font-medium text-white">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-indigo-100/80">{desc}</p>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
      </svg>
    ),
    title: "Cari & Pinjam",
    desc: "Telusuri koleksi buku sekolah lalu pinjam dalam beberapa klik.",
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
        <path strokeLinecap="round" d="M14 7h6v6" />
      </svg>
    ),
    title: "Pantau & Kembalikan",
    desc: "Lihat riwayat pinjam, jatuh tempo, dan denda secara otomatis.",
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 10h18M3 14h18M3 18h18" />
        <path strokeLinecap="round" d="M6 6l2 12M18 6l-2 12" />
      </svg>
    ),
    title: "Kelola Koleksi",
    desc: "Admin mengelola buku, anggota, dan laporan dalam satu dashboard.",
  },
];

const marqueeItems = [
  "Peminjaman Digital",
  "Denda Otomatis",
  "Katalog Online",
  "Laporan Excel / PDF",
  "Dashboard Admin",
  "Riwayat Transaksi",
  "Koleksi Sekolah",
  "Grafik & Statistik",
];

export default async function Home() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin/dashboard" : "/siswa/dashboard");
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16">
      <SchoolBackdrop />

      {/* Orb / partikel mengambang */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
        <div className="anim-drift absolute -left-24 top-16 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="anim-drift-rev absolute right-0 top-1/3 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="anim-drift absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <span className="anim-float absolute left-[14%] top-[22%] text-3xl opacity-25">📚</span>
        <span className="anim-float-slow absolute right-[16%] top-[30%] text-3xl opacity-25">✨</span>
        <span className="anim-float absolute bottom-[26%] right-[24%] text-3xl opacity-20">📖</span>
        <span className="anim-float-slow absolute bottom-[24%] left-[18%] text-3xl opacity-20">🏫</span>
      </div>

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
          <em className="anim-gradient-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-indigo-300 bg-clip-text font-display italic text-transparent">
            Digital
          </em>
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
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-slate-900 shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-indigo-50 active:scale-[0.98] sm:w-auto"
          >
            Masuk
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link
            href="/daftar"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 active:scale-[0.98] sm:w-auto"
          >
            Daftar sebagai Siswa
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Kartu fitur */}
      <div className="relative mx-auto mt-14 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
        {features.map((f, i) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} delay={`${340 + i * 90}ms`} />
        ))}
      </div>

      {/* Ribbon berjalan */}
      <div
        style={{ animationDelay: "700ms" }}
        className="anim-fade relative mt-14 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 py-3 backdrop-blur-md"
      >
        <div className="anim-marquee flex w-max gap-10 whitespace-nowrap pr-10">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2.5 text-sm font-medium text-indigo-100/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
