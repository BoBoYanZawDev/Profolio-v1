"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";

const SERVICES = [
  {
    title: "Frontend Engineering",
    text: "React & Next.js SPAs and SSR apps — component systems, animation, accessibility and Core Web Vitals.",
    icon: "◆",
  },
  {
    title: "Backend & APIs",
    text: "Laravel / PHP applications with clean architecture, REST APIs, auth, queues, testing and caching.",
    icon: "▲",
  },
  {
    title: "Database Design",
    text: "MySQL schema design, migrations, query optimization and Prisma ORM workflows.",
    icon: "●",
  },
];

export default function Experience() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".exp-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 72%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={ref} className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
      <SectionHeading kicker="04 — What I Do" title="SERVICES" accent="SERVICES" />
      <div className="grid gap-6 md:grid-cols-3">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="exp-card group relative overflow-hidden rounded-2xl border border-line p-8 transition-colors duration-500 hover:bg-panel2"

          >
            <span className="font-display text-4xl text-lime-bright">{s.icon}</span>
            <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            <span className="absolute -bottom-10 -right-4 select-none font-display text-[7rem] font-extrabold leading-none text-stroke opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.14]">
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
