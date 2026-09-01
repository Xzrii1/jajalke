"use client";

import { useRef, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";
import { loginThemes, type Role } from "@/lib/login-theme";

type Direction = "left" | "right";

const roleIndex: Record<Role, number> = { siswa: 0, petugas: 1, admin: 2 };

export function LoginPageContent({
  registered,
  next,
}: {
  registered?: string;
  next?: string;
}) {
  const [role, setRole] = useState<Role>("siswa");
  const [displayRole, setDisplayRole] = useState<Role>("siswa");
  const [slideClass, setSlideClass] = useState<string>("");
  const directionRef = useRef<Direction>("right");
  const animatingRef = useRef(false);

  const theme = loginThemes[displayRole];

  const changeRole = (nextRole: Role) => {
    if (nextRole === displayRole || animatingRef.current) return;

    const dir: Direction =
      roleIndex[nextRole] > roleIndex[displayRole] ? "right" : "left";
    directionRef.current = dir;
    setRole(nextRole);
    setSlideClass(dir === "right" ? "anim-slide-out-right" : "anim-slide-out-left");
    animatingRef.current = true;

    window.setTimeout(() => {
      setDisplayRole(nextRole);
      setSlideClass(dir === "right" ? "anim-slide-in-right" : "anim-slide-in-left");
      window.setTimeout(() => {
        setSlideClass("");
        animatingRef.current = false;
      }, 350);
    }, 280);
  };

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
      <div className={slideClass}>
        <LoginForm
          registered={registered}
          next={next}
          role={role}
          displayRole={displayRole}
          setRole={changeRole}
          theme={theme}
        />
      </div>
    </AuthShell>
  );
}
