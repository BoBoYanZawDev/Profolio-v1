"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/ui";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "./Preloader";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Marquee from "./Marquee";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Experience from "./Experience";
import Contact from "./Contact";
import Footer from "./Footer";

export default function Site() {
  const loaded = useUIStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) return;
    document.body.style.overflow = "";
  }, [loaded]);

  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
