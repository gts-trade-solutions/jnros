"use client";

import { useAnimate } from "framer-motion/mini";
import { useLayoutEffect } from "react";
import { usePageTransition } from "@/components/PageTransition";

// Set after the first client mount only (never on the server), so the initial HTML is never hidden.
let hydrated = false;

/**
 * Remounts on every navigation. Tells the transition layer the new page is in the DOM so the
 * covering panel can wipe away, and fades client-side navigations in. Opacity only: a transform
 * here would break pinned (position: fixed) ScrollTrigger sections.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const { onPageMount } = usePageTransition();
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useLayoutEffect(() => {
    if (hydrated && scope.current) animate(scope.current, { opacity: [0, 1] }, { duration: 0.5 });
    hydrated = true;
    onPageMount();
  }, [animate, onPageMount, scope]);

  return <div ref={scope}>{children}</div>;
}
