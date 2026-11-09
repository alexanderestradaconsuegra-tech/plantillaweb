import type { SVGProps } from "react";

export default function FigmaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 38 57" fill="none" aria-hidden="true" {...props}>
      <path d="M19 28.5a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 019.5 38H19v9.5a9.5 9.5 0 01-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 000-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 009.5 19H19V0H9.5A9.5 9.5 0 000 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 009.5 38H19V19H9.5A9.5 9.5 0 000 28.5z" fill="#A259FF" />
    </svg>
  );
}
