"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SectionHeading({
  kicker,
  title,
  accent,
  align = "left",
}: {
  kicker: string;
  title: string;
  accent?: string;
  align?: "left" | "center";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sh-kicker",
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          scrollTrigger: { trigger: ref.current, start: "top 82%" },
        }
      );
      gsap.fromTo(
        ".sh-line-inner",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const words = title.split(" ");

  return (
    <div
      ref={ref}
      className={`mb-14 ${align === "center" ? "text-center" : ""}`}
    >
      <p className="sh-kicker mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-lime-bright">
        <span className="inline-block h-px w-8 bg-lime" />
        {kicker}
        {align === "center" && <span className="inline-block h-px w-8 bg-lime" />}
      </p>
      <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-tight">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
            <span className={`sh-line-inner inline-block ${accent && w === accent ? "text-lime-bright" : ""}`}>
              {w}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}
