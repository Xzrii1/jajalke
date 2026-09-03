import { requirePetugasAdmin } from "@/lib/auth";
import AdminBantuanClient from "./bantuan-client";

export default async function AdminBantuanPage() {
  await requirePetugasAdmin();
  return <AdminBantuanClient />;
}
