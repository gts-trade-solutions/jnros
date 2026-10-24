"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

declare global {
  interface Window {
    __jnrosRevealed?: boolean;
  }
}

/** Fired when the doors start opening (hero expands) and when the preloader is gone. */
export const INTRO_REVEAL = "jnros:reveal";
export const INTRO_DONE = "jnros:intro-done";

const door =
  "absolute inset-y-0 w-1/2 bg-navy-deep [backface-visibility:hidden] " +
  // Corrugated steel, like a container door.
  "bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.035)_0_3px,transparent_3px_28px)]";

/**
 * "Container doors" intro: a counter rolls 0 → 100, then two doors swing open on their outer hinges.
 * Only on the first desktop visit per session; the inline boot script decides before paint.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.dataset.intro !== "on") {
        setDone(true);
        return;
      }

      const q = gsap.utils.selector(root);
      const counter = q("[data-count]")[0] as HTMLElement;
      const progress = { value: 0 };

      const finish = () => {
        html.dataset.intro = "done";
        window.dispatchEvent(new Event(INTRO_DONE));
        setDone(true);
      };

      gsap
        .timeline({ onComplete: finish })
        .to(progress, {
          value: 100,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.round(progress.value));
          },
        })
        .to(q("[data-bar]"), { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0)
        .to(q("[data-fade]"), { autoAlpha: 0, duration: 0.25, ease: "power1.out" })
        .addLabel("open", "-=0.1")
        .call(
          () => {
            window.__jnrosRevealed = true;
            window.dispatchEvent(new Event(INTRO_REVEAL));
          },
          [],
          "open",
        )
        // Swing away from the viewer: swinging toward the camera makes the doors loom and cover more.
        .to(q("[data-door='left']"), { rotateY: 100, xPercent: -10, duration: 0.8, ease: "power3.inOut" }, "open")
        .to(q("[data-door='right']"), { rotateY: -100, xPercent: 10, duration: 0.8, ease: "power3.inOut" }, "open");
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      data-preloader
      aria-hidden="true"
      className="fixed inset-0 z-[100] [perspective:1800px]"
    >
      <div data-door="left" className={`${door} left-0 origin-left border-r border-black/40`}>
        <LockBars side="left" />
      </div>
      <div data-door="right" className={`${door} right-0 origin-right border-l border-white/5`}>
        <LockBars side="right" />
      </div>

      <div data-fade className="pointer-events-none absolute inset-0">
        <p className="absolute left-8 top-8 font-display text-eyebrow font-semibold uppercase text-white/70">
          JNROS LOGISTICS
        </p>
        <p className="absolute bottom-6 left-6 flex items-start font-condensed font-semibold text-white lg:bottom-10 lg:left-10">
          <span data-count className="text-wordmark tabular-nums">
            0
          </span>
          <span className="mt-1 text-stat text-orange">%</span>
        </p>
        <div data-bar className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-orange" />
      </div>
    </div>
  );
}

/** Two vertical locking bars per door, near the meeting edge. */
function LockBars({ side }: { side: "left" | "right" }) {
  const edge = side === "left" ? "right-[6%]" : "left-[6%]";
  return (
    <div className={`absolute inset-y-[4%] ${edge} flex gap-[18%] w-[18%] justify-center`}>
      {[0, 1].map((i) => (
        <span key={i} className="relative h-full w-[6px] rounded-full bg-gradient-to-r from-white/15 to-white/5">
          <span className="absolute left-1/2 top-[46%] h-14 w-3 -translate-x-1/2 rounded-sm border border-white/15 bg-navy-800" />
        </span>
      ))}
    </div>
  );
}
