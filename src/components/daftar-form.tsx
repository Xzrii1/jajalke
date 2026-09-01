"use client";

import Link from "next/link";
import { useActionState, type InputHTMLAttributes, type ReactNode } from "react";
import { register } from "@/app/actions/auth";
import { Alert } from "@/components/ui";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function BadgeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path strokeLinecap="round" d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

function ClassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18M5 7l2 10M19 7l-2 10M7 12h10M7 17h10" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path strokeLinecap="round" d="M8 10V7a4 4 0 018 0v3" />
    </svg>
  );
}

const fieldLabel = "mb-1.5 block text-[13px] font-semibold text-slate-700";
const inputBox =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500";

function IconInput({
  label,
  htmlFor,
  Icon,
  ...props
}: {
  label: string;
  htmlFor: string;
  Icon: (p: { className?: string }) => ReactNode;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={htmlFor} className={fieldLabel}>
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input {...props} id={htmlFor} className={`${inputBox} pl-10`} />
      </div>
    </div>
  );
}

function PlainInput({
  label,
  htmlFor,
  ...props
}: { label: string; htmlFor: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={htmlFor} className={fieldLabel}>
        {label}
      </label>
      <input {...props} id={htmlFor} className={inputBox} />
    </div>
  );
}

export function DaftarForm() {
  const [state, formAction, pending] = useActionState(register, null);

  return (
    <div>
      {state?.error && (
        <div className="mb-5">
          <Alert kind="error">{state.error}</Alert>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <IconInput label="Nama Lengkap" htmlFor="nama_lengkap" Icon={UserIcon} name="nama_lengkap" placeholder="Mis. Budi Santoso" required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PlainInput label="NIS (No. Induk)" htmlFor="no_induk" name="no_induk" placeholder="Contoh: 12345" />
          <IconInput label="Kelas" htmlFor="kelas" Icon={ClassIcon} name="kelas" placeholder="Contoh: X IPA 1" />
        </div>
        <IconInput label="Username" htmlFor="username" Icon={BadgeIcon} name="username" placeholder="Dipakai untuk login" autoComplete="username" required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <IconInput label="Password" htmlFor="password" Icon={LockIcon} name="password" type="password" placeholder="Min. 6 karakter" autoComplete="new-password" required />
          <IconInput label="Ulangi Password" htmlFor="password2" Icon={LockIcon} name="password2" type="password" placeholder="Ulangi password" autoComplete="new-password" required />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-600/40 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
          {pending ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Mendaftarkan...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
        <span className="h-px flex-1 bg-slate-200" />
        Gratis untuk siswa
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <p className="mt-4 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 underline-offset-4 transition hover:text-indigo-700 hover:underline"
        >
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
