import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { LogoAsset } from "@/components/Logo";

/**
 * Reads /public/logo.png at build time. Returns null until the file is added,
 * in which case the "JNROS LOGISTICS" wordmark is shown instead.
 */
export function getLogo(): LogoAsset | null {
  const file = join(process.cwd(), "public", "logo.png");
  if (!existsSync(file)) return null;

  const buf = readFileSync(file);
  const isPng = buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47;
  return {
    src: "/logo.png",
    width: isPng ? buf.readUInt32BE(16) : 300,
    height: isPng ? buf.readUInt32BE(20) : 113,
  };
}
