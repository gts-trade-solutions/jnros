"use client";

import { useAnimate } from "framer-motion/mini";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { refreshScroll, scrollToTarget, useLenis } from "@/components/SmoothScroll";

type Phase = "idle" | "covering" | "covered" | "revealing";
type Panel = "orange" | "navy";

const PageTransitionContext = createContext<{ onPageMount: () => void }>({ onPageMount: () => {} });
export const usePageTransition = () => useContext(PageTransitionContext);

const WIPE = [0.76, 0, 0.24, 1] as const;
const HIDDEN_BELOW = "translateY(100%)";

/**
 * Route transitions. The App Router unmounts the old page immediately, so the panels live here
 * (they persist across navigations) and app/template.tsx reports when the new page has mounted.
 *
 * Click on an internal link → orange panel wipes up → navy panel follows → navigate →
 * new page mounts underneath → navy panel wipes off the top.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const lenis = useLenis();
  // framer-motion/mini: a small WAAPI-based animate, so transitions don't need the full Motion bundle.
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const phase = useRef<Phase>("idle");
  const pendingHash = useRef("");

  const move = useCallback(
    async (panel: Panel, from: string, to: string, options: { duration: number; delay?: number }) => {
      const el = scope.current?.querySelector<HTMLElement>(`[data-pt='${panel}']`);
      if (!el) return;
      await animate(el, { transform: [from, to] }, { ...options, ease: WIPE });
      el.style.transform = to;
    },
    [animate, scope],
  );

  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (including #anchors): let Lenis / the browser handle it.
      if (url.pathname === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (phase.current !== "idle") {
        e.preventDefault();
        return;
      }

      // Runs before Next's <Link> handler, which skips navigation when the event is already prevented.
      e.preventDefault();
      phase.current = "covering";
      pendingHash.current = url.hash;
      lenis?.stop();

      await Promise.all([
        move("orange", HIDDEN_BELOW, "translateY(0%)", { duration: 0.5 }),
        move("navy", HIDDEN_BELOW, "translateY(0%)", { duration: 0.5, delay: 0.14 }),
      ]);
      phase.current = "covered";
      router.push(url.pathname + url.search + url.hash, { scroll: false });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [lenis, move, router]);

  const onPageMount = useCallback(() => {
    if (phase.current !== "covered") return;
    phase.current = "revealing";

    // Let the new page lay out and register its ScrollTriggers before measuring.
    requestAnimationFrame(async () => {
      lenis?.start();
      const target = pendingHash.current ? document.querySelector<HTMLElement>(pendingHash.current) : null;
      scrollToTarget(lenis, target ?? 0, true);
      refreshScroll();

      const orange = scope.current?.querySelector<HTMLElement>("[data-pt='orange']");
      if (orange) orange.style.transform = HIDDEN_BELOW;
      await move("navy", "translateY(0%)", "translateY(-100%)", { duration: 0.7 });
      const navy = scope.current?.querySelector<HTMLElement>("[data-pt='navy']");
      if (navy) navy.style.transform = HIDDEN_BELOW;
      phase.current = "idle";
    });
  }, [lenis, move, scope]);

  return (
    <PageTransitionContext.Provider value={{ onPageMount }}>
      {children}
      {/*
        Start position is an inline transform, not Tailwind's translate-y-full: v4 utilities set the
        separate `translate` property, which would stack with the animated transform.
      */}
      <div ref={scope} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
        <div data-pt="orange" className="absolute inset-0 bg-orange" style={{ transform: HIDDEN_BELOW }} />
        <div data-pt="navy" className="absolute inset-0 bg-navy-deep" style={{ transform: HIDDEN_BELOW }} />
      </div>
    </PageTransitionContext.Provider>
  );
}
