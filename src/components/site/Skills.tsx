"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { SKILLS } from "@/lib/data";

export default function Skills() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skill-card",
        { opacity: 0, y: 70, rotateX: -8 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 72%" },
        }
      );
      gsap.fromTo(
        ".skill-chip",
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "back.out(2)",
          stagger: { each: 0.04 },
          scrollTrigger: { trigger: ".skill-grid", start: "center 75%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={ref} className="relative bg-panel py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading
          kicker="02 — My Toolbox"
          title="SKILLS & STACK"
          accent="STACK"
        />
        <div className="skill-grid grid gap-6 md:grid-cols-3" style={{ perspective: "900px" }}>
          {SKILLS.map((group) => (
            <div
              key={group.group}
              className="skill-card group relative overflow-hidden rounded-2xl border border-line bg-panel2 p-8 transition-colors duration-500 hover:border-transparent"

            >
              <div
                className="absolute inset-x-0 top-0 h-1 opacity-80"
                style={{ background: group.accent }}
              />
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-[0.07] blur-2xl transition-opacity duration-500 group-hover:opacity-20"
                style={{ background: group.accent }}
              />
              <h3 className="font-display text-2xl font-bold">{group.group}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                / {group.items.length} tools
              </p>
              <ul className="mt-7 flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="skill-chip rounded-full border border-line px-3.5 py-1.5 text-sm text-cream/85 transition-colors duration-300 hover:border-lime hover:text-lime-bright"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
