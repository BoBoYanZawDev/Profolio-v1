"use client";

const WORDS_A = ["REACT", "LARAVEL", "PHP", "NEXT.JS", "TYPESCRIPT", "MYSQL"];
const WORDS_B = ["GSAP", "PRISMA", "THREE.JS", "ZUSTAND", "REST APIs", "TAILWIND"];

function Row({ words, reverse = false }: { words: string[]; reverse?: boolean }) {
  const doubled = [...words, ...words];
  return (
    <div className="flex overflow-hidden border-y border-line py-4">
      <div
        className={`flex shrink-0 items-center gap-8 pr-8 ${
          reverse ? "animate-marquee-rev" : "animate-marquee"
        }`}
      >
        {doubled.map((w, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span
              className={`font-display text-3xl font-extrabold tracking-tight md:text-5xl ${
                i % 2 === 0 ? "text-stroke" : "text-cream"
              }`}
            >
              {w}
            </span>
            <span className="text-xl text-lime-bright">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-hidden className="relative z-10 -rotate-1 bg-panel/60 py-2 backdrop-blur-sm">
      <Row words={WORDS_A} />
      <Row words={WORDS_B} reverse />
    </section>
  );
}
