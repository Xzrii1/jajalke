"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { login } from "@/app/actions/auth";
import { Alert } from "@/components/ui";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.4-2.9 7.7-7 9-4.1-1.3-7-4.6-7-9V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 5.1A9.8 9.8 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3 3.9M6.6 6.6C4.2 8.2 2 12 2 12s3.5 7 10 7a9.9 9.9 0 003.6-.7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 9.9a3 3 0 104.2 4.2" />
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

function inputBox(hasIcon: boolean) {
  return `w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900
    placeholder:text-slate-400 shadow-sm transition
    focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500
    ${hasIcon ? "pl-10" : ""}`;
}

const fieldLabel =
  "mb-1.5 block text-[13px] font-semibold text-slate-700";

export function LoginForm({
  registered,
  next,
}: {
  registered?: string;
  next?: string;
}) {
  const [state, formAction, pending] = useActionState(login, null);
  const [role, setRole] = useState<"siswa" | "admin">("siswa");
  const [showPass, setShowPass] = useState(false);

  const toggleOpts = [
    { value: "siswa" as const, label: "Siswa", Icon: UserIcon },
    { value: "admin" as const, label: "Admin", Icon: ShieldIcon },
  ];

  return (
    <div>
      {registered && (
        <div className="mb-5">
          <Alert kind="success">
            Pendaftaran berhasil! Silakan masuk dengan akun barumu.
          </Alert>
        </div>
      )}

      {state?.error && (
        <div className="mb-5">
          <Alert kind="error">{state.error}</Alert>
        </div>
      )}

      {/* Toggle role */}
      <div className="relative mb-6 flex rounded-2xl bg-slate-100 p-1.5 shadow-inner">
        <span
          aria-hidden
          className={`absolute bottom-1.5 top-1.5 left-1.5 w-[calc(50%-6px)] rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            role === "admin" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        {toggleOpts.map(({ value, label, Icon }) => {
          const active = role === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                active ? "text-white" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="role" value={role} />
        {next && <input type="hidden" name="next" value={next} />}

        <div>
          <label htmlFor="username" className={fieldLabel}>
            Username
          </label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="username"
              name="username"
              placeholder={`Contoh: ${role === "admin" ? "admin" : "budi2007"}`}
              autoComplete="username"
              required
              className={inputBox(true)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className={fieldLabel}>
            Password
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className={`${inputBox(true)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition hover:text-slate-700"
            >
              {showPass ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
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
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
        <span className="h-px flex-1 bg-slate-200" />
        Akun anggota
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <p className="mt-4 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link
          href="/daftar"
          className="font-semibold text-indigo-600 underline-offset-4 transition hover:text-indigo-700 hover:underline"
        >
          Daftar sebagai siswa
        </Link>
      </p>
    </div>
  );
}
