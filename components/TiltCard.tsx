"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useIdle } from "@/lib/useIdle";
import { cx } from "@/lib/utils";

/** 3D tilt toward the pointer (max 8°) with a light glare sweep. Fine pointers only. */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);
  const idle = useIdle();

  useGSAP(
    () => {
      if (!idle) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.finePointer, () => {
        const el = root.current!;
        gsap.set(card.current, { transformPerspective: 900 });
        const rx = gsap.quickTo(card.current, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(card.current, "rotationY", { duration: 0.6, ease: "power3" });
        const gx = gsap.quickTo(glare.current, "xPercent", { duration: 0.6, ease: "power3" });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry((px - 0.5) * 16);
          rx(-(py - 0.5) * 16);
          gx((px - 0.5) * 120);
        };
        const onEnter = () => gsap.to(glare.current, { autoAlpha: 1, duration: 0.4 });
        const onLeave = () => {
          rx(0);
          ry(0);
          gsap.to(glare.current, { autoAlpha: 0, duration: 0.4 });
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: root, dependencies: [idle] },
  );

  return (
    <div ref={root} data-cursor="view">
      <div ref={card} className={cx("photo relative overflow-hidden [transform-style:preserve-3d]", className)}>
        {children}
        <div
          ref={glare}
          aria-hidden="true"
          className="pointer-events-none invisible absolute -inset-y-1/2 left-0 z-10 w-full -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      </div>
    </div>
  );
}
