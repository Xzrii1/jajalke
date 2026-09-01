"use client";

import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";
import { loginThemes, type Role } from "@/lib/login-theme";

export function LoginPageContent({
  registered,
  next,
}: {
  registered?: string;
  next?: string;
}) {
  const [role, setRole] = useState<Role>("siswa");
  const theme = loginThemes[role];

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
      theme={theme}
    >
      <LoginForm
        registered={registered}
        next={next}
        role={role}
        setRole={setRole}
        theme={theme}
      />
    </AuthShell>
  );
}
