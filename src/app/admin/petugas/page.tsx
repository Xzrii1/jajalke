import { requireAdmin } from "@/lib/auth";
import AdminPetugas from "./petugas-client";

export default async function AdminPetugasPage() {
  await requireAdmin();
  return <AdminPetugas />;
}