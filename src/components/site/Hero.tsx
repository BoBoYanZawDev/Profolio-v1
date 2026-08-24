"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { useUIStore } from "@/store/ui";
import Magnetic from "@/components/Magnetic";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

type Token = { t: string; c: string };

const CODE: Token[][] = [
  [
    { t: "const ", c: "text-accent2" },
    { t: "developer", c: "text-lime-bright" },
    { t: " = {", c: "text-cream" },
  ],
  [
    { t: "  name", c: "text-cream" },
    { t: ": ", c: "text-muted" },
    { t: "'Bo Bo Yan Zaw'", c: "text-lime-bright" },
    { t: ",", c: "text-muted" },
  ],
  [
    { t: "  role", c: "text-cream" },
    { t: ": ", c: "text-muted" },
    { t: "'Full-Stack Web Developer'", c: "text-lime-bright" },
    { t: ",", c: "text-muted" },
  ],
  [
    { t: "  stack", c: "text-cream" },
    { t: ": [", c: "text-muted" },
  ],
  [{ t: "    'PHP', 'Laravel',", c: "text-accent2" }],
  [{ t: "    'React', 'jQuery',", c: "text-accent2" }],
  [{ t: "    'MySQL', 'Git',", c: "text-accent2" }],
  [
    { t: "  ],", c: "text-muted" },
  ],
  [
    { t: "  passion", c: "text-cream" },
    { t: ": ", c: "text-muted" },
    { t: "'clean code '", c: "text-lime-bright" },
    { t: "+ ", c: "text-muted" },
    { t: "'scalable apps'", c: "text-lime-bright" },
    { t: ",", c: "text-muted" },
  ],
  [
    { t: "  hireable", c: "text-cream" },
    { t: ": ", c: "text-muted" },
    { t: "true", c: "text-accent2" },
    { t: ",", c: "text-muted" },
  ],
  [{ t: "};", c: "text-cream" }],
];

const TOTAL = CODE.reduce(
  (acc, line) => acc + line.reduce((a, t) => a + t.t.length, 0) + 1,
  0
);

function sliceLine(tokens: Token[], count: number): Token[] {
  const out: Token[] = [];
  let left = count;
  for (const tok of tokens) {
    if (left <= 0) break;
    out.push({ t: tok.t.slice(0, left), c: tok.c });
    left -= tok.t.length;
  }
  return out;
}

const BADGES = [
  {
    label: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    pos: "-left-4 top-10 lg:-left-10",
    delay: 0,
  },
  {
    label: "Laravel",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
    pos: "-right-3 top-24 lg:-right-8",
    delay: 0.7,
  },
  {
    label: "PHP",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
    pos: "-left-3 bottom-20 lg:-left-8",
    delay: 1.3,
  },
  {
    label: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    pos: "-right-3 top-1/2 lg:-right-8",
    delay: 2.4,
  },
  {
    label: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    pos: "-right-2 bottom-8 lg:-right-6",
    delay: 1.9,
  },
];

export default function Hero() {
  const loaded = useUIStore((s) => s.loaded);
  const rootRef = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState(0);

  /* typewriter loop — slow typing, gradual delete (no instant reset) */
  useEffect(() => {
    if (!loaded) return;
    let i = 0;
    let dir: 1 | -1 = 1;
    let handle: ReturnType<typeof setTimeout>;
    const step = () => {
      i += dir;
      if (i >= TOTAL) {
        i = TOTAL;
        setTyped(i);
        dir = -1;
        handle = setTimeout(step, 4500);
        return;
      }
      if (i <= 0) {
        i = 0;
        setTyped(i);
        dir = 1;
        handle = setTimeout(step, 900);
        return;
      }
      setTyped(i);
      handle = setTimeout(
        step,
        dir === 1 ? 55 + Math.random() * 55 : 35 + Math.random() * 35
      );
    };
    handle = setTimeout(step, 1500);
    return () => clearTimeout(handle);
  }, [loaded]);

  /* intro + parallax */
  useEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".hl-char",
        { yPercent: 130, rotate: 10, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)",
          stagger: 0.045,
        },
        0.2
      )
        .fromTo(
          ".hero-el",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 },
          "-=0.5"
        )
        .fromTo(
          ".code-window",
          { opacity: 0, y: 40, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9 },
          0.55
        )
        .fromTo(
          ".float-badge",
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.08 },
          "-=0.45"
        );

      BADGES.forEach((b) => {
        gsap.to(`.badge-${b.label}`, {
          y: -9,
          duration: 2.4,
          delay: b.delay,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });

      gsap.to(".hero-content", {
        yPercent: -6,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [loaded]);

  const rendered = useMemo(() => {
    let remaining = typed;
    return CODE.map((line) => {
      const sliced = sliceLine(line, remaining);
      remaining -= line.reduce((a, t) => a + t.t.length, 0) + 1;
      return sliced;
    });
  }, [typed]);

  return (
    <section id="top" ref={rootRef} className="relative overflow-hidden">
      <HeroScene />
      {/* grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(#f2efe9 1px, transparent 1px), linear-gradient(90deg,#f2efe9 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 40%, black 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 40%, black 30%, transparent 78%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(124,92,255,.14),transparent_55%)]" />

      <div className="relative z-10 mx-auto grid min-h-svh w-full max-w-7xl items-center gap-14 px-5 pb-16 pt-32 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* left — copy */}
        <div className="hero-content">
          <p className="hero-el mb-6 font-mono text-sm text-lime-bright">
            {"// hi, I'm Bo Bo Yan Zaw"}
          </p>

          <h1 className="font-display text-[clamp(2.4rem,7.2vw,5.8rem)] font-extrabold leading-[1.02] tracking-tight">
            <span className="block overflow-hidden pb-1 hl-line">
              <span className="whitespace-nowrap">
                {"FULL—STACK".split("").map((c, i) => (
                  <span key={i} className="hl-char inline-block will-change-transform">
                    {c}
                  </span>
                ))}
              </span>
            </span>
            <span className="block overflow-hidden pb-2 hl-line">
              <span className="whitespace-nowrap">
                {"DEVELOPER".split("").map((c, i) => (
                  <span
                    key={i}
                    className="hl-char hl-char-outline inline-block will-change-transform"
                  >
                    {c}
                  </span>
                ))}
                <span className="text-lime-bright">.</span>
              </span>
            </span>
          </h1>

          <p className="hero-el mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
            I design and build complete web products — expressive{" "}
            <span className="text-cream">React</span> frontends, rock-solid{" "}
            <span className="text-cream">Laravel &amp; PHP</span> backends and{" "}
            <span className="text-cream">MySQL</span> databases that scale.
          </p>

          <div className="hero-el mt-9 flex flex-wrap items-center gap-4">
            <Magnetic strength={0.25}>
              <a
                href="#work"

                className="liquid-glass-accent group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-widest text-cream transition-all duration-300 hover:brightness-125"
              >
                View My Work
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#contact"

                className="liquid-glass rounded-full px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-cream transition-all duration-300 hover:brightness-125"
              >
                Get In Touch
              </a>
            </Magnetic>
          </div>

          <dl className="hero-el mt-12 flex gap-10 border-t border-line pt-7">
            {[
              ["2", "Years Experience"],
              ["6", "Business Apps"],
              ["5", "API Integrations"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="font-display text-3xl font-extrabold text-cream">
                  {n}
                  <span className="text-lime-bright">+</span>
                </dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* right — code window */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="code-window glass relative rounded-2xl shadow-[0_30px_80px_-20px_rgba(124,92,255,0.25)]">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red/80" />
              <span className="h-3 w-3 rounded-full bg-[#f5bf4f]/80" />
              <span className="h-3 w-3 rounded-full bg-lime/80" />
              <span className="ml-4 rounded-md bg-panel px-3 py-1 font-mono text-xs text-cream/80">
                developer.ts
              </span>
              <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-widest text-muted sm:block">
                portfolio · v2.0
              </span>
            </div>
            <pre className="min-h-[320px] overflow-x-auto p-5 font-mono text-[12.5px] leading-6 md:p-6 md:text-[13px] md:leading-7">
              {rendered.map((line, i) => (
                <div key={i} className="flex whitespace-pre">
                  <span className="w-8 shrink-0 select-none pr-4 text-right text-muted/40">
                    {i + 1}
                  </span>
                  <code>
                    {line.map((tok, j) => (
                      <span key={j} className={tok.c}>
                        {tok.t}
                      </span>
                    ))}
                    {i === rendered.length - 1 && loaded && (
                      <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-lime align-middle" />
                    )}
                  </code>
                </div>
              ))}
            </pre>
          </div>

          {/* floating tech badges */}
          {BADGES.map((b) => (
            <span
              key={b.label}
              className={`float-badge badge-${b.label} absolute ${b.pos} hidden items-center gap-2 rounded-full border border-line bg-ink/85 px-4 py-2 font-mono text-xs uppercase tracking-widest backdrop-blur sm:flex`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.icon} alt="" className="h-4 w-4" loading="lazy" />
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#about"
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 md:block"
        aria-label="Scroll to about section"
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-line p-1.5">
          <span className="h-2.5 w-px animate-bounce bg-lime" />
        </div>
      </a>
    </section>
  );
}
