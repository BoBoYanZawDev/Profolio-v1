"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useUIStore } from "@/store/ui";
import Logo from "@/components/Logo";
import { SITE } from "@/lib/data";

const SOCIAL_ICONS: Record<string, ReactNode> = {
  GitHub: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  LinkedIn: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  ),
  Facebook: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Instagram: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
};

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const menuOpen = useUIStore((s) => s.menuOpen);
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const closeMenu = useUIStore((s) => s.closeMenu);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const tl = gsap.timeline({ paused: true });
    tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
      .fromTo(
        overlay,
        { clipPath: "circle(0% at calc(100% - 44px) 44px)" },
        { clipPath: "circle(150% at calc(100% - 44px) 44px)", duration: 0.7, ease: "power4.inOut" }
      )
      .fromTo(
        ".menu-link-inner",
        { yPercent: 120 },
        { yPercent: 0, stagger: 0.07, duration: 0.55, ease: "power3.out" },
        "-=0.25"
      )
      .fromTo(
        ".menu-meta",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.4 },
        "-=0.3"
      );
    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (menuOpen) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.6).reverse();
    }
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[120] border-b border-white/5 bg-ink/70 backdrop-blur-xl">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
          {/* left — logo + name */}
          <Link href="#top" onClick={closeMenu} className="flex items-center gap-3">
            <Logo className="h-5 w-auto md:h-6" />
          </Link>

          {/* center — glass pill nav */}
          <nav className="liquid-glass-purple absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full p-1.5 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={closeMenu}
                className="rounded-full px-4 py-2 text-sm text-cream/75 transition-colors duration-300 hover:bg-white/10 hover:text-cream"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* right — CV + socials + mobile toggle */}
          <div className="flex items-center gap-5">
            <div className="hidden items-center gap-5 md:flex">
              {/* <a
                href="/BoBoYanZaw_Resume.pdf"
                download="BoBoYanZaw_Resume.pdf"
                className="rounded-full border border-line px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-cream/80 transition-colors duration-300 hover:border-lime hover:text-lime-bright"
              >
                Resume ↓
              </a> */}
              {SITE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="text-cream/70 transition-colors duration-300 hover:text-cream"
                >
                  {SOCIAL_ICONS[s.label]}
                </a>
              ))}
            </div>
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="liquid-glass relative z-[130] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full md:hidden"
            >
              <span
                className={`h-px w-5 bg-current transition-transform duration-300 ${
                  menuOpen ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-5 bg-current transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* fullscreen mobile menu */}
      <div
        ref={overlayRef}
        style={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
        className="invisible fixed inset-0 z-[110] flex flex-col justify-between bg-lime px-6 pb-10 pt-28 md:hidden"
      >
        <nav className="flex flex-col gap-1">
          {LINKS.map((l, i) => (
            <div key={l.href} className="overflow-hidden">
              <a
                href={l.href}
                onClick={closeMenu}
                className="menu-link-inner block font-display text-5xl font-extrabold tracking-tight text-ink"
              >
                <span className="mr-3 font-mono text-sm align-super">0{i + 1}</span>
                {l.label}
              </a>
            </div>
          ))}
        </nav>
        <div className="space-y-2">
          <p className="menu-meta font-mono text-xs uppercase tracking-widest text-ink/70">
            {SITE.email}
          </p>
          <p className="menu-meta font-mono text-xs uppercase tracking-widest text-ink/70">
            {SITE.location}
          </p>
          <a
            href="/BoBoYanZaw_Resume.pdf"
            download="BoBoYanZaw_Resume.pdf"
            className="menu-meta inline-block font-mono text-xs uppercase tracking-widest text-ink underline"
          >
            Download CV ↓
          </a>
          <Link
            href="/admin/login"
            onClick={closeMenu}
            className="menu-meta inline-block pt-2 font-mono text-xs uppercase tracking-widest text-ink underline"
          >
            Admin Panel →
          </Link>
        </div>
      </div>
    </>
  );
}
