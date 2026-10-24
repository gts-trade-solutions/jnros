import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register once, client side only. Every animated component imports from here.
// (MotionPathPlugin is registered by RoutesMap, the only component that uses it.)
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);
  gsap.defaults({ ease: "expo.out", duration: 1 });
  gsap.config({ nullTargetWarn: false });
}

/** Media queries for gsap.matchMedia(): full experience on desktop, simplified on mobile, fades only for reduced motion. */
export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  finePointer: "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
