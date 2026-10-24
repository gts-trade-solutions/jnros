"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIdle } from "@/lib/useIdle";
import { cx } from "@/lib/utils";

export type ButtonVariant = "primary" | "ghost" | "dark";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-7 py-3.5 font-display text-button font-semibold uppercase transition-colors duration-300";

/* Navy text on orange: 6.1:1. White on this orange would fail AA. */
const variants: Record<ButtonVariant, { button: string; fill: string }> = {
  primary: { button: "bg-orange text-navy focus-visible:outline-orange", fill: "bg-white" },
  ghost: { button: "border border-white/30 text-white hover:text-navy hover:border-orange", fill: "bg-orange" },
  dark: { button: "bg-navy text-white hover:text-navy", fill: "bg-orange" },
};

// x/y are zeroed so GSAP drops the px offset it parses from the fill's inline translateY(101%).
const HIDDEN = {
  left: { x: 0, y: 0, xPercent: -101, yPercent: 0 },
  right: { x: 0, y: 0, xPercent: 101, yPercent: 0 },
  top: { x: 0, y: 0, xPercent: 0, yPercent: -101 },
  bottom: { x: 0, y: 0, xPercent: 0, yPercent: 101 },
};

function nearestEdge(e: { clientX: number; clientY: number }, el: Element): keyof typeof HIDDEN {
  const r = el.getBoundingClientRect();
  const d = {
    left: e.clientX - r.left,
    right: r.right - e.clientX,
    top: e.clientY - r.top,
    bottom: r.bottom - e.clientY,
  };
  return (Object.keys(d) as (keyof typeof d)[]).reduce((a, b) => (d[a] < d[b] ? a : b));
}

type Props = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  arrow?: boolean;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  "aria-label"?: string;
};

/**
 * Pulls toward the cursor within 60px and springs back on leave; the fill wipes in from the
 * side the cursor entered and out the side it left. Fine pointers only; plain button otherwise.
 */
export function MagneticButton({ children, variant = "primary", className, arrow = true, href, type = "button", onClick, ...rest }: Props) {
  const wrap = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  // Magnetic pull is set up in an idle task after hydration (the fill's hidden start is in the markup).
  const idle = useIdle();

  const { contextSafe } = useGSAP(
    () => {
      if (!idle) return;
      const mm = gsap.matchMedia();
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        let pulled = false;
        const onMove = (e: PointerEvent) => {
          const el = wrap.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          const near =
            e.clientX > r.left - 60 && e.clientX < r.right + 60 && e.clientY > r.top - 60 && e.clientY < r.bottom + 60;
          if (near) {
            pulled = true;
            gsap.to(button.current, {
              x: (e.clientX - (r.left + r.width / 2)) * 0.3,
              y: (e.clientY - (r.top + r.height / 2)) * 0.35,
              duration: 0.5,
              ease: "power3.out",
              overwrite: "auto",
            });
          } else if (pulled) {
            pulled = false;
            gsap.to(button.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
          }
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: wrap, dependencies: [idle] },
  );

  const onEnter = contextSafe((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !button.current) return;
    gsap.fromTo(fill.current, HIDDEN[nearestEdge(e, button.current)], {
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
      duration: 0.45,
      ease: "expo.out",
      overwrite: true,
    });
  });
  const onLeave = contextSafe((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !button.current) return;
    gsap.to(fill.current, { ...HIDDEN[nearestEdge(e, button.current)], duration: 0.45, ease: "expo.out", overwrite: true });
  });

  const content = (
    <>
      <span
        ref={fill}
        aria-hidden="true"
        className={cx("absolute inset-0 rounded-[inherit]", variants[variant].fill)}
        style={{ transform: "translateY(101%)" }}
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
      {arrow && (
        <span aria-hidden="true" className="relative z-10 grid size-4 overflow-hidden">
          <ArrowRight className="col-start-1 row-start-1 size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full" />
          <ArrowRight className="col-start-1 row-start-1 size-4 -translate-x-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0" />
        </span>
      )}
    </>
  );

  const cls = cx(base, variants[variant].button, className);
  const handlers = { onPointerEnter: onEnter, onPointerLeave: onLeave };

  let element: React.ReactNode;
  if (!href) {
    element = (
      <button ref={button as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} className={cls} {...handlers} {...rest}>
        {content}
      </button>
    );
  } else if (/^(https?:|tel:|mailto:)/.test(href)) {
    element = (
      <a
        ref={button as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cls}
        {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
        {...handlers}
        {...rest}
      >
        {content}
      </a>
    );
  } else {
    element = (
      <Link ref={button as React.Ref<HTMLAnchorElement>} href={href} className={cls} {...handlers} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <span ref={wrap} className="inline-flex">
      {element}
    </span>
  );
}
