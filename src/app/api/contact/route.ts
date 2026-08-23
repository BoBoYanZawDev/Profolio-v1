import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
    }
    if (message.length > 3000 || name.length > 80 || subject.length > 140) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    const saved = await prisma.message.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not save your message right now. Please email me directly." },
      { status: 500 }
    );
  }
}
