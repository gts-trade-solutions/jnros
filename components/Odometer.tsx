"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useNear } from "@/lib/useNear";

const CELLS = 20; // 0–9 twice, so every digit rolls at least one full turn.
const restingOffset = (digit: number) => -((10 + digit) * 100) / CELLS; // yPercent of the strip

/**
 * Mechanical odometer: each digit is a vertical strip that rolls into place, staggered per digit,
 * then the label fades up. Server HTML shows the final figure (also the no-JS and reduced-motion state).
 */
export function Odometer({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const near = useNear(root);
  const digits = String(value).split("").map(Number);

  useGSAP(
    () => {
      if (!near) return;
      const q = gsap.utils.selector(root);
      const strips = q("[data-strip]");
      const labelEl = q("[data-label]");
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.set(strips, { y: 0, yPercent: 0 });
        gsap.set(labelEl, { autoAlpha: 0, y: 14 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 88%", once: true } });
        strips.forEach((strip, i) => {
          tl.to(strip, { yPercent: restingOffset(digits[i]), duration: 1.8, ease: "expo.out" }, i * 0.12);
        });
        tl.to(labelEl, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" }, "-=1");
      });
    },
    { scope: root, dependencies: [near] },
  );

  return (
    <div ref={root} className="flex flex-col-reverse border-l border-white/15 pl-5 md:pl-8">
      <dt data-label className="mt-2 text-sm text-steel">
        {label}
      </dt>
      <dd className="font-condensed text-stat font-semibold">
        <span aria-hidden="true" className="flex">
          {digits.map((digit, i) => (
            <span key={i} className="relative block h-[1em] overflow-hidden">
              <span data-strip className="block" style={{ transform: `translateY(${restingOffset(digit)}%)` }}>
                {Array.from({ length: CELLS }, (_, n) => (
                  <span key={n} className="block h-[1em] text-center tabular-nums">
                    {n % 10}
                  </span>
                ))}
              </span>
            </span>
          ))}
          <span className="text-orange">{suffix}</span>
        </span>
        <span className="sr-only">
          {value}
          {suffix}
        </span>
      </dd>
    </div>
  );
}
