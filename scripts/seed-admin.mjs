/**
 * Script untuk membuat / memperbarui akun admin.
 *
 * Cara pakai:
 *   1. Isi .env.local: ADMIN_SEED_USERNAME, ADMIN_SEED_PASSWORD,
 *      SUPABASE_URL, SUPABASE_ANON_KEY (atau SUPABASE_SERVICE_ROLE_KEY)
 *   2. npm run seed:admin
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = { ...process.env };
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // .env.local tidak ada; pakai process.env saja
  }
  return env;
}

const env = loadEnv();

const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
const username = (env.ADMIN_SEED_USERNAME || "").trim();
const password = env.ADMIN_SEED_PASSWORD || "";

if (!url || !key) {
  console.error(
    "✗ SUPABASE_URL dan (SUPABASE_SERVICE_ROLE_KEY | SUPABASE_ANON_KEY) harus diisi di .env.local"
  );
  process.exit(1);
}
if (!username || password.length < 6) {
  console.error(
    "✗ ADMIN_SEED_USERNAME wajib diisi dan ADMIN_SEED_PASSWORD minimal 6 karakter (di .env.local)"
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const password_hash = await bcrypt.hash(password, 10);

const { error } = await supabase
  .from("users")
  .upsert(
    {
      username,
      password_hash,
      nama_lengkap: "Administrator Perpustakaan",
      role: "admin",
    },
    { onConflict: "username" }
  );

if (error) {
  console.error("✗ Gagal menyimpan admin:", error.message);
  process.exit(1);
}

console.log("✓ Akun admin siap:");
console.log("  username  :", username);
console.log("  password  : [tersimpan sebagai bcrypt hash]");
console.log("  role      : admin");
console.log("\nLogin di: <base-url>/login (pilih tab role 'Admin')");