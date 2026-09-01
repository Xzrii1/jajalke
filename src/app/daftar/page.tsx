import { AuthShell } from "@/components/auth-shell";
import { DaftarForm } from "@/components/daftar-form";

export default function DaftarPage() {
  return (
    <AuthShell
      title="Daftar Anggota Perpustakaan"
      subtitle={
        <>
          Bikin akun siswa dalam hitungan detik dan mulai pinjam buku favoritmu.
          Akun admin dibuat terpisah oleh pengelola.
        </>
      }
      badge="Registrasi Siswa"
      footerHref="/login"
      footerLabel="Sudah punya akun? Masuk di sini"
    >
      <DaftarForm />
    </AuthShell>
  );
}
