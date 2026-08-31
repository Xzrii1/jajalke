"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import { Alert, Button, Field, Input } from "@/components/ui";

export function DaftarForm() {
  const [state, formAction, pending] = useActionState(register, null);

  return (
    <div>
      {state?.error && (
        <div className="mb-4">
          <Alert kind="error">{state.error}</Alert>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <Field label="Nama Lengkap" htmlFor="nama_lengkap">
          <Input
            id="nama_lengkap"
            name="nama_lengkap"
            placeholder="Mis. Budi Santoso"
            required
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="NIS (No. Induk)" htmlFor="no_induk">
            <Input id="no_induk" name="no_induk" placeholder="Contoh: 12345" />
          </Field>
          <Field label="Kelas" htmlFor="kelas">
            <Input id="kelas" name="kelas" placeholder="Contoh: X IPA 1" />
          </Field>
        </div>
        <Field label="Username" htmlFor="username">
          <Input
            id="username"
            name="username"
            placeholder="Dipakai untuk login"
            autoComplete="username"
            required
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 6 karakter"
              autoComplete="new-password"
              required
            />
          </Field>
          <Field label="Ulangi Password" htmlFor="password2">
            <Input
              id="password2"
              name="password2"
              type="password"
              placeholder="Ulangi password"
              autoComplete="new-password"
              required
            />
          </Field>
        </div>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Mendaftarkan..." : "Daftar"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}