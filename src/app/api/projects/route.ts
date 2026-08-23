import { NextResponse } from "next/server";
import { getProjectsSafe } from "@/lib/projects";

export const dynamic = "force-dynamic";

export async function GET() {
  const { projects, source } = await getProjectsSafe();
  return NextResponse.json({ projects, source });
}
