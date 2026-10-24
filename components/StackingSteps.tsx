"use client";

import { useRef } from "react";
import { SplitReveal } from "@/components/SplitReveal";
import { Blueprint, Container } from "@/components/ui";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIdle } from "@/lib/useIdle";

type Step = { title: string; description: string };

const pad = (n: number) => String(n).padStart(2, "0");
const STICK_TOP_REM = 8;
const PEEK_REM = 1.5;

/**
 * Desktop: step cards stick one after another; each new card slides over the last while the
 * cards beneath scale down (0.95, 0.90…) and darken. An orange line fills as the steps advance.
 * Mobile and reduced motion: a plain vertical list with simple reveals.
 */
export function StackingSteps({
  eyebrow,
  title,
  intro,
  steps,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  steps: Step[];
}) {
  const root = useRef<HTMLElement>(null);
  const idle = useIdle();

  useGSAP(
    () => {
      if (!idle) return;
      const q = gsap.utils.selector(root);
      const cards = q("[data-card]");
      const shades = q("[data-shade]");
      const list = q("[data-steps]")[0];
      const fill = q("[data-step-fill]");
      const current = q("[data-step-current]")[0] as HTMLElement;
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const last = cards[cards.length - 1];
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const lastTop = (STICK_TOP_REM + (cards.length - 1) * PEEK_REM) * rem;

        cards.slice(0, -1).forEach((card, i) => {
          const depth = cards.length - 1 - i;
          gsap
            .timeline({
              scrollTrigger: {
                trigger: cards[i + 1],
                start: "top bottom",
                endTrigger: last,
                end: `top ${lastTop}px`,
                scrub: true,
              },
            })
            .to(card, { scale: 1 - depth * 0.05, ease: "none" }, 0)
            .to(shades[i], { opacity: Math.min(0.65, depth * 0.16), ease: "none" }, 0);
        });

        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 60%",
              endTrigger: last,
              end: `top ${lastTop}px`,
              scrub: true,
              onUpdate: (self) => {
                current.textContent = pad(Math.min(cards.length, Math.floor(self.progress * cards.length) + 1));
              },
            },
          },
        );
      });

      mm.add({ mobile: MQ.mobile, reduce: MQ.reduce }, (ctx) => {
        gsap.set(cards, { autoAlpha: 0, y: ctx.conditions?.reduce ? 0 : 40 });
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "expo.out" }),
        });
      });
    },
    { scope: root, dependencies: [idle] },
  );

  return (
    <section ref={root} aria-labelledby="process-heading" className="grain bg-navy py-14 text-white md:py-20">
      <Blueprint />
      <Container className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
          <SplitReveal id="process-heading" eyebrow={eyebrow} title={title} intro={intro} tone="dark" layout="stack" />
          <div aria-hidden="true" className="mt-10 hidden items-start gap-5 lg:flex">
            <span className="relative block h-44 w-[2px] bg-white/10">
              <span data-step-fill className="absolute inset-0 origin-top scale-y-0 bg-orange" />
            </span>
            <span className="font-condensed text-stat font-semibold">
              <span data-step-current>01</span>
              <span className="text-steel">/{pad(steps.length)}</span>
            </span>
          </div>
        </div>

        <ol data-steps className="flex flex-col gap-5 lg:col-span-8 lg:gap-[14vh] lg:pb-[12vh]">
          {steps.map((step, i) => (
            <li
              key={step.title}
              data-card
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800 p-7 shadow-card-dark sm:p-8 lg:flex lg:h-[min(42vh,360px)] lg:origin-top lg:flex-col lg:p-10 lg:motion-safe:sticky lg:motion-safe:top-[var(--stick)]"
              // Offset applies only while sticky; on a relative card, `top` would shift it down.
              style={{ "--stick": `${STICK_TOP_REM + i * PEEK_REM}rem` } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className="text-outline-steel font-condensed text-marquee font-semibold"
              >
                {pad(i + 1)}
              </span>
              <h3 className="mt-6 font-display text-h3 lg:mt-auto">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-3 max-w-prose text-steel">{step.description}</p>
              <div data-shade aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0" />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
