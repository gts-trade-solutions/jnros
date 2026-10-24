export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

/** Shared easing for every entrance animation. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Keeps Tab / Shift+Tab inside an open dialog. Call from a keydown handler. */
export function trapFocus(e: KeyboardEvent, container: HTMLElement | null) {
  if (e.key !== "Tab" || !container) return;
  const focusable = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
    e.preventDefault();
    first.focus();
  }
}

export type NavItem = { label: string; href: string };

/** Whether a nav link points at the current page (Home only matches exactly). */
export const isActivePath = (href: string, pathname: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);
