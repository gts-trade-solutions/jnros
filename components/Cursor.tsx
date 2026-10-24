"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useIdle } from "@/lib/useIdle";

type Mode = "default" | "link" | "label";

/**
 * Orange dot + trailing ring. Desktop with a fine pointer only.
 * Elements opt into a label with data-cursor="view" | "drag"; links and buttons shrink it;
 * over images it switches to mix-blend-mode: difference.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const ringInner = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const idle = useIdle();

  useGSAP(() => {
    if (!idle) return;
    const mm = gsap.matchMedia();
    mm.add(MQ.finePointer, () => {
      const html = document.documentElement;
      html.classList.add("has-cursor");

      const dotX = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
      const dotY = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
      const ringX = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
      const ringY = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });
      gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      let mode: Mode = "default";
      let visible = false;

      const setMode = (next: Mode, text = "", force = false) => {
        if (label.current && text) label.current.textContent = text;
        if (next === mode && !force) return;
        mode = next;
        gsap.to(ringInner.current, {
          scale: next === "label" ? 2.4 : next === "link" ? 0.55 : 1,
          backgroundColor: next === "label" ? "rgba(255,107,26,1)" : "rgba(255,107,26,0)",
          borderColor: next === "label" ? "rgba(255,107,26,0)" : "rgba(255,107,26,0.9)",
          duration: 0.4,
          ease: "expo.out",
        });
        gsap.to(label.current, { autoAlpha: next === "label" ? 1 : 0, duration: 0.2 });
        gsap.to(dot.current, { scale: next === "label" ? 0 : 1, duration: 0.25 });
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!visible) {
          visible = true;
          gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
          gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const onOver = (e: PointerEvent) => {
        const target = e.target as Element | null;
        if (!target?.closest) return;
        const labelled = target.closest<HTMLElement>("[data-cursor]");
        const field = target.closest("input, textarea, select, iframe");
        if (field) {
          gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.2 });
          visible = false;
          return;
        }
        if (labelled) setMode("label", labelled.dataset.cursor?.toUpperCase());
        else if (target.closest("a, button, [role='button'], label, summary")) setMode("link");
        else setMode("default");

        const overImage = !!target.closest("img, picture, video, [data-cursor-blend]");
        ring.current?.classList.toggle("mix-blend-difference", overImage);
        dot.current?.classList.toggle("mix-blend-difference", overImage);
      };

      const onLeaveWindow = () => {
        visible = false;
        gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.2 });
      };
      const onDown = () => gsap.to(ringInner.current, { scale: "*=0.8", duration: 0.15, ease: "power2.out" });
      const onUp = () => setMode(mode, "", true);

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeaveWindow);
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);

      return () => {
        html.classList.remove("has-cursor");
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
      };
    });
  }, [idle]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120] hidden lg:block">
      <div ref={ring} className="invisible absolute left-0 top-0">
        <div
          ref={ringInner}
          className="grid size-10 place-items-center rounded-full border border-orange/90"
        >
          <span
            ref={label}
            className="invisible scale-[0.42] font-display text-eyebrow font-semibold text-navy"
          />
        </div>
      </div>
      <div ref={dot} className="invisible absolute left-0 top-0 size-2 rounded-full bg-orange" />
    </div>
  );
}
