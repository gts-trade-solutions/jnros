"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { SplitReveal } from "@/components/SplitReveal";
import { Container } from "@/components/ui";
import type { SiteImage } from "@/lib/data";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIdle } from "@/lib/useIdle";

type Panel = { slug: string; title: string; description: string; image: SiteImage };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Desktop: the section pins and the panels travel horizontally as the visitor scrolls down,
 * each photo drifting inside its frame. Mobile: a vertical stack with simple reveals.
 */
export function HorizontalServices({
  eyebrow,
  title,
  intro,
  panels,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  panels: Panel[];
}) {
  const root = useRef<HTMLElement>(null);
  const idle = useIdle();

  useGSAP(
    () => {
      if (!idle) return;
      const q = gsap.utils.selector(root);
      const pinEl = q("[data-pin]")[0] as HTMLElement;
      const track = q("[data-track]")[0] as HTMLElement;
      const fill = q("[data-progress-fill]");
      const current = q("[data-progress-current]")[0] as HTMLElement;
      const panelEls = q("[data-panel]");
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            // Pins add page height, so measure this before the triggers below it.
            refreshPriority: 1,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(fill, { scaleX: self.progress });
              current.textContent = pad(Math.min(panels.length, Math.floor(self.progress * panels.length) + 1));
            },
          },
        });

        panelEls.forEach((panel) => {
          gsap.fromTo(
            panel.querySelector("[data-panel-img]"),
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: travel, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });

      mm.add({ mobile: MQ.mobile, reduce: MQ.reduce }, (ctx) => {
        gsap.set(panelEls, { autoAlpha: 0, y: ctx.conditions?.reduce ? 0 : 40 });
        ScrollTrigger.batch(panelEls, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "expo.out" }),
        });
      });
    },
    { scope: root, dependencies: [idle] },
  );

  return (
    <section ref={root} aria-labelledby="specialised-heading" className="bg-offwhite text-navy">
      <div data-pin className="flex flex-col py-14 md:py-20 lg:h-svh lg:overflow-hidden lg:py-0">
        <Container className="lg:pb-8 lg:pt-24">
          <SplitReveal id="specialised-heading" eyebrow={eyebrow} title={title} intro={intro} />
        </Container>

        <div
          data-track
          className="mt-10 flex flex-col gap-5 px-5 sm:px-8 lg:mt-0 lg:min-h-0 lg:w-max lg:flex-1 lg:flex-row lg:items-center lg:gap-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-[8vw]"
        >
          {panels.map((panel, i) => (
            <article
              key={panel.slug}
              data-panel
              // Capped height (centred in the pinned area) so the smaller type doesn't float in empty space.
              className="grid shrink-0 overflow-hidden rounded-2xl border border-navy/10 bg-white lg:h-[min(100%,26rem)] lg:w-[min(68vw,920px)] lg:grid-cols-2"
            >
              <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                <span
                  aria-hidden="true"
                  className="text-outline font-condensed text-marquee font-semibold"
                >
                  {pad(i + 1)}
                </span>
                <h3 className="mt-6 font-display text-h3 lg:mt-auto">
                  {panel.title}
                </h3>
                <p className="mt-3 max-w-prose text-steel-dark">{panel.description}</p>
                <Link href={`/services#${panel.slug}`} className="link-underline mt-8 self-start text-navy">
                  Learn more<span className="sr-only"> about {panel.title}</span>
                </Link>
              </div>
              <div data-cursor-blend className="photo relative order-first aspect-[16/10] lg:order-none lg:aspect-auto">
                <div data-panel-img className="absolute inset-y-0 -inset-x-[12%]">
                  <Image
                    src={panel.image.src}
                    alt={panel.image.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <Container className="hidden items-center gap-4 py-6 font-condensed text-base font-semibold tracking-wide text-navy lg:flex">
          <span data-progress-current>01</span>
          <span className="relative h-px w-48 bg-navy/15">
            <span data-progress-fill className="absolute inset-0 origin-left scale-x-0 bg-orange" />
          </span>
          <span className="text-steel-dark">{pad(panels.length)}</span>
        </Container>
      </div>
    </section>
  );
}
