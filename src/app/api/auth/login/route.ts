import { NextResponse } from "next/server";
import { checkCredentials, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!checkCredentials(email, password)) {
    // small delay to slow brute-force attempts
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await createSessionToken(email);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
