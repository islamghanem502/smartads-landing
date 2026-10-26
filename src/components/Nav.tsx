import { useState } from "react";
import { LOGIN_URL, SIGNUP_URL } from "../lib/links";
import { Container } from "./layout";

const LINKS = [
  { href: "#services", label: "خدماتنا" },
  { href: "#why", label: "ليش إحنا" },
  { href: "#pricing", label: "الأسعار" },
  { href: "#faq", label: "الأسئلة" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3">
      <Container>
        <nav aria-label="الرئيسية" className="flex items-center justify-between gap-3 rounded-[20px] bg-night-2/90 px-3 py-2.5 ring-1 ring-line backdrop-blur-md sm:gap-6 sm:px-4">
          <a href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[1rem] font-bold sm:text-[1.0625rem]">
            <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-night-3 ring-1 ring-line">
              <img src="/mascot-head.png" alt="" width={36} height={36} className="mt-1 size-8 object-contain" />
            </span>
            مسوّقك الذكي
          </a>
          <ul className="hidden items-center gap-8 text-[0.9375rem] text-fog lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-white">{l.label}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href={LOGIN_URL} className="hidden text-[0.9375rem] text-fog transition-colors hover:text-white sm:inline">دخول</a>
            <a href={SIGNUP_URL} className="inline-flex h-10 items-center whitespace-nowrap rounded-[12px] bg-white px-4 text-[0.875rem] font-semibold text-night transition-colors hover:bg-[#e9eaee]">
              اربط متجرك
            </a>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="landing-menu"
              onClick={() => setOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-[12px] lg:hidden"
            >
              <span className="sr-only">القائمة</span>
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h11" />}
              </svg>
            </button>
          </div>
        </nav>
        {open && (
          <ul
            id="landing-menu"
            className="mt-2 grid gap-1 rounded-[20px] bg-night-2/95 p-3 text-[1.0625rem] ring-1 ring-line backdrop-blur-md transition-[opacity,translate] duration-200 ease-lift starting:-translate-y-2 starting:opacity-0 lg:hidden"
          >
            {[...LINKS, { href: LOGIN_URL, label: "دخول" }].map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3">{l.label}</a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </header>
  );
}
