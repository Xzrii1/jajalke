import { LoginPageContent } from "@/components/login-page";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; next?: string }>;
}) {
  const { registered, next } = await searchParams;

  return <LoginPageContent registered={registered} next={next} />;
}
