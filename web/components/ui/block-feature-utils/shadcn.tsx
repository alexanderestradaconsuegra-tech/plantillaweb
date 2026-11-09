import type { SVGProps } from "react";

export default function Shadcn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="none" aria-hidden="true" {...props}>
      <path d="M208 128l-80 80M192 40L40 192" stroke="currentColor" strokeWidth="24" strokeLinecap="round" />
    </svg>
  );
}
