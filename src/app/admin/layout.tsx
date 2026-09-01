import { AppNav } from "@/components/app-nav";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "Perpustakaan Sekolah Digital",
  description: "Aplikasi perpustakaan sekolah digital - peminjaman buku",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav
        brand="Perpus Sekolah"
        userLabel={user.nama_lengkap}
        links={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/buku", label: "Kelola Buku" },
          { href: "/admin/anggota", label: "Kelola Anggota" },
          { href: "/admin/transaksi", label: "Transaksi" },
          { href: "/admin/laporan", label: "Laporan" },
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}