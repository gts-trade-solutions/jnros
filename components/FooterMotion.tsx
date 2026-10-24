"use client";

import { ArrowUp } from "lucide-react";
import { useRef } from "react";
import { scrollToTarget, useLenis } from "@/components/SmoothScroll";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useIdle } from "@/lib/useIdle";
import { useNear } from "@/lib/useNear";

/** Full-width wordmark; letters rise from below with a stagger, with slight parallax. */
export function FooterWordmark({ text }: { text: string }) {
  const root = useRef<HTMLDivElement>(null);
  const near = useNear(root);

  useGSAP(
    () => {
      if (!near) return;
      const letters = gsap.utils.toArray<HTMLElement>("[data-letter]", root.current);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(letters, {
          yPercent: 100,
          duration: 1.4,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 95%", once: true },
        });
        gsap.fromTo(
          root.current,
          { yPercent: 12 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );
      });
    },
    { scope: root, dependencies: [near] },
  );

  return (
    <div ref={root} aria-hidden="true" className="select-none overflow-hidden">
      <p className="flex font-display text-wordmark tracking-[-0.01em] text-navy-800">
        {text.split("").map((letter, i) => (
          <span key={i} data-letter className="block">
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
}

const R = 22;
const C = 2 * Math.PI * R;

/** Back to top, with a ring showing how far down the page you are. */
export function BackToTop() {
  const ring = useRef<SVGCircleElement>(null);
  const lenis = useLenis();
  const idle = useIdle();

  useGSAP(() => {
    if (!idle) return;
    gsap.fromTo(
      ring.current,
      { strokeDashoffset: C },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3, refreshPriority: -1 },
      },
    );
  }, [idle]);

  return (
    <button
      type="button"
      onClick={() => scrollToTarget(lenis, 0)}
      aria-label="Back to top"
      className="group relative grid size-14 place-items-center rounded-full text-white"
    >
      <svg viewBox="0 0 50 50" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="25" cy="25" r={R} fill="none" stroke="rgb(255 255 255 / 0.15)" strokeWidth="1.5" />
        <circle
          ref={ring}
          cx="25"
          cy="25"
          r={R}
          fill="none"
          stroke="#FF6B1A"
          strokeWidth="1.5"
          strokeDasharray={C}
          strokeDashoffset={C}
          strokeLinecap="round"
        />
      </svg>
      <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
    </button>
  );
}
