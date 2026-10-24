"use client";

import { MotionConfig } from "framer-motion";

/**
 * Honours prefers-reduced-motion for every Framer Motion animation: transforms become instant,
 * fades remain. Components that animate with `m.*` load their own feature set via <LazyMotion>,
 * so pages that don't use them never download it.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
