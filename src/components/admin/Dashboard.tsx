"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminStore } from "@/store/admin";
import Logo from "@/components/Logo";
import MessagesPanel from "./MessagesPanel";
import ProjectsPanel from "./ProjectsPanel";

type Tab = "overview" | "messages" | "projects";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "◧" },
  { id: "messages", label: "Messages", icon: "✉" },
  { id: "projects", label: "Projects", icon: "◆" },
];

export default function Dashboard({ adminEmail }: { adminEmail: string }) {
  const [tab, setTab] = useState<Tab>("overview");
  const { stats, fetchMessages, fetchProjects, logout, messages, messagesLoading } =
    useAdminStore();

  useEffect(() => {
    fetchMessages();
    fetchProjects();
  }, [fetchMessages, fetchProjects]);

  return (
    <div className="min-h-svh bg-ink text-cream">
      {/* topbar */}
      <header className="sticky top-0 z-40 border-b border-line bg-panel/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2.5">
              <Logo className="h-4 w-auto" />
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                admin
              </span>
            </span>
            <span className="hidden rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted sm:inline-block">
              {adminEmail}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="font-mono text-xs uppercase tracking-widest text-muted hover:text-lime-bright"
            >
              View Site ↗
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-red/50 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-red transition-colors hover:bg-red hover:text-ink"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* tabs */}
        <nav className="mb-8 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}

              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
                tab === t.id
                  ? "bg-lime text-cream"
                  : "border border-line text-muted hover:text-cream"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
              {t.id === "messages" && stats && stats.unreadMessages > 0 && (
                <span
                  className={`rounded-full px-1.5 text-[10px] ${
                    tab === t.id ? "bg-ink text-lime-bright" : "bg-lime text-cream"
                  }`}
                >
                  {stats.unreadMessages}
                </span>
              )}
            </button>
          ))}
        </nav>

        {tab === "overview" && (
          <section className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Total Messages"
                value={stats?.totalMessages ?? "—"}
                hint="all time"
              />
              <StatCard
                label="Unread Messages"
                value={stats?.unreadMessages ?? "—"}
                hint="needs reply"
                accent
              />
              <StatCard
                label="Projects"
                value={stats?.totalProjects ?? "—"}
                hint="in database"
              />
            </div>

            <div className="rounded-2xl border border-line bg-panel p-6">
              <h2 className="font-display text-xl font-bold">Quick start</h2>
              <ol className="mt-4 list-inside list-decimal space-y-2 text-sm leading-relaxed text-muted">
                <li>Set your MySQL credentials in <code className="text-lime-bright">.env</code> (DATABASE_URL).</li>
                <li>
                  Run <code className="text-lime-bright">npx prisma migrate dev --name init</code> to create tables.
                </li>
                <li>
                  Optionally seed demo content with{" "}
                  <code className="text-lime-bright">npm run db:seed</code>.
                </li>
                <li>Contact form submissions from the portfolio appear under Messages.</li>
              </ol>
            </div>

            <div className="rounded-2xl border border-line bg-panel p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">Latest messages</h2>
                <button
                  onClick={() => setTab("messages")}
                  className="font-mono text-xs uppercase tracking-widest text-lime-bright hover:underline"
                >
                  View all →
                </button>
              </div>
              {messagesLoading && messages.length === 0 ? (
                <p className="text-sm text-muted">Loading…</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-muted">No messages yet.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {messages.slice(0, 4).map((m) => (
                    <li key={m.id} className="flex items-center gap-4 py-3">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${m.isRead ? "bg-line" : "bg-lime"}`}
                      />
                      <span className="w-36 truncate font-medium">{m.name}</span>
                      <span className="hidden flex-1 truncate text-sm text-muted sm:block">
                        {m.subject || m.message}
                      </span>
                      <span className="ml-auto shrink-0 font-mono text-[11px] text-muted">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {tab === "messages" && <MessagesPanel />}
        {tab === "projects" && <ProjectsPanel />}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: number | string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 ${
        accent ? "border-lime/30 bg-lime/5" : "border-line bg-panel"
      }`}
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</p>
      <p className={`mt-3 font-display text-4xl font-extrabold ${accent ? "text-lime-bright" : ""}`}>
        {value}
      </p>
      <p className="mt-1 font-mono text-[11px] text-muted/70">{hint}</p>
    </div>
  );
}
