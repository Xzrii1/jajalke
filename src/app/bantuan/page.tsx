import BantuanClient from "./bantuan-client";
import { maybeCurrentUser } from "@/lib/auth";

export default async function BantuanPage() {
  const user = await maybeCurrentUser();
  return <BantuanClient isLoggedIn={Boolean(user)} />;
}
