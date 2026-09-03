import { AppNav } from "@/components/app-nav";
import { DendaReminder } from "@/components/denda-reminder";
import { WhatsAppFab } from "@/components/whatsapp-button";
import { requireSiswa } from "@/lib/auth";

export default async function SiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSiswa();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav
        brand="Perpus Sekolah"
        userLabel={user.nama_lengkap}
        links={[
          { href: "/siswa/dashboard", label: "Dashboard" },
          { href: "/siswa/buku", label: "Cari Buku" },
          { href: "/siswa/transaksi", label: "Peminjaman Saya" },
          { href: "/siswa/profil", label: "Profil" },
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <DendaReminder />
      <WhatsAppFab />
    </div>
  );
}