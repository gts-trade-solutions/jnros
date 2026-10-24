import Link from "next/link";
import { icons } from "@/components/icons";
import type { Service } from "@/lib/data";
import { cx } from "@/lib/utils";

/** Icon card used for the 16 solutions and services. */
export function ServiceCard({
  service,
  href,
  linkLabel = "Learn more",
  tone = "dark",
  anchor = false,
}: {
  service: Service;
  href: string;
  linkLabel?: string;
  tone?: "light" | "dark";
  /** Adds an id so /services#slug can land on this card. */
  anchor?: boolean;
}) {
  const Icon = icons[service.icon];
  const dark = tone === "dark";

  return (
    <Link
      href={href}
      id={anchor ? service.slug : undefined}
      className={cx(
        "group flex h-full scroll-mt-28 flex-col rounded-2xl border p-6 transition duration-300 ease-out hover:-translate-y-1.5",
        dark
          ? "border-white/10 bg-navy-800 text-white hover:border-white/20 hover:shadow-card-dark target:border-orange"
          : "border-navy/10 bg-white text-navy hover:shadow-card target:border-orange",
      )}
    >
      <span
        className={cx(
          "grid size-12 place-items-center rounded-xl transition-colors duration-300",
          dark ? "bg-white/[0.06] text-white group-hover:bg-orange group-hover:text-navy" : "bg-navy text-white group-hover:bg-orange group-hover:text-navy",
        )}
      >
        <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-h3">{service.title}</h3>
      <p className={cx("mt-3 text-sm", dark ? "text-steel" : "text-steel-dark")}>
        {service.description}
      </p>
      <span className="link-underline mt-auto self-start pt-5 text-sm">{linkLabel}</span>
    </Link>
  );
}
