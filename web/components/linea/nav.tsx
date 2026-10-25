"use client";

import * as React from "react";

const LINKS = [
  ["#listen", "How it works"],
  ["#calls", "On calls"],
  ["#rooms", "In person"],
  ["#voices", "Stories"],
  ["#faq", "Questions"],
  ["#contact", "Contact"],
] as const;

function Cta({ className }: { className: string }) {
  return (
    <a className={className} href="#start">
      <span className="m-btn__label">Get Linea free</span>
      <span className="m-btn__wave" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </a>
  );
}

export function Nav() {
  const [open, setOpen] = React.useState(false);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav on-dark" id="nav" data-8b-section="navigation">
      <nav className="nav__bar" aria-label="Main">
        <a className="nav__brand" href="#hero" aria-label="Linea, back to top">
          <svg className="nav__mark" viewBox="0 0 40 28" aria-hidden="true">
            <path className="nav__mark-a" d="M3 19C10 5 17 5 21 14s11 9 16-6" />
            <path className="nav__mark-b" d="M3 10c7 13 14 13 18 4s11-10 16 5" />
          </svg>
          <span className="nav__word m-text-5">Linea</span>
        </a>
        <ul className="nav__links m-text-6">
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <a className="m-link-2" href={href}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <Cta className="m-btn-3 nav__cta" />
        <button
          ref={toggleRef}
          className="m-icon-btn nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </nav>
      <div
        className="menu"
        id="menu"
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        <button ref={closeRef} className="m-icon-btn menu__close" type="button" aria-label="Close menu" onClick={() => { setOpen(false); toggleRef.current?.focus(); }}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <ul className="menu__links m-text-5">
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <a className="m-link-2" href={href}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <Cta className="m-btn" />
      </div>
    </header>
  );
}
