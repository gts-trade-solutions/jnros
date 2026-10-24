"use client";

import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import * as m from "framer-motion/m";
import { Mail, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Logo, type LogoAsset } from "@/components/Logo";
import { useLenis } from "@/components/SmoothScroll";
import { buttonStyles, Container, EmailText } from "@/components/ui";
import { site } from "@/lib/data";
import { cx, EASE, isActivePath as isActive, trapFocus, type NavItem } from "@/lib/utils";

type Props = { logo: LogoAsset | null; nav: NavItem[]; pathname: string; onClose: () => void };

/** Loaded on demand by <Header>. Stays mounted after first open so the exit animation can play. */
export default function MobileMenuLayer({ open, ...props }: Props & { open: boolean }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>{open && <MobileMenu {...props} />}</AnimatePresence>
    </LazyMotion>
  );
}

function MobileMenu({ logo, nav, pathname, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const lenis = useLenis();

  useEffect(() => {
    closeRef.current?.focus();
    lenis?.stop();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else trapFocus(e, panelRef.current);
    };
    const onResize = () => window.innerWidth >= 1024 && onClose();
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      lenis?.start();
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [onClose, lenis]);

  return (
    <m.div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-lenis-prevent
      className="grain fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-navy text-white lg:hidden"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div aria-hidden="true" className="blueprint pointer-events-none absolute inset-0" />
      <Container className="relative flex h-20 shrink-0 items-center justify-between">
        <Link href="/" onClick={onClose} aria-label="Jnros Logistics home" className="rounded-lg">
          <Logo logo={logo} />
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid size-11 place-items-center rounded-xl border border-white/20 transition-colors hover:bg-white/10"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </Container>

      <Container className="relative flex flex-1 flex-col justify-between gap-12 pb-10 pt-10">
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {nav.map((item, i) => (
              <m.li
                key={item.href}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 + i * 0.07, duration: 0.6, ease: EASE }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(item.href, pathname) ? "page" : undefined}
                  className="block py-2 font-display text-h2 text-white/80 transition-colors hover:text-white aria-[current=page]:text-white"
                >
                  {item.label}
                </Link>
              </m.li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          <Link href="/contact" onClick={onClose} className={cx(buttonStyles.primary, "w-full")}>
            Get a Quote
          </Link>
          <ul className="space-y-3 text-steel">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-3 hover:text-white">
                <Phone className="size-4" aria-hidden="true" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-white">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  <EmailText email={site.email} />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </m.div>
  );
}
