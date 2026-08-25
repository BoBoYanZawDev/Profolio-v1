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

    // forward to Telegram (never fails the form if Telegram is down/misconfigured)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      const text =
        `📩 New message from portfolio\n\n` +
        `👤 Name: ${name}\n` +
        `📧 Email: ${email}\n` +
        `📌 Subject: ${subject || "—"}\n\n` +
        `${message}`;
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text }),
          signal: AbortSignal.timeout(8000),
        });
      } catch {
        /* telegram failure is ignored — message is already saved in DB */
      }
    }

    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not save your message right now. Please email me directly." },
      { status: 500 }
    );
  }
}
