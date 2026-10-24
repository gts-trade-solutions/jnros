"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useNear } from "@/lib/useNear";
import type { SiteImage } from "@/lib/data";
import { cx } from "@/lib/utils";

type Props = {
  image: SiteImage;
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** Inner scroll parallax (desktop only). */
  parallax?: boolean;
};

/**
 * Curtain wipe: an orange panel slides across the frame and out the other side, revealing the
 * photo as it settles from 1.3x to 1x. On desktop the photo then drifts slower than its frame.
 */
export function ImageReveal({ image, sizes, className, imageClassName, parallax = true }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const near = useNear(root);

  useGSAP(
    () => {
      if (!near) return;
      const q = gsap.utils.selector(root);
      const curtain = q("[data-curtain]");
      const inner = q("[data-inner]");
      const scaler = q("[data-scale]");
      const trigger = { trigger: root.current, start: "top 82%", once: true };
      const mm = gsap.matchMedia();

      mm.add(MQ.reduce, () => {
        gsap.from(inner, { autoAlpha: 0, duration: 0.8, ease: "none", scrollTrigger: trigger });
      });

      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        gsap.set(inner, { autoAlpha: 0 });
        gsap
          .timeline({ scrollTrigger: trigger })
          .fromTo(curtain, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.6, ease: "power3.in" })
          .set(inner, { autoAlpha: 1 })
          .set(curtain, { transformOrigin: "right center" })
          .to(curtain, { scaleX: 0, duration: 0.7, ease: "power3.out" })
          .fromTo(scaler, { scale: 1.3 }, { scale: 1, duration: 1.4, ease: "expo.out" }, "<");

        if (ctx.conditions?.desktop && parallax) {
          gsap.fromTo(
            inner,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
    },
    { scope: root, dependencies: [near] },
  );

  return (
    // .photo provides position: relative, so callers can override it with `absolute`.
    <div ref={root} data-cursor-blend className={cx("photo overflow-hidden", className)}>
      {/* Taller than the frame so the parallax drift never shows an edge. */}
      <div data-inner className={cx("absolute inset-x-0", parallax ? "-inset-y-[15%]" : "inset-y-0")}>
        <div data-scale className="absolute inset-0">
          <Image src={image.src} alt={image.alt} fill sizes={sizes} className={cx("object-cover", imageClassName)} />
        </div>
      </div>
      <div aria-hidden="true" data-curtain className="absolute inset-0 z-10 origin-left scale-x-0 bg-orange" />
    </div>
  );
}
