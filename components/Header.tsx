"use client";

import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo, type LogoAsset } from "@/components/Logo";
import { buttonStyles, Container } from "@/components/ui";
import { cx, isActivePath as isActive, type NavItem } from "@/lib/utils";

// The full-screen menu (and the Framer Motion it uses) loads on first open, not with the page.
const MobileMenuLayer = dynamic(() => import("@/components/MobileMenu"), { ssr: false });

/** Text-roll hover: the label slides up and a copy slides in from below. */
function RollText({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

export function Header({ logo, nav }: { logo: LogoAsset | null; nav: NavItem[] }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuRequested, setMenuRequested] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Transparent over the hero/banner, solid after it. Hides on scroll down, returns on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      setSolid(y > (hero ? hero.offsetHeight - 80 : 50));
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 200);
        lastY = y;
      }
    };
    onScroll();
    setHidden(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:translate-y-0",
          hidden && !open && "-translate-y-full",
          solid ? "bg-navy-deep/85 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md" : "bg-transparent",
        )}
      >
        <Container className="flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label="Jnros Logistics home" className="shrink-0 rounded-lg text-white">
            <Logo logo={logo} />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => {
                const active = isActive(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "group relative block py-2 text-nav font-medium uppercase transition-colors",
                        active ? "text-white" : "text-white/75 hover:text-white",
                      )}
                    >
                      <RollText>{item.label}</RollText>
                      {active && <span aria-hidden="true" className="absolute inset-x-0 bottom-0.5 h-px bg-orange" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* Wrapper owns the display toggle; the button's own inline-flex would override `hidden`. */}
            <div className="hidden sm:block">
              <Link href="/contact" className={cx(buttonStyles.primary, "group")}>
                <RollText>Get a Quote</RollText>
              </Link>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => {
              setMenuRequested(true);
              setOpen(true);
            }}
            // Start fetching the menu code a moment before the tap lands.
            onPointerDown={() => setMenuRequested(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      {/* Rendered outside <header>: its backdrop-filter and transform would trap this fixed overlay. */}
      {menuRequested && <MobileMenuLayer open={open} logo={logo} nav={nav} pathname={pathname} onClose={close} />}
    </>
  );
}
