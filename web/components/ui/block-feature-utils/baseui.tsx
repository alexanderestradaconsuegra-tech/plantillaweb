import type { SVGProps } from "react";

export default function BaseUi(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.5 2.5v6.2c-.7-.6-1.6-.9-2.6-.9-2.4 0-4.4 2-4.4 4.6s2 4.6 4.4 4.6c1 0 1.9-.3 2.6-.9v.8h2.5V2.5h-2.5zm-2.1 12.7a2.5 2.5 0 110-5 2.5 2.5 0 010 5zM2.5 2.5h2.7v18.9H2.5V2.5zm4.7 5.6h2.5v13.3H7.2V8.1z" />
    </svg>
  );
}
