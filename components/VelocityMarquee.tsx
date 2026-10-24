"use client";

import { Fragment, useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIdle } from "@/lib/useIdle";

/**
 * Huge outlined strip. The drift is a CSS animation (compositor thread, no per-frame JS);
 * scrolling speeds it up and skews it (up to 8°) by changing the animation's playbackRate, and a
 * negative rate reverses it when the visitor scrolls up. Static for reduced motion.
 */
export function VelocityMarquee({ items }: { items: string[] }) {
  const root = useRef<HTMLElement>(null);
  const skewer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const idle = useIdle();

  useGSAP(
    () => {
      if (!idle) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const drift = track.current?.getAnimations()[0];
        if (!drift) return;
        const rate = { value: 1 };
        const applyRate = () => {
          drift.playbackRate = rate.value;
        };
        const skewTo = gsap.quickTo(skewer.current, "skewX", { duration: 0.5, ease: "power3" });
        let settle: ReturnType<typeof setTimeout> | undefined;

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? drift.play() : drift.pause()),
          // Only runs while scrolling, so nothing ticks when the page is still.
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const direction = self.direction || 1;
            const boost = Math.min(Math.abs(velocity) / 450, 7);
            gsap.to(rate, {
              value: direction * (1 + boost),
              duration: 0.25,
              overwrite: true,
              onUpdate: applyRate,
              onComplete: () => {
                gsap.to(rate, { value: direction, duration: 1.4, ease: "power2.out", onUpdate: applyRate });
              },
            });
            skewTo(gsap.utils.clamp(-8, 8, -velocity / 280));
            clearTimeout(settle);
            settle = setTimeout(() => skewTo(0), 140);
          },
        });

        return () => {
          clearTimeout(settle);
          st.kill();
          drift.playbackRate = 1;
        };
      });
    },
    { scope: root, dependencies: [idle] },
  );

  const row = (copy: boolean) => (
    <div aria-hidden={copy || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <Fragment key={item}>
          <span className="text-outline px-[0.25em] font-display text-marquee font-semibold uppercase">
            {item}
          </span>
          <span aria-hidden="true" className="mx-[0.2em] size-[clamp(0.75rem,1.4vw,1.25rem)] rounded-full bg-orange" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <section ref={root} aria-label="Cargo we handle" className="overflow-hidden bg-offwhite py-8 text-navy md:py-10">
      <div ref={skewer}>
        <div ref={track} className="marquee-track flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
