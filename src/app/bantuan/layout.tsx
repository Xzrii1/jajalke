import { AppNav } from "@/components/app-nav";
import { getCurrentUser } from "@/lib/auth";

export default async function BantuanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav
        brand="Perpus Sekolah"
        userLabel={user?.nama_lengkap ?? "Pengunjung"}
        roleLabel={user ? "Pusat Bantuan" : undefined}
        links={
          user
            ? [
                {
                  href:
                    user.role === "siswa"
                      ? "/siswa/dashboard"
                      : "/admin/dashboard",
                  label: "Beranda",
                },
                { href: "/bantuan", label: "Pusat Bantuan" },
                {
                  href:
                    user.role === "siswa" ? "/siswa/buku" : "/admin/transaksi",
                  label: "Kembali ke Aplikasi",
                },
              ]
            : [
                { href: "/bantuan", label: "Pusat Bantuan" },
                { href: "/login", label: "Masuk" },
              ]
        }
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
