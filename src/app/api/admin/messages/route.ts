import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const [messages, totalMessages, unreadMessages, totalProjects] =
      await Promise.all([
        prisma.message.findMany({
          orderBy: { createdAt: "desc" },
          take: 200,
        }),
        prisma.message.count(),
        prisma.message.count({ where: { isRead: false } }),
        prisma.project.count(),
      ]);

    return NextResponse.json({
      messages,
      stats: { totalMessages, unreadMessages, totalProjects },
    });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable. Run `npx prisma migrate dev` first." },
      { status: 503 }
    );
  }
}
