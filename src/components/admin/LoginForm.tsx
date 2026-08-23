"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Login failed");
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="glass relative z-10 w-full max-w-md rounded-3xl p-8 md:p-10">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-lime-bright">
        DevFolio Admin
      </p>
      <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
        Welcome back<span className="text-lime-bright">.</span>
      </h1>
      <p className="mt-2 text-sm text-muted">
        Sign in to manage messages &amp; projects.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="email" className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@devfolio.com"
            className="underline-input"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="underline-input"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}

          className="w-full rounded-full bg-lime py-3.5 hover:bg-[var(--accent-hover)] font-mono text-sm font-medium uppercase tracking-widest text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In →"}
        </button>
      </form>

      <p className="mt-6 rounded-xl border border-line bg-panel2 px-4 py-3 font-mono text-[11px] leading-relaxed text-muted">
        Default dev credentials (from .env):<br />
        admin@devfolio.com / admin123 — change before deploying.
      </p>

      <Link href="/" className="mt-6 inline-block font-mono text-xs uppercase tracking-widest text-muted hover:text-lime-bright">
        ← Back to portfolio
      </Link>
    </div>
  );
}
