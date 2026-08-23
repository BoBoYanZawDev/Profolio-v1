import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-5">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 40% at 20% 20%, rgba(124,92,255,.18), transparent), radial-gradient(45% 40% at 85% 85%, rgba(124,92,255,.1), transparent)",
        }}
      />
      <LoginForm />
    </main>
  );
}
