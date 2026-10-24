"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useNear } from "@/lib/useNear";

type Tag = "div" | "ul" | "ol" | "li" | "section";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  /** Reveal <RevealItem> descendants in batches as they enter, instead of the whole block at once. */
  stagger?: number;
};

/** Fades content up once it scrolls into view (opacity only for reduced motion). */
export function Reveal({ children, className, as = "div", delay = 0, stagger }: Props) {
  const ref = useRef<HTMLElement>(null);
  const near = useNear(ref);

  useGSAP(
    () => {
      if (!near) return;
      const root = ref.current!;
      gsap.set(root, { visibility: "visible" });
      const items = gsap.utils
        .toArray<HTMLElement>(root.querySelectorAll("[data-reveal-item]"))
        .filter((el) => el.closest("[data-reveal-root]") === root);

      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, reduce: MQ.reduce }, (ctx) => {
        const y = ctx.conditions?.reduce ? 0 : 40;
        const duration = ctx.conditions?.reduce ? 0.6 : 1.1;

        if (stagger && items.length) {
          gsap.set(items, { autoAlpha: 0, y });
          ScrollTrigger.batch(items, {
            start: "top 90%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { autoAlpha: 1, y: 0, duration, delay, stagger, ease: "expo.out", overwrite: true }),
          });
          return;
        }
        gsap.from(root, {
          autoAlpha: 0,
          y,
          duration,
          delay,
          ease: "expo.out",
          scrollTrigger: { trigger: root, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref, dependencies: [near] },
  );

  const Component = as as "div";
  return (
    <Component ref={ref as React.Ref<HTMLDivElement>} data-reveal-root="" data-pre="" className={className}>
      {children}
    </Component>
  );
}

export function RevealItem({ children, className, as = "div" }: Omit<Props, "stagger" | "delay">) {
  const Component = as as "div";
  return (
    <Component data-reveal-item="" className={className}>
      {children}
    </Component>
  );
}
