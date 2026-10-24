"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { useNear } from "@/lib/useNear";
import { cx } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  id?: string;
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  /** "split": title left, intro right (md+). "stack": intro under the title. */
  layout?: "split" | "stack";
  /** "page" for sub-page banner H1s. */
  size?: "section" | "page";
  /** Above the fold: animates on desktop only and paints immediately on mobile (LCP). */
  above?: boolean;
  className?: string;
};

const titleSizes = {
  section: "text-h2",
  page: "text-hero",
};

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/";

/**
 * Section title: orange accent line grows to 48px, the eyebrow decodes from random characters,
 * then the title's lines rise from behind a mask.
 */
export function SplitReveal({
  eyebrow,
  title,
  intro,
  id,
  as: Heading = "h2",
  tone = "light",
  layout = "split",
  size = "section",
  above = false,
  className,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  // Below-the-fold titles split only when they get close, keeping that work out of hydration.
  const near = useNear(root);

  useGSAP(
    () => {
      if (!above && !near) return;
      const q = gsap.utils.selector(root);
      const line = q("[data-accent]");
      const label = q("[data-eyebrow]")[0] as HTMLElement | undefined;
      const heading = q("[data-title]")[0] as HTMLElement;
      const rest = q("[data-intro-text]");
      const trigger = { trigger: root.current, start: "top 85%", once: true };

      gsap.set(root.current, { visibility: "visible" });
      const mm = gsap.matchMedia();

      mm.add(MQ.reduce, () => {
        gsap.from(root.current, { autoAlpha: 0, duration: 0.6, ease: "none", scrollTrigger: trigger });
      });

      mm.add(above ? MQ.desktop : MQ.motion, () => {
        let revealed = false;
        if (label) label.textContent = "";

        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          // Re-split whenever the width changes or fonts load, so lines always match the layout.
          // Returning the timeline lets SplitText revert and rebuild it on each re-split.
          autoSplit: true,
          onSplit: (self) => {
            if (revealed) return; // Already shown: just reflow the new lines.
            const tl = gsap.timeline({ scrollTrigger: trigger, onComplete: () => void (revealed = true) });
            tl.from(line, { scaleX: 0, duration: 0.7, ease: "expo.out" }, 0);
            if (label && eyebrow) {
              tl.to(label, { duration: 1, scrambleText: { text: eyebrow, chars: SCRAMBLE, speed: 0.5 }, ease: "none" }, 0.1);
            }
            tl.from(self.lines, { yPercent: 110, duration: 1.2, stagger: 0.1, ease: "expo.out" }, 0.2);
            if (rest.length) tl.from(rest, { autoAlpha: 0, y: 24, duration: 1, ease: "expo.out" }, 0.45);
            return tl;
          },
        });
      });
    },
    { scope: root, dependencies: [near] },
  );

  return (
    <div
      ref={root}
      {...(above ? { "data-pre-desktop": "" } : { "data-pre": "" })}
      className={cx(layout === "split" && "grid gap-5 md:grid-cols-12 md:items-end md:gap-8", className)}
    >
      <div className={cx(layout === "split" && "md:col-span-7")}>
        {eyebrow && (
          <p className="mb-4 flex items-center gap-3 text-eyebrow font-semibold md:mb-5">
            <span aria-hidden="true" data-accent className="h-[2px] w-12 origin-left bg-orange" />
            <span data-eyebrow className={cx("uppercase", tone === "dark" ? "text-steel" : "text-steel-dark")}>
              {eyebrow}
            </span>
          </p>
        )}
        <Heading
          id={id}
          data-title
          className={cx("font-display", titleSizes[size])}
        >
          {title}
        </Heading>
      </div>
      {intro && (
        <p
          data-intro-text
          className={cx(
            "max-w-prose",
            layout === "split" ? "md:col-span-5 md:justify-self-end" : "mt-5",
            tone === "dark" ? "text-steel" : "text-steel-dark",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
