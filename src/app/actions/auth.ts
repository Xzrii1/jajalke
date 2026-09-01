"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { getSupabase, isSupabaseConfigured, CONFIG_ERROR_MESSAGE } from "@/lib/supabase";
import { clearSessionCookie, setSessionCookie } from "@/lib/session";
import type { ActionResult, Role } from "@/lib/types";

function safeNext(raw: string): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export async function login(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "siswa") as Role;
  const next = String(formData.get("next") ?? "");

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }
  if (!isSupabaseConfigured) {
    return { error: CONFIG_ERROR_MESSAGE };
  }

  const { data: user, error } = await getSupabase()
    .from("users")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error || !user) {
    return { error: "Username atau password salah." };
  }

  const passwordMatch = await compare(password, user.password_hash);
  if (!passwordMatch) {
    return { error: "Username atau password salah." };
  }

  if (user.role !== role) {
    const roleLabel =
      role === "admin" ? "Admin" : role === "petugas" ? "Petugas" : "Siswa";
    return {
      error:
        "Login role tidak cocok dengan akun ini. Pilih tab \u201C" +
        roleLabel +
        "\u201D sesuai akunmu atau gunakan akun lain.",
    };
  }

  await setSessionCookie({
    userId: user.id,
    username: user.username,
    role: user.role,
    namaLengkap: user.nama_lengkap,
  });

  const target =
    safeNext(next) ?? (user.role === "siswa" ? "/siswa/dashboard" : "/admin/dashboard");
  redirect(target);
}

export async function register(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const username = String(formData.get("username") ?? "").trim();
  const namaLengkap = String(formData.get("nama_lengkap") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");
  const kelas = String(formData.get("kelas") ?? "").trim();
  const noInduk = String(formData.get("no_induk") ?? "").trim();

  if (!username || !namaLengkap || !password) {
    return { error: "Username, nama lengkap, dan password wajib diisi." };
  }
  if (password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }
  if (password !== password2) {
    return { error: "Konfirmasi password tidak sama." };
  }
  if (!isSupabaseConfigured) {
    return { error: CONFIG_ERROR_MESSAGE };
  }

  const passwordHash = await hash(password, 10);

  const { error } = await getSupabase().from("users").insert({
    username,
    nama_lengkap: namaLengkap,
    password_hash: passwordHash,
    role: "siswa",
    kelas: kelas || null,
    no_induk: noInduk || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Username sudah terdaftar. Gunakan username lain." };
    }
    return { error: "Gagal mendaftar: " + error.message };
  }

  redirect("/login?registered=1");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}