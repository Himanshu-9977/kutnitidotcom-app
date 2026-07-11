/* eslint-disable @next/next/no-img-element -- the brand logo must bypass the custom Strapi image loader. */

import { cn } from "@/lib/utils";

type KutnitiLogoProps = {
  className?: string;
};

export function KutnitiLogo({ className }: KutnitiLogoProps) {
  return (
    // Use a native image so the global Next image loader does not rewrite this local brand asset.
    <img
      src="/kutniti-logo-circle.png"
      alt=""
      width="660"
      height="660"
      loading="eager"
      decoding="async"
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
