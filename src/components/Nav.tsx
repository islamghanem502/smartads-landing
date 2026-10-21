"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LOGIN_URL, SIGNUP_URL } from "@/lib/links";

const LINKS = [
  { href: "#how", label: "كيف نشتغل" },
  { href: "#events", label: "المميزات" },
  { href: "#publish", label: "النشر" },
  { href: "#pricing", label: "الأسعار" },
  { href: "#faq", label: "الأسئلة" },
];

function Brand() {
  return (
    <a href="#top" className="flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-[1rem] font-bold sm:text-[1.0625rem]">
      <svg viewBox="0 0 40 40" className="size-7" aria-hidden><use href="#pushpin" /></svg>
      مسوّقك الذكي
    </a>
  );
}

/** شريط التنقل: يتلوّن على حسب القسم اللي تحته، غامق أو فاتح. */
export function Nav() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [open, setOpen] = useState(false);

  /* القسم اللي تحت الشريط فعلاً، مو حسابات مسبقة: الأقسام المثبّتة تغيّر الأطوال */
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      for (const el of document.elementsFromPoint(window.innerWidth / 2, 44)) {
        const sec = el.closest<HTMLElement>("[data-theme]");
        if (sec) { setTheme(sec.dataset.theme === "light" ? "light" : "dark"); break; }
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const dark = theme === "dark";
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav
        aria-label="الرئيسية"
        className={`mx-auto flex max-w-[76rem] items-center justify-between gap-3 rounded-2xl px-3 py-2.5 sm:gap-6 sm:px-4 backdrop-blur-md transition-colors duration-500 ${
          dark ? "bg-board/80 text-chalk ring-1 ring-white/10" : "bg-snow/85 text-ink ring-1 ring-ink/10"
        }`}
      >
        <Brand />
        <ul className="hidden items-center gap-7 text-[0.9375rem] lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={`transition-colors ${dark ? "text-chalk-soft hover:text-chalk" : "text-ink-soft hover:text-ink"}`}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href={LOGIN_URL} className={`hidden text-[0.9375rem] transition-colors sm:inline ${dark ? "text-chalk-soft hover:text-chalk" : "text-ink-soft hover:text-ink"}`}>دخول</a>
          <a href={SIGNUP_URL} className="inline-flex h-10 items-center whitespace-nowrap rounded-[10px] bg-green px-3.5 font-display text-[0.8125rem] font-semibold text-white transition-colors hover:bg-green-deep sm:px-4 sm:text-[0.875rem]">
            اربط متجرك
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-[10px] lg:hidden"
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
          <motion.div
            id="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className={`mx-auto mt-2 max-w-[76rem] rounded-2xl p-3 backdrop-blur-md lg:hidden ${dark ? "bg-board/95 text-chalk ring-1 ring-white/10" : "bg-snow/95 text-ink ring-1 ring-ink/10"}`}
          >
            <ul className="grid gap-1 text-[1.0625rem]">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3">{l.label}</a>
                </li>
              ))}
              <li>
                <a href={LOGIN_URL} className="block rounded-xl px-3 py-3">دخول</a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
