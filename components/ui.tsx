import { MagneticButton, type ButtonVariant } from "@/components/MagneticButton";
import { cx } from "@/lib/utils";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>{children}</div>;
}

/** Plain (non-magnetic) button styles, for compact controls such as the header CTA. */
export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-7 py-3.5 font-display text-button font-semibold uppercase text-navy transition-colors duration-200 hover:bg-orange-light focus-visible:outline-orange",
};

export function ButtonLink({
  href,
  variant = "primary",
  className,
  arrow = true,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  arrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <MagneticButton href={href} variant={variant} className={className} arrow={arrow}>
      {children}
    </MagneticButton>
  );
}

/** Lets long addresses wrap after the "@" instead of mid-word. */
export function EmailText({ email }: { email: string }) {
  const [user, domain] = email.split("@");
  return (
    <>
      {user}@<wbr />
      {domain}
    </>
  );
}

/** Faint technical grid. Fades in on scroll when placed inside a section (see <GridFade>). */
export function Blueprint({ className }: { className?: string }) {
  return <div aria-hidden="true" data-grid className={cx("blueprint pointer-events-none absolute inset-0", className)} />;
}
