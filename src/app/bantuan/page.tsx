import { requireUser } from "@/lib/auth";
import BantuanClient from "./bantuan-client";

export default async function BantuanPage() {
  await requireUser();
  return <BantuanClient />;
}