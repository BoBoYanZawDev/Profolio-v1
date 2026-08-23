import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/** Returns a 401 response when there is no valid admin session, otherwise null. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
