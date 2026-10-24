"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True once the element comes within `margin` of the viewport (and stays true).
 * Used to defer heavy animation setup (SplitText etc.) for content further down the page,
 * which keeps that work out of the initial hydration task.
 */
export function useNear(ref: RefObject<Element | null>, margin = "60%") {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin} 0px ${margin} 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, near, margin]);

  return near;
}
