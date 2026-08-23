"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { useUIStore, type Project as ProjectType } from "@/store/ui";

function hexToRgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function initials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function ProjectCard({ project, index }: { project: ProjectType; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo(((e.clientX - r.left) / r.width - 0.5) * 10);
      yTo(-((e.clientY - r.top) / r.height - 0.5) * 10);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const techList = project.tech.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div style={{ perspective: "1000px" }}>
      <article
        ref={cardRef}
        className="group relative overflow-hidden rounded-2xl border border-line bg-panel2 transition-colors duration-500 hover:border-cream/20"


      >
        {/* cover */}
        <div
          className="relative flex h-52 items-center justify-center overflow-hidden md:h-60"
          style={{
            background: `radial-gradient(120% 140% at 20% 10%, ${hexToRgba(project.accent, 0.55)}, transparent 60%), radial-gradient(120% 140% at 85% 90%, ${hexToRgba(project.accent, 0.3)}, transparent 55%), #0a0a14`,
          }}
        >
          <span
            className="pointer-events-none select-none font-display text-[7rem] font-extrabold leading-none opacity-25 transition-transform duration-700 group-hover:scale-110 md:text-[9rem]"
            style={{ color: project.accent }}
          >
            {initials(project.title)}
          </span>
          <span
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(242,239,233,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(242,239,233,.35) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
              maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
            }}
          />
          <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-cream/80 backdrop-blur">
            {project.category}
          </span>
          {project.featured && (
            <span className="absolute right-4 top-4 rounded-full bg-lime px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-ink">
              ★ Featured
            </span>
          )}
        </div>

        <div className="p-6 md:p-7">
          <h3 className="font-display text-2xl font-bold tracking-tight">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 leading-relaxed text-muted">
            {project.description}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {techList.slice(0, 5).map((t) => (
              <li
                key={t}
                className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-cream/75"
              >
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-5 font-mono text-xs uppercase tracking-widest">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-lime-bright underline-offset-4 hover:underline">
                Live Demo ↗
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-muted underline-offset-4 hover:text-cream hover:underline">
                Source ↗
              </a>
            )}
            {!project.demoUrl && !project.repoUrl && (
              <span className="text-muted">Case study soon</span>
            )}
          </div>
        </div>
      </article>
      <p className="mt-2 hidden font-mono text-xs text-muted">0{index + 1}</p>
    </div>
  );
}

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const projects = useUIStore((s) => s.projects);
  const status = useUIStore((s) => s.projectsStatus);
  const fetchProjects = useUIStore((s) => s.fetchProjects);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (!projects.length || !gridRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".project-card-wrap",
        { opacity: 0, y: 70 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".projects-grid", start: "top 78%" },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [projects]);

  return (
    <section id="work" ref={ref} className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
      <div className="flex items-end justify-between">
        <SectionHeading kicker="03 — Selected Work" title="PROJECTS" accent="PROJECTS" />
        <p className="mb-14 hidden font-mono text-xs uppercase tracking-widest text-muted md:block">
          {status === "ready" ? `${projects.length} shipped` : "loading…"}
        </p>
      </div>

      {status === "error" && (
        <p className="rounded-xl border border-red/30 bg-red/10 p-4 font-mono text-sm text-red">
          Couldn&apos;t load projects. Check the database connection.
        </p>
      )}

      <div ref={gridRef} className="projects-grid grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => (
          <div key={p.id} className="project-card-wrap">
            <ProjectCard project={p} index={i} />
          </div>
        ))}
      </div>

      {status === "ready" && projects.length === 0 && (
        <p className="font-mono text-sm text-muted">
          No projects yet — add them from the admin panel at /admin.
        </p>
      )}
    </section>
  );
}
