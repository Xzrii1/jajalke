import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "./types";

export const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export interface SessionPayload {
  userId: string;
  username: string;
  role: Role;
  namaLengkap: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET belum diatur di .env.local");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.userId !== "string" ||
      typeof payload.role !== "string" ||
      (payload.role !== "admin" &&
        payload.role !== "petugas" &&
        payload.role !== "siswa")
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      username: (payload.username as string) ?? "",
      role: payload.role,
      namaLengkap: (payload.namaLengkap as string) ?? "",
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}