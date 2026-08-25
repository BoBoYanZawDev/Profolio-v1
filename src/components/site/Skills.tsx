"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import PixelCard from "@/components/PixelCard";

const TECH_STACK = [
  { label: "React", icon: "/tech_icon/react.png", colors: "#67e8f9,#38bdf8,#0ea5e9" },
  { label: "Laravel", icon: "/tech_icon/laravel.png", colors: "#fda4af,#fb7185,#e11d48" },
  { label: "PHP", icon: "/tech_icon/php.png", colors: "#c4b5fd,#a78bfa,#7c3aed" },
  { label: "MySQL", icon: "/tech_icon/mysql.png", colors: "#5eead4,#2dd4bf,#0d9488" },
  { label: "TypeScript", icon: "/tech_icon/typescript.png", colors: "#93c5fd,#3b82f6,#1d4ed8" },
  { label: "JavaScript", icon: "/tech_icon/javascript.png", colors: "#fde047,#facc15,#eab308" },
  // { label: "Next.js", icon: "/tech_icon/next.png", colors: "#e5e7eb,#9ca3af,#4b5563" },
  { label: "Vue", icon: "/tech_icon/vue.png", colors: "#86efac,#4ade80,#16a34a" },
  { label: "Tailwind CSS", icon: "/tech_icon/tailwind.png", colors: "#7dd3fc,#38bdf8,#0284c7" },
  { label: "jQuery", icon: "/tech_icon/jquery.png", colors: "#93c5fd,#60a5fa,#2563eb" },
  { label: "Git & GitHub", icon: "/tech_icon/git.png", colors: "#fdba74,#fb923c,#ea580c" },
  { label: "Vite", icon: "/tech_icon/vite.png", colors: "#c4b5fd,#fde047,#a78bfa" },
  { label: "Bootstrap", icon: "/tech_icon/bootstrap.png", colors: "#c4b5fd,#818cf8,#6366f1" },
  { label: "Express", icon: "/tech_icon/express.png", colors: "#e5e7eb,#d1d5db,#9ca3af" },
  // { label: "PostgreSQL", icon: "/tech_icon/postgre.png", colors: "#7dd3fc,#38bdf8,#0369a1" },
  { label: "Ubuntu", icon: "/tech_icon/ubantu.png", colors: "#fdba74,#fb923c,#c2410c" },
];

export default function Skills() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tech-card",
        { opacity: 0, y: 50, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%" },
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
        {/* <p className="mb-12 -mt-6 font-mono text-xs uppercase tracking-[0.3em] text-muted">
          {"// hover the cards"}
        </p> */}

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {TECH_STACK.map((tech, i) => (
            <PixelCard
              key={tech.label}
              colors={tech.colors}
              gap={5}
              speed={35}
              className="tech-card tech-pixel-card cursor-pointer"
            >
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-4 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tech.icon}
                  alt={tech.label}
                  loading="lazy"
                  style={{ animationDelay: `${i * 0.18}s` }}
                  className="tech-icon-float h-35 w-35 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                />
                <span className="font-mono text-[11px] uppercase tracking-widest text-cream">
                  {tech.label}
                </span>
              </div>
            </PixelCard>
          ))}
        </div>
      </div>
    </section>
  );
}
