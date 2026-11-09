import type { SVGProps } from "react";

/** Formas con movimiento: stand-in del arte "Smooth animations with motion". */
export default function FeatureMotion(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 288" fill="none" aria-hidden="true" {...props}>
      <circle cx="200" cy="144" r="46" fill="#8b6cff" opacity=".2">
        <animate attributeName="r" values="46;62;46" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="144" r="28" fill="#8b6cff">
        <animate attributeName="r" values="28;34;28" dur="3s" repeatCount="indefinite" />
      </circle>
      <rect x="90" y="120" width="48" height="48" rx="14" fill="#38bdf8">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -26;0 0" dur="2.4s" repeatCount="indefinite" />
      </rect>
      <rect x="262" y="120" width="48" height="48" rx="24" fill="#ff9559">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 26;0 0" dur="2.4s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}
