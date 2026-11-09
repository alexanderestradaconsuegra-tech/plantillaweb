import type { SVGProps } from "react";

/** Capas que se apilan: stand-in del arte "Built for the way you build". */
export default function FeatureBuild(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 288" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="fb-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b6cff" />
          <stop offset="1" stopColor="#4b2fd0" />
        </linearGradient>
        <linearGradient id="fb-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0e7a96" />
        </linearGradient>
      </defs>
      <rect x="95" y="92" width="210" height="130" rx="22" fill="url(#fb-b)" opacity=".35" />
      <rect x="80" y="70" width="210" height="130" rx="22" fill="url(#fb-a)" opacity=".55" />
      <rect x="65" y="48" width="210" height="130" rx="22" fill="#fff" stroke="#e5e7eb" />
      <rect x="85" y="72" width="90" height="10" rx="5" fill="#0f172a" />
      <rect x="85" y="96" width="150" height="8" rx="4" fill="#cbd5e1" />
      <rect x="85" y="114" width="120" height="8" rx="4" fill="#e2e8f0" />
      <rect x="85" y="140" width="56" height="22" rx="11" fill="url(#fb-a)" />
    </svg>
  );
}
