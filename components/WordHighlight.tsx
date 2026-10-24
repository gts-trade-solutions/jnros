"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { useNear } from "@/lib/useNear";

/** Each word starts at 20% opacity and brightens to full as the paragraph scrolls through. */
export function WordHighlight({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const near = useNear(ref);

  useGSAP(
    () => {
      if (!near) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        SplitText.create(ref.current, {
          type: "words",
          // Words stay readable as plain text; aria-label isn't allowed on a <p>.
          aria: "none",
          autoSplit: true,
          // Re-split on resize/font load; returning the tween lets SplitText clean it up each time.
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.2 },
              {
                opacity: 1,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
              },
            ),
        });
      });
    },
    { scope: ref, dependencies: [near] },
  );

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
