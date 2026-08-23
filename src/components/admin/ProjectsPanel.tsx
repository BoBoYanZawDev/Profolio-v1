"use client";

import { useState } from "react";
import { useAdminStore } from "@/store/admin";
import type { Project } from "@/store/ui";

const ACCENTS = ["#3b82f6", "#60a5fa", "#2563eb", "#38bdf8", "#f59e0b", "#34d399", "#f472b6"];
const CATEGORIES = ["Web App", "E-Commerce", "SaaS Dashboard", "CMS", "API", "Creative Dev"];

type FormState = {
  id?: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  tech: string;
  demoUrl: string;
  repoUrl: string;
  accent: string;
  featured: boolean;
  sortOrder: number;
};

const EMPTY: FormState = {
  title: "",
  slug: "",
  category: "Web App",
  description: "",
  tech: "",
  demoUrl: "",
  repoUrl: "",
  accent: "#3b82f6",
  featured: false,
  sortOrder: 99,
};

function toForm(p: Project): FormState {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    description: p.description,
    tech: p.tech,
    demoUrl: p.demoUrl ?? "",
    repoUrl: p.repoUrl ?? "",
    accent: p.accent,
    featured: p.featured,
    sortOrder: p.sortOrder,
  };
}

export default function ProjectsPanel() {
  const { projects, projectsLoading, saveProject, deleteProject } = useAdminStore();
  const [editing, setEditing] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSave() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    const res = await saveProject(editing);
    setSaving(false);
    if (!res.ok) {
      setError(res.error || "Save failed");
      return;
    }
    setEditing(null);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {projects.length} project{projects.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => {
            setEditing({ ...EMPTY });
            setError(null);
          }}

          className="rounded-full bg-lime px-5 py-2 hover:bg-[var(--accent-hover)] font-mono text-xs uppercase tracking-widest text-ink"
        >
          + New Project
        </button>
      </div>

      {editing && (
        <ProjectForm
          form={editing}
          onChange={setEditing}
          onSave={onSave}
          onCancel={() => setEditing(null)}
          saving={saving}
          error={error}
        />
      )}

      {projectsLoading && projects.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Loading projects…</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {projects.map((p) => (
            <li
              key={p.id}
              className="group flex items-start gap-4 rounded-2xl border border-line bg-panel p-5"
            >
              <span
                className="mt-1 h-10 w-10 shrink-0 rounded-lg"
                style={{ background: `linear-gradient(135deg, ${p.accent}, transparent)` }}
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium">
                  {p.title}
                  {p.featured && <span className="text-xs text-lime-bright">★</span>}
                </p>
                <p className="truncate text-sm text-muted">{p.description}</p>
                <p className="mt-1 truncate font-mono text-[11px] uppercase tracking-wider text-muted/70">
                  {p.category} · #{p.sortOrder} · /{p.slug}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button
                  onClick={() => {
                    setEditing(toForm(p));
                    setError(null);
                  }}
                  className="rounded-full border border-line px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest hover:border-lime hover:text-lime-bright"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${p.title}"?`)) deleteProject(p.id);
                  }}
                  className="rounded-full border border-red/40 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-red hover:bg-red hover:text-ink"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ProjectForm({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
  error,
}: {
  form: FormState;
  onChange: (f: FormState) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}) {
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    onChange({ ...form, [key]: value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="glass space-y-5 rounded-2xl p-6"
    >
      <h3 className="font-display text-xl font-bold">
        {form.id ? `Edit: ${form.title}` : "New Project"}
      </h3>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted">Title *</span>
          <input
            required
            maxLength={100}
            className="underline-input"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="NovaShop"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted">Slug (auto if empty)</span>
          <input
            maxLength={120}
            className="underline-input"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="novashop"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted">Category</span>
          <select
            className="underline-input bg-panel"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted">Tech (comma separated)</span>
          <input
            className="underline-input"
            value={form.tech}
            onChange={(e) => set("tech", e.target.value)}
            placeholder="Laravel, React, MySQL"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted">Demo URL</span>
          <input
            type="url"
            className="underline-input"
            value={form.demoUrl}
            onChange={(e) => set("demoUrl", e.target.value)}
            placeholder="https://…"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted">Repo URL</span>
          <input
            type="url"
            className="underline-input"
            value={form.repoUrl}
            onChange={(e) => set("repoUrl", e.target.value)}
            placeholder="https://github.com/…"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted">Description *</span>
        <textarea
          required
          maxLength={600}
          className="underline-input min-h-24 resize-y"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="What does this project do?"
        />
      </label>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2.5">
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => set("accent", a)}
              aria-label={`Accent ${a}`}
              className={`h-7 w-7 rounded-full transition-transform ${
                form.accent === a ? "scale-110 ring-2 ring-cream ring-offset-2 ring-offset-ink" : ""
              }`}
              style={{ background: a }}
            />
          ))}
        </div>
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 accent-lime"
          />
          Featured ★
        </label>
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          Order #
          <input
            type="number"
            min={0}
            max={999}
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className="w-20 rounded-lg border border-line bg-transparent px-2 py-1.5 text-cream outline-none focus:border-lime"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-xl border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-lime px-7 py-2.5 hover:bg-[var(--accent-hover)] font-mono text-xs uppercase tracking-widest text-ink disabled:opacity-50"
        >
          {saving ? "Saving…" : form.id ? "Save Changes" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-line px-7 py-2.5 font-mono text-xs uppercase tracking-widest text-muted hover:text-cream"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
