export type Role = "siswa" | "petugas" | "admin";

export interface LoginTheme {
  /** Cahaya glow di belakang kartu (3 blob) */
  glowA: string;
  glowB: string;
  glowC: string;
  /** Gradient di belakang logo */
  logo: string;
  /** Warna teks badge */
  badge: string;
  /** Warna teks subtitle */
  subtitle: string;
  /** Garis aksen atas kartu */
  accent: string;
  /** Focus ring input */
  inputFocus: string;
  /** Gradient pill tab aktif */
  activePill: string;
  /** Gradient tombol submit + shadow */
  submit: string;
  submitShadow: string;
  submitHoverShadow: string;
  /** Warna link (daftar) */
  link: string;
}

export const loginThemes: Record<Role, LoginTheme> = {
  siswa: {
    glowA: "bg-indigo-500/30",
    glowB: "bg-violet-500/25",
    glowC: "bg-fuchsia-400/20",
    logo: "from-indigo-500/50 via-violet-500/40 to-fuchsia-500/40",
    badge: "text-indigo-100",
    subtitle: "text-indigo-100/80",
    accent: "from-indigo-500 via-violet-500 to-fuchsia-500",
    inputFocus: "focus:ring-indigo-500/80 focus:border-indigo-500",
    activePill: "from-indigo-600 to-violet-600",
    submit: "from-indigo-600 via-violet-600 to-fuchsia-600",
    submitShadow: "shadow-indigo-600/30",
    submitHoverShadow: "hover:shadow-violet-600/40",
    link: "text-indigo-600 hover:text-indigo-700",
  },
  petugas: {
    glowA: "bg-emerald-500/30",
    glowB: "bg-teal-500/25",
    glowC: "bg-cyan-400/20",
    logo: "from-emerald-500/50 via-teal-500/40 to-cyan-500/40",
    badge: "text-emerald-100",
    subtitle: "text-emerald-100/80",
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    inputFocus: "focus:ring-emerald-500/80 focus:border-emerald-500",
    activePill: "from-emerald-600 to-teal-600",
    submit: "from-emerald-600 via-teal-600 to-cyan-600",
    submitShadow: "shadow-emerald-600/30",
    submitHoverShadow: "hover:shadow-teal-600/40",
    link: "text-emerald-600 hover:text-emerald-700",
  },
  admin: {
    glowA: "bg-amber-500/30",
    glowB: "bg-orange-500/25",
    glowC: "bg-rose-400/20",
    logo: "from-amber-500/50 via-orange-500/40 to-rose-500/40",
    badge: "text-amber-100",
    subtitle: "text-amber-100/80",
    accent: "from-amber-500 via-orange-500 to-rose-500",
    inputFocus: "focus:ring-amber-500/80 focus:border-amber-500",
    activePill: "from-amber-600 to-orange-600",
    submit: "from-amber-600 via-orange-600 to-rose-600",
    submitShadow: "shadow-amber-600/30",
    submitHoverShadow: "hover:shadow-orange-600/40",
    link: "text-amber-600 hover:text-amber-700",
  },
};

export const roleLabels: Record<Role, string> = {
  siswa: "Siswa",
  petugas: "Petugas",
  admin: "Admin",
};
