import * as React from "react";

import { cn } from "@/lib/utils";

type KutnitiLogoProps = React.SVGProps<SVGSVGElement>;

export function KutnitiLogo({ className, ...props }: KutnitiLogoProps) {
  const logoId = React.useId().replace(/:/g, "");
  const fillId = `${logoId}-fill`;
  const glowId = `${logoId}-glow`;

  return (
    <svg
      viewBox="0 0 128 128"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <radialGradient id={fillId} cx="42%" cy="35%" r="72%">
          <stop offset="0%" stopColor="var(--brand-purple-light)" />
          <stop offset="62%" stopColor="var(--brand-purple)" />
          <stop offset="100%" stopColor="var(--brand-purple-deep)" />
        </radialGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.4" floodColor="#ffffff" floodOpacity="0.22" />
        </filter>
      </defs>
      <circle
        cx="64"
        cy="64"
        r="61"
        fill={`url(#${fillId})`}
        stroke="var(--brand-gold)"
        strokeWidth="3"
      />
      <g filter={`url(#${glowId})`} fill="#fff">
        <path d="M41.5 22.5c12.8 13.8 19.4 31.2 20.1 53.5l1 28.8-14.2-3.5-1.1-24.7c-.9-20.8-7.3-35.9-20-47.6l14.2-6.5Z" />
        <path d="M46.5 56.6 91.2 49.5l1.9 12.4-46 7.2-.6-12.5Z" />
        <path d="M63.3 75.8c6.3-11.3 14.3-16.4 24.4-15.4 10.4 1 17.2 8.1 17.2 18.1 0 13.8-12 24.7-27.5 24.8l16.3 17.3-14.8 3.3-24-25.4c-3.4-3.6-3.4-9.2-.1-12.5 3.7-3.7 9.1-4.4 14.9-1.7 6.7 3.1 15.2-.4 17.4-7.4 1.3-4.1-.6-7.1-4.6-7.4-5.9-.4-11 4.1-17.2 14.4l-2-8.1Z" />
      </g>
    </svg>
  );
}
