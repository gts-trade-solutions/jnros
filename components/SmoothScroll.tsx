"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIdle } from "@/lib/useIdle";

const LenisContext = createContext<Lenis | null>(null);

/** The Lenis instance, or null when smooth scrolling is off (reduced motion) or not yet created. */
export const useLenis = () => useContext(LenisContext);

/** Re-measures every ScrollTrigger in page order. Call after anything changes layout. */
export function refreshScroll() {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

/** Scrolls to a y position or element, through Lenis when it is running. */
export function scrollToTarget(lenis: Lenis | null, target: number | HTMLElement, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : -96, immediate, force: true });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
}

/**
 * Lenis smooth scrolling (lerp 0.1) driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Disabled for prefers-reduced-motion. Touch devices keep native scrolling (Lenis default).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const firstRoute = useRef(true);

  useEffect(() => {
    // ScrollTrigger already refreshes on window load; only re-measure if web fonts land later.
    if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(refreshScroll);

    // Lenis only smooths wheel input, so touch devices and reduced motion keep native scrolling
    // (and never download it).
    const touch = !window.matchMedia("(pointer: fine)").matches;
    if (touch || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let instance: Lenis | null = null;
    let cancelled = false;
    const raf = (time: number) => instance?.raf(time * 1000);
    const onIntroDone = () => instance?.start();

    import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      instance = new LenisClass({ lerp: 0.1, autoRaf: false, anchors: { offset: -96 } });
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      // Hold scrolling while the preloader doors are closed.
      if (document.documentElement.dataset.intro === "on") instance.stop();
      window.addEventListener("jnros:intro-done", onIntroDone);
      setLenis(instance);
    });

    return () => {
      cancelled = true;
      window.removeEventListener("jnros:intro-done", onIntroDone);
      gsap.ticker.remove(raf);
      instance?.destroy();
      setLenis(null);
    };
  }, []);

  // New page: its triggers were just created, so re-measure everything.
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    const id = requestAnimationFrame(refreshScroll);
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenis}>
      <ScrollProgress />
      <GridFade pathname={pathname} />
      {children}
    </LenisContext.Provider>
  );
}

/** Background grid lines ([data-grid], see <Blueprint>) fade in as their section scrolls into view. */
function GridFade({ pathname }: { pathname: string }) {
  const idle = useIdle();
  useGSAP(
    () => {
      if (!idle) return;
      const mm = gsap.matchMedia();
      // Ambient detail: desktop only.
      mm.add(MQ.desktop, () => {
        gsap.utils.toArray<HTMLElement>("[data-grid]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              // Created before the page's pinned sections, so refresh after them.
              scrollTrigger: { trigger: el.parentElement, start: "top 85%", end: "top 30%", scrub: true, refreshPriority: -1 },
            },
          );
        });
      });
    },
    { dependencies: [pathname, idle], revertOnUpdate: true },
  );
  return null;
}

function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const idle = useIdle();

  useGSAP(() => {
    if (!idle) return;
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      // Refresh last, after pinned sections have added their spacing to the page height.
      scrollTrigger: { start: 0, end: "max", scrub: 0.3, refreshPriority: -1 },
    });
  }, [idle]);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[85] h-[2px] origin-left scale-x-0 bg-orange"
    />
  );
}
