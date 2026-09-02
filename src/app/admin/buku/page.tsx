import { requirePetugas } from "@/lib/auth";
import AdminBuku from "./buku-client";

export default async function AdminBukuPage() {
  await requirePetugas();
  return <AdminBuku />;
}