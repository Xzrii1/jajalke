import { redirect } from "next/navigation";
import { getSession } from "./session";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { Role, User } from "./types";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getSession();
    if (!session) return null;
    if (!isSupabaseConfigured) return null;
    const { data, error } = await getSupabase()
      .from("users")
      .select("*")
      .eq("id", session.userId)
      .maybeSingle();
    if (error || !data) return null;
    return data as User;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requirePetugasAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin" && user.role !== "petugas") redirect("/siswa/dashboard");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin/dashboard");
  return user;
}

export async function requirePetugas(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "petugas") redirect("/admin/dashboard");
  return user;
}

export async function requireSiswa(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "siswa") redirect("/admin/dashboard");
  return user;
}

/** Helper yang dipakai di dalam server action / page untuk cek role tanpa throw. */
export async function maybeCurrentUser(): Promise<User | null> {
  return getCurrentUser();
}

export type { Role };