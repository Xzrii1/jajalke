import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; next?: string }>;
}) {
  const { registered, next } = await searchParams;

  return (
    <AuthShell
      title="Selamat datang kembali"
      subtitle={
        <>
          Masuk ke perpustakaan digital sekolahmu dan lanjutkan petualangan
          membacamu.
        </>
      }
      badge="Portal Anggota"
      footerHref="/"
      footerLabel="Kembali ke beranda"
    >
      <LoginForm registered={registered} next={next} />
    </AuthShell>
  );
}
