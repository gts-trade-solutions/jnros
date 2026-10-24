"use client";

import Image from "next/image";
import { useRef } from "react";
import { ButtonLink, Container } from "@/components/ui";
import type { SiteImage } from "@/lib/data";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";

type Props = { title: string; subtitles: string[]; image: SiteImage; coordinates: string };

/** Types text into an element like a terminal. */
function typeInto(el: HTMLElement, text: string) {
  const state = { n: 0 };
  el.textContent = "";
  return gsap.to(state, {
    n: text.length,
    duration: text.length * 0.035,
    ease: "none",
    onUpdate: () => {
      el.textContent = text.slice(0, Math.round(state.n));
    },
  });
}

export function Hero({ title, subtitles, image, coordinates }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const frame = q("[data-hero-frame]")[0] as HTMLElement;
      const drift = q("[data-hero-drift]")[0];
      const content = q("[data-hero-content]")[0];
      const heading = q("[data-hero-title]")[0] as HTMLElement;
      const after = q("[data-hero-after]");
      const coords = q("[data-coords]")[0] as HTMLElement;
      const mm = gsap.matchMedia();

      mm.add(MQ.reduce, () => {
        gsap.set([heading, ...after, coords], { visibility: "visible" });
        gsap.from([heading, ...after], { autoAlpha: 0, duration: 0.6, ease: "none" });
      });

      // Mobile: text is already painted (it is the LCP element); the slow zoom is pure CSS.

      mm.add(MQ.desktop, () => {
        // Characters slide up from behind a per-line mask as soon as the page loads.
        const split = SplitText.create(heading, { type: "lines,chars", mask: "lines" });
        gsap.set(heading, { visibility: "visible" });
        gsap.set(split.chars, { yPercent: 115 });
        gsap.set(after, { visibility: "visible", autoAlpha: 0, y: 28 });
        gsap.set(coords, { visibility: "visible" });
        coords.textContent = "";

        gsap
          .timeline({ delay: 0.15 })
          .to(split.chars, { yPercent: 0, duration: 1.1, stagger: 0.02, ease: "expo.out" })
          .to(after, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: "expo.out" }, "-=0.7")
          .add(typeInto(coords, coordinates), "-=0.6")
          // Hand the heading back to normal text flow so it reflows on resize.
          .call(() => split.revert());

        // Scrubbed "pull away": the image shrinks into a rounded card while the copy rises faster.
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          })
          .to(frame, { scale: 0.85, borderRadius: 28, ease: "none" }, 0)
          .to(content, { yPercent: -55, ease: "none" }, 0);

        // Mouse parallax: background drifts opposite the cursor, max 15px.
        const xTo = gsap.quickTo(drift, "x", { duration: 1, ease: "power3" });
        const yTo = gsap.quickTo(drift, "y", { duration: 1, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          xTo(-(e.clientX / window.innerWidth - 0.5) * 30);
          yTo(-(e.clientY / window.innerHeight - 0.5) * 30);
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-hero
      className="relative isolate flex h-svh min-h-[640px] items-end overflow-hidden bg-navy-deep text-white"
    >
      <div data-hero-frame className="grain absolute inset-0 -z-10 overflow-hidden bg-navy">
        <div data-hero-drift className="absolute -inset-6">
          {/* Slow 1.15 → 1 zoom as a CSS animation: compositor-only, and it starts before hydration. */}
          <div className="photo hero-zoom absolute inset-0">
            {/* Extra desaturation: the source has a pink dusk sky that fights the navy overlay. */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload
              fetchPriority="high"
              sizes="100vw"
              className="object-cover object-[50%_60%] [filter:contrast(1.08)_saturate(0.5)]"
            />
          </div>
        </div>
        <div aria-hidden="true" className="hero-shade absolute inset-0" />
        <div aria-hidden="true" className="blueprint absolute inset-0" />
      </div>

      <Container className="relative pb-16 pt-32 md:pb-24">
        <div data-hero-content>
          <h1
            data-hero-title
            data-pre-desktop
            className="max-w-3xl font-display text-hero"
          >
            {title}
          </h1>

          <div data-hero-after data-pre-desktop>
            <p className="sr-only">{subtitles.join(". ")}</p>
            {/* Rotates every 3s with a CSS animation (see .subtitle-cycle). */}
            <div
              aria-hidden="true"
              className="subtitle-cycle relative mt-5 h-[3.5rem] max-w-2xl overflow-hidden text-base text-white/85 sm:h-[1.75rem] sm:text-lg"
            >
              {subtitles.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div data-hero-after data-pre-desktop className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Get a Quote</ButtonLink>
            <ButtonLink href="/services" variant="ghost">
              Our Services
            </ButtonLink>
          </div>
        </div>
      </Container>

      <p
        aria-label={coordinates}
        // Sits left of the floating WhatsApp button rather than under it.
        className="absolute bottom-6 right-24 hidden font-mono text-eyebrow text-steel sm:block md:bottom-10 md:right-28"
      >
        <span aria-hidden="true" data-coords data-pre-desktop className="caret">
          {coordinates}
        </span>
      </p>
    </section>
  );
}
