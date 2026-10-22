"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { LOGIN_URL, SIGNUP_URL } from "@/lib/links";

const LINKS = [
  { href: "#services", label: "خدماتنا" },
  { href: "#why", label: "ليش إحنا" },
  { href: "#pricing", label: "الأسعار" },
  { href: "#faq", label: "الأسئلة" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav aria-label="الرئيسية" className="mx-auto flex max-w-[78rem] items-center justify-between gap-3 rounded-[20px] bg-[var(--night-2)]/80 px-3 py-2.5 ring-1 ring-[var(--line)] backdrop-blur-md sm:gap-6 sm:px-4">
        <a href="/landing" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[1rem] font-bold sm:text-[1.0625rem]">
          <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-[var(--night-3)] ring-1 ring-[var(--line)]">
            <Image src="/landing/mascot-head.png" alt="" width={36} height={36} className="mt-1 size-8 object-contain" />
          </span>
          مسوّقك الذكي
        </a>
        <ul className="hidden items-center gap-8 text-[0.9375rem] text-[var(--fog)] lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-white">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href={LOGIN_URL} className="hidden text-[0.9375rem] text-[var(--fog)] transition-colors hover:text-white sm:inline">دخول</a>
          <a href={SIGNUP_URL} className="inline-flex h-10 items-center whitespace-nowrap rounded-[12px] bg-white px-4 text-[0.875rem] font-semibold text-[var(--night)] transition-colors hover:bg-[#e9eaee]">
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
      <AnimatePresence>
        {open && (
          <motion.ul
            id="landing-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="mx-auto mt-2 grid max-w-[78rem] gap-1 rounded-[20px] bg-[var(--night-2)]/95 p-3 text-[1.0625rem] ring-1 ring-[var(--line)] backdrop-blur-md lg:hidden"
          >
            {[...LINKS, { href: LOGIN_URL, label: "دخول" }].map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3">{l.label}</a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
