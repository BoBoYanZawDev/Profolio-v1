"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useUIStore } from "@/store/ui";

export default function Preloader() {
  const setLoaded = useUIStore((s) => s.setLoaded);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const counter = { value: 0 };
    const counterEl = el.querySelector(".pre-counter");

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setLoaded(true);
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterEl) counterEl.textContent = String(Math.round(counter.value)).padStart(3, "0");
      },
    })
      .to(".pre-progress", { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, "<")
      .to(".pre-word", { yPercent: -120, duration: 0.5, ease: "power3.in", stagger: 0.06 })
      .to(el, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "-=0.15")
      .set(el, { display: "none" });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [setLoaded]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[400] flex flex-col items-center justify-center bg-ink"
    >
      <div className="overflow-hidden">
        <p className="pre-word font-display text-2xl font-extrabold tracking-tight">
          BO BO YAN ZAW<span className="text-lime-bright">.</span>
        </p>
      </div>
      <div className="overflow-hidden">
        <p className="pre-word mt-2 font-mono text-xs uppercase tracking-[0.35em] text-muted">
          Full—Stack Web Developer
        </p>
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 md:bottom-10 md:right-10">
        <span className="pre-counter font-display text-7xl font-extrabold text-stroke-lime md:text-9xl">
          000
        </span>
      </div>
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-line">
        <div className="pre-progress h-full origin-left scale-x-0 bg-lime" />
      </div>
    </div>
  );
}
