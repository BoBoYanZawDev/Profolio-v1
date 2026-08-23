"use client";

import { useState } from "react";
import { useAdminStore, type Message } from "@/store/admin";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function MessagesPanel() {
  const { messages, messagesLoading, markRead, deleteMessage } = useAdminStore();
  const [openId, setOpenId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const shown = filter === "unread" ? messages.filter((m) => !m.isRead) : messages;

  async function openMessage(m: Message) {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.isRead) await markRead(m.id, true);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {shown.length} message{shown.length === 1 ? "" : "s"}
        </p>
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}

              className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                filter === f ? "bg-lime text-cream" : "border border-line text-muted hover:text-cream"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {messagesLoading && messages.length === 0 && (
        <p className="py-10 text-center text-sm text-muted">Loading messages…</p>
      )}

      {!messagesLoading && shown.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="font-display text-xl font-bold">Inbox zero ✦</p>
          <p className="mt-2 text-sm text-muted">
            New contact form submissions will appear here.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {shown.map((m) => {
          const open = openId === m.id;
          return (
            <li key={m.id}>
              <article
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  m.isRead ? "border-line bg-panel" : "border-lime/25 bg-panel2"
                }`}
              >
                <button
                  onClick={() => openMessage(m)}

                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  {!m.isRead && (
                    <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-lime" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {m.name}
                      <span className="ml-3 font-mono text-xs text-muted">{m.email}</span>
                    </p>
                    <p className={`truncate text-sm ${open ? "text-muted" : "text-muted"}`}>
                      {m.subject || m.message}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-muted">
                    {timeAgo(m.createdAt)}
                  </span>
                  <span className={`shrink-0 text-lime-bright transition-transform ${open ? "rotate-180" : ""}`}>
                    ⌄
                  </span>
                </button>

                {open && (
                  <div className="border-t border-line px-5 py-5">
                    <p className="whitespace-pre-wrap leading-relaxed text-cream/90">{m.message}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(
                          m.subject || "Your message"
                        )}`}
                        className="rounded-full bg-lime px-5 py-2 hover:bg-[var(--accent-hover)] font-mono text-xs uppercase tracking-widest text-ink"
                      >
                        Reply by email ↗
                      </a>
                      <button
                        onClick={() => markRead(m.id, !m.isRead)}
                        className="rounded-full border border-line px-5 py-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-cream"
                      >
                        Mark as {m.isRead ? "unread" : "read"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete message from ${m.name}?`)) deleteMessage(m.id);
                        }}
                        className="ml-auto rounded-full border border-red/40 px-5 py-2 font-mono text-xs uppercase tracking-widest text-red hover:bg-red hover:text-ink"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
