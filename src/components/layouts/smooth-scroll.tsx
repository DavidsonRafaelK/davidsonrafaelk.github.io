"use client";
import Lenis from "lenis";
import { useEffect } from "react";

// Renders nothing; only wires up Lenis smooth-scroll for the page's lifetime.
// Note: globals.css must NOT set `scroll-behavior: smooth` on html — it fights
// Lenis's own rAF-driven scroll and breaks scrolling to the end of the page.
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      // Exponential ease-out; feels smooth without the overshoot of spring easing.
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      wheelMultiplier: 1,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
