import Image from "next/image";
import { cx } from "@/lib/utils";

export type LogoAsset = { src: string; width: number; height: number };

const HEIGHT = 36;

/**
 * The brand logo is navy on white, so it sits on a white plate to stay legible on dark backgrounds.
 * Falls back to a wordmark until /public/logo.png exists.
 */
export function Logo({ logo, className }: { logo: LogoAsset | null; className?: string }) {
  if (!logo) {
    return (
      <span className={cx("font-display text-base font-semibold leading-none tracking-[0.16em] text-white", className)}>
        JNROS <span className="font-medium text-white/70">LOGISTICS</span>
      </span>
    );
  }

  return (
    <span className={cx("inline-flex items-center rounded-lg bg-white px-2.5 py-1.5", className)}>
      <Image
        src={logo.src}
        alt="Jnros Logistics"
        width={Math.round((HEIGHT * logo.width) / logo.height)}
        height={HEIGHT}
        className="h-8 w-auto md:h-9"
      />
    </span>
  );
}
