"use client";

import { useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { gsap } from "gsap";
import SectionHeading from "./SectionHeading";
import { useContactStore } from "@/store/contact";
import { SITE } from "@/lib/data";

function InfoCard({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="contact-card flex items-start gap-4 rounded-2xl border border-line bg-panel2 p-5 transition-colors duration-300 hover:border-cream/20">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-lime-bright">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</p>
        <div className="mt-1 font-medium text-cream/90">{children}</div>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-ink/60 px-4 py-3.5 text-cream outline-none transition-all duration-300 placeholder:text-muted/50 focus:border-lime focus:bg-ink focus:ring-4 focus:ring-lime/10";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { name, email, subject, message, status, error, setField, submit, reset } =
    useContactStore();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-card",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-grid", start: "top 78%" },
        }
      );
      gsap.fromTo(
        ".contact-form",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-grid", start: "top 74%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status !== "sending") await submit();
  }

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-panel py-28 md:py-40">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 38% at 88% 12%, rgba(124,92,255,.16), transparent), radial-gradient(40% 32% at 8% 92%, rgba(124,92,255,.08), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading kicker="05 — Say Hello" title="LET'S WORK TOGETHER" accent="TOGETHER" />

        <div className="contact-grid grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          {/* info cards */}
          <div className="flex flex-col gap-4">
            <InfoCard icon={<MailIcon />} label="Email me at">
              <a
                href={`mailto:${SITE.email}`}
                className="break-all transition-colors hover:text-lime-bright"
              >
                {SITE.email}
              </a>
            </InfoCard>

            <InfoCard icon={<PhoneIcon />} label="Call me">
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-lime-bright"
              >
                {SITE.phone}
              </a>
            </InfoCard>

            <InfoCard icon={<PinIcon />} label="Based in">
              {SITE.location}
              <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-muted">
                (GMT+6:30)
              </span>
            </InfoCard>

            <InfoCard icon={<ClockIcon />} label="Response time">
              Usually within 24 hours
            </InfoCard>

            <div className="contact-card rounded-2xl border border-lime/25 bg-lime/[0.06] p-5">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-lime-bright">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                </span>
                Currently available
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Taking on new freelance projects &amp; full-time opportunities.
                Let&apos;s turn your idea into a product.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SITE.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"

                    className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:border-lime hover:text-lime-bright"
                  >
                    {s.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* form */}
          <form
            onSubmit={onSubmit}
            className="contact-form relative overflow-hidden rounded-3xl border border-line bg-panel2 p-6 md:p-9"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent2 to-lime" />

            <h3 className="font-display text-2xl font-bold tracking-tight">
              Send me a message
              <span className="text-lime-bright">.</span>
            </h3>
            <p className="mt-1.5 text-sm text-muted">
              Tell me about your project — scope, timeline and ideas.
            </p>

            <div className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted">
                    Your name *
                  </span>
                  <input
                    className={inputCls}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setField("name", e.target.value)}
                    maxLength={80}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted">
                    Email address *
                  </span>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setField("email", e.target.value)}
                    maxLength={120}
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted">
                  Subject
                </span>
                <input
                  className={inputCls}
                  placeholder="New e-commerce website, SaaS dashboard…"
                  value={subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  maxLength={140}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted">
                  Message *
                  <span className="normal-case tracking-normal text-muted/60">
                    {message.length}/3000
                  </span>
                </span>
                <textarea
                  className={`${inputCls} min-h-36 resize-y`}
                  placeholder="Hi Aung, I have a project in mind…"
                  value={message}
                  onChange={(e) => setField("message", e.target.value)}
                  maxLength={3000}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={status === "sending"}

                className="liquid-glass-accent group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl py-4 font-mono text-sm font-medium uppercase tracking-widest text-cream transition-all duration-300 hover:brightness-110 disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
                    Sending…
                  </>
                ) : status === "success" ? (
                  <>
                    Message Sent ✓
                  </>
                ) : (
                  <>
                    Send Message
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </>
                )}
              </button>

              {status === "error" && (
                <p className="rounded-xl border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
                  {error}
                </p>
              )}
              {status === "success" && (
                <div className="flex items-center justify-between rounded-xl border border-lime/30 bg-lime/10 px-4 py-3 text-sm text-lime-bright">
                  <span>Thanks! Your message is saved — I&apos;ll reply soon.</span>
                  <button
                    type="button"
                    onClick={reset}
                    className="shrink-0 underline underline-offset-4 hover:text-cream"
                  >
                    Send another
                  </button>
                </div>
              )}

              <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted/60">
                Stored securely · No spam, ever
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
