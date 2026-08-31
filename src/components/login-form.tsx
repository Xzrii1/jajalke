"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { login } from "@/app/actions/auth";
import { Alert, Button, Field, Input } from "@/components/ui";

export function LoginForm({
  registered,
  next,
}: {
  registered?: string;
  next?: string;
}) {
  const [state, formAction, pending] = useActionState(login, null);
  const [role, setRole] = useState<"siswa" | "admin">("siswa");

  return (
    <div>
      {registered && (
        <div className="mb-4">
          <Alert kind="success">
            Pendaftaran berhasil! Silakan masuk dengan akun barumu.
          </Alert>
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
        {(
          [
            ["siswa", "🧑‍🎓  Siswa"],
            ["admin", "🛡️  Admin"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              role === value
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {state?.error && (
        <div className="mb-4">
          <Alert kind="error">{state.error}</Alert>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="role" value={role} />
        {next && <input type="hidden" name="next" value={next} />}
        <Field label="Username" htmlFor="username">
          <Input
            id="username"
            name="username"
            placeholder={`Contoh: ${role === "admin" ? "admin" : "budi2007"}`}
            autoComplete="username"
            required
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </Field>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-medium text-indigo-600 hover:underline">
          Daftar sebagai siswa
        </Link>
      </p>
    </div>
  );
}