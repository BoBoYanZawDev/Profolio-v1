import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable. Run `npx prisma migrate dev` first." },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json().catch(() => null);
    const title = String(body?.title ?? "").trim();
    const description = String(body?.description ?? "").trim();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required." },
        { status: 400 }
      );
    }

    const slug =
      String(body?.slug ?? "").trim() || `${slugify(title)}-${Date.now().toString(36)}`;

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        category: String(body?.category ?? "Web App").slice(0, 60),
        description,
        tech: String(body?.tech ?? "").slice(0, 300),
        demoUrl: body?.demoUrl ? String(body.demoUrl) : null,
        repoUrl: body?.repoUrl ? String(body.repoUrl) : null,
        accent: HEX_RE.test(String(body?.accent ?? "")) ? String(body.accent) : "#3b82f6",
        featured: Boolean(body?.featured),
        sortOrder: Number.isFinite(Number(body?.sortOrder)) ? Number(body.sortOrder) : 99,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    const msg =
      err instanceof Error && err.message.includes("Unique")
        ? "A project with this slug already exists."
        : "Could not create project.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
