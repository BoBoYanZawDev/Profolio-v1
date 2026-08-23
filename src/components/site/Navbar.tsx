"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useUIStore } from "@/store/ui";
import Magnetic from "@/components/Magnetic";
import Logo from "@/components/Logo";
import { SITE } from "@/lib/data";

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
      <header
        className={`fixed inset-x-0 top-0 z-[120] flex items-center justify-between px-5 py-5 transition-colors duration-500 md:px-10 ${
          menuOpen ? "text-ink" : "text-cream mix-blend-difference"
        }`}
      >
        <Link
          href="#top"
          onClick={closeMenu}
          className="flex items-center"
          style={menuOpen ? { color: "#06060b", mixBlendMode: "normal" } : undefined}
        >
          <Logo className="h-5 w-auto md:h-6" mono={menuOpen} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.slice(0, 4).map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={closeMenu}

              className="group relative font-mono text-xs uppercase tracking-widest"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-lime transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <Magnetic strength={0.25}>
            <a
              href="#contact"
              onClick={closeMenu}

              className="rounded-full border border-lime px-5 py-2 font-mono text-xs uppercase tracking-widest text-lime-bright transition-colors duration-300 hover:bg-[var(--accent-hover)] hover:text-ink"
            >
              Hire Me
            </a>
          </Magnetic>
        </nav>

        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"

          className={`relative z-[130] flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border transition-colors md:hidden ${
            menuOpen ? "border-ink/30" : "border-cream/20"
          }`}
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
