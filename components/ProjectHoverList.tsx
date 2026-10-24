"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { TiltCard } from "@/components/TiltCard";
import type { ProjectPhoto } from "@/lib/data";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useIdle } from "@/lib/useIdle";
import { cx } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Desktop: titles in large type; hovering a row shows its photo floating beside the cursor,
 * following smoothly and tilting with the direction of movement. Mobile: photo cards.
 */
export function ProjectHoverList({ items }: { items: ProjectPhoto[] }) {
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Photos load on first hover, not with the page.
  const [armed, setArmed] = useState(false);
  const idle = useIdle();

  const { contextSafe } = useGSAP(
    () => {
      if (!idle) return;
      const el = float.current;
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.6 });

      const mm = gsap.matchMedia();
      mm.add(MQ.finePointer, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
        const tilt = gsap.quickTo(el, "rotation", { duration: 0.6, ease: "power3" });
        let lastX = 0;
        let lastY = 0;
        let settle: gsap.core.Tween | undefined;
        let frame = 0;

        const onMove = (e: PointerEvent) => {
          xTo(e.clientX + 170);
          yTo(e.clientY);
          tilt(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
          lastY = e.clientY;
          settle?.kill();
          settle = gsap.delayedCall(0.12, () => tilt(0));
        };
        // Scrolling moves the list under a still pointer without firing pointerleave,
        // so check what is under the last pointer position instead.
        const onScroll = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            const row = document.elementFromPoint(lastX, lastY)?.closest<HTMLElement>("[data-row]");
            if (row && root.current?.contains(row)) show(Number(row.dataset.row));
            else hide();
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
          cancelAnimationFrame(frame);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("scroll", onScroll);
        };
      });
    },
    { scope: root, dependencies: [idle] },
  );

  const show = contextSafe((i: number) => {
    setArmed(true);
    setActive(i);
    gsap.to(float.current, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" });
  });
  const hide = contextSafe(() => {
    gsap.to(float.current, { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: "expo.out" });
  });

  return (
    <div ref={root}>
      {/* Desktop list */}
      <ul className="hidden border-t border-navy/10 lg:block" onPointerLeave={hide}>
        {items.map((item, i) => (
          <li key={item.image.src}>
            <Link
              href="/projects"
              data-cursor="view"
              data-row={i}
              onPointerEnter={() => show(i)}
              onFocus={() => setActive(i)}
              className="group grid grid-cols-12 items-center gap-6 border-b border-navy/10 py-5 text-navy"
            >
              <span className="col-span-1 font-condensed text-h3 text-steel-dark">{pad(i + 1)}</span>
              <span className="col-span-7 font-display text-h2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4">
                {item.title}
              </span>
              <span className="col-span-3 text-steel-dark">{item.stage}</span>
              <span className="col-span-1 justify-self-end">
                <span className="grid size-11 place-items-center rounded-full border border-navy/15 transition-colors duration-300 group-hover:border-orange group-hover:bg-orange">
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div
        ref={float}
        aria-hidden="true"
        className="pointer-events-none invisible fixed left-0 top-0 z-40 hidden aspect-[4/3] opacity-0 w-[340px] overflow-hidden rounded-xl shadow-card lg:block"
      >
        {armed &&
          items.map((item, i) => (
            <Image
              key={item.image.src}
              src={item.image.src}
              alt=""
              fill
              sizes="340px"
              className={cx("object-cover transition-opacity duration-300", i === active ? "opacity-100" : "opacity-0")}
            />
          ))}
      </div>

      {/* Mobile cards */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {items.map((item, i) => (
          <li key={item.image.src}>
            <Link href="/projects" className="block">
              <TiltCard className="aspect-[4/3] rounded-2xl">
                <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              </TiltCard>
              <span className="mt-3 flex items-baseline justify-between gap-4">
                <span className="font-display text-h3">{item.title}</span>
                <span className="shrink-0 text-sm text-steel-dark">{item.stage}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
