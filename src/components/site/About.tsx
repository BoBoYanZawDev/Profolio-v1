"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { SITE, TIMELINE } from "@/lib/data";

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-para",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          scrollTrigger: { trigger: ".about-paras", start: "top 78%" },
        }
      );
      gsap.fromTo(
        ".tl-item",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.12,
          scrollTrigger: { trigger: ".tl-list", start: "top 80%" },
        }
      );
      gsap.to(".about-big", {
        xPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={ref} className="relative mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
      <SectionHeading kicker="01 — Who I Am" title="ABOUT ME" accent="ME" />

      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="about-paras space-y-6 text-lg leading-relaxed text-muted">
          {SITE.about.map((p, i) => (
            <p key={i} className={`about-para ${i === 0 ? "text-cream/90" : ""}`}>
              {p}
            </p>
          ))}
          <div className="about-para flex flex-wrap items-center gap-3 pt-2">
            {["React", "Laravel", "PHP", "MySQL"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-widest"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="about-para pt-3">
            <a
              href="/BoBoYanZaw_Resume.pdf"
              download="BoBoYanZaw_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-lime/40 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-lime-bright transition-colors duration-300 hover:bg-lime hover:text-ink"
            >
              Download Resume (PDF)
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>
        </div>

        <ol className="tl-list relative space-y-10 border-l border-line pl-8">
          {TIMELINE.map((item) => (
            <li key={item.title} className="tl-item group relative">
              <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border border-lime bg-ink transition-colors duration-300 group-hover:bg-lime" />
              <p className="font-mono text-xs uppercase tracking-widest text-lime-bright">{item.year}</p>
              <h3 className="mt-1 font-display text-xl font-bold">{item.title}</h3>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">{item.company}</p>
              <p className="mt-2 max-w-md leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="pointer-events-none mt-24 select-none overflow-hidden">
        <p className="about-big whitespace-nowrap font-display text-[clamp(4rem,14vw,13rem)] font-extrabold leading-none text-stroke opacity-30">
          CODE · DESIGN · SHIP · REPEAT
        </p>
      </div>
    </section>
  );
}
