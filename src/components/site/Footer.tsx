"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { SITE } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row md:px-10">
        <Logo className="h-5 w-auto" />
        <nav className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs uppercase tracking-widest text-muted">
          {SITE.socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="hover:text-lime-bright">
              {s.label} ↗
            </a>
          ))}
          <Link href="/admin/login" className="hover:text-lime-bright">
            Admin
          </Link>
        </nav>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}

          className="font-mono text-xs uppercase tracking-widest text-muted hover:text-lime-bright"
        >
          Back to top ↑
        </button>
      </div>
      <p className="pb-8 text-center font-mono text-[11px] uppercase tracking-widest text-muted/60">
        © {new Date().getFullYear()} {SITE.name} — Built with Next.js · GSAP · Three.js · Prisma
      </p>
    </footer>
  );
}
