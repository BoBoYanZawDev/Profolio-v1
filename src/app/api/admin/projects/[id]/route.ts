import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export async function PATCH(req: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json().catch(() => null);
    const data: Record<string, unknown> = {};

    for (const key of [
      "title",
      "slug",
      "category",
      "description",
      "tech",
    ] as const) {
      if (body?.[key] !== undefined) data[key] = String(body[key]).trim();
    }
    for (const key of ["demoUrl", "repoUrl"] as const) {
      if (body?.[key] !== undefined)
        data[key] = body[key] ? String(body[key]) : null;
    }
    if (body?.accent !== undefined && HEX_RE.test(String(body.accent)))
      data.accent = String(body.accent);
    if (body?.featured !== undefined) data.featured = Boolean(body.featured);
    if (body?.sortOrder !== undefined && Number.isFinite(Number(body.sortOrder)))
      data.sortOrder = Number(body.sortOrder);

    const project = await prisma.project.update({ where: { id }, data });
    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: "Could not update project." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete project." }, { status: 400 });
  }
}
