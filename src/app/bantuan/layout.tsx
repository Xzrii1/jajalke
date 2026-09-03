import { AppNav } from "@/components/app-nav";
import { requireUser } from "@/lib/auth";

export default async function BantuanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav
        brand="Perpus Sekolah"
        userLabel={user.nama_lengkap}
        roleLabel="Pusat Bantuan"
        links={[
          {
            href:
              user.role === "siswa" ? "/siswa/dashboard" : "/admin/dashboard",
            label: "Beranda",
          },
          { href: "/bantuan", label: "Pusat Bantuan" },
          {
            href:
              user.role === "siswa" ? "/siswa/buku" : "/admin/transaksi",
            label: "Kembali ke Aplikasi",
          },
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
