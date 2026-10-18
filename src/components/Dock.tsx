"use client";

import { useEffect, useRef, useState } from "react";
import { APP_URL } from "@/lib/links";

type Item = { id: string; label: string; short: string; href: string; desktopOnly?: boolean };

// أقسام الصفحة، وبعد الفاصل الصفحات اللي برّه الرئيسية.
const SECTIONS: Item[] = [
  { id: "events", label: "أحداث موقعك", short: "الأحداث", href: "#events" },
  { id: "campaigns", label: "الحملات", short: "الحملات", href: "#campaigns" },
  { id: "pages", label: "النشر والتفاعل", short: "النشر", href: "#pages" },
  { id: "platforms", label: "المنصات", short: "المنصات", href: "#platforms" },
  { id: "how", label: "كيف نبدأ", short: "البداية", href: "#how" },
];
const PAGES: Item[] = [
  { id: "pricing", label: "الأسعار", short: "الأسعار", href: "#pricing" },
  { id: "blog", label: "المدونة", short: "المدونة", href: `${APP_URL}/blog`, desktopOnly: true },
];
const ALL = [...SECTIONS, ...PAGES];

function DockItem({ item, active }: { item: Item; active: boolean }) {
  return (
    <a
      href={item.href}
      className={`dock-item group relative shrink-0 flex-col items-center gap-0.5 rounded-[10px] px-1 py-1 md:px-2 ${item.desktopOnly ? "hidden md:flex" : "flex"}`}
      aria-label={item.label}
      aria-current={active ? "true" : undefined}
    >
      <img src={`/dock/${item.id}.svg`} alt="" width={32} height={32} className="size-8 md:size-[30px]" draggable={false} />
      <span className="text-[0.7rem] leading-none text-ink-soft md:hidden">{item.short}</span>
      <span
        className={`absolute -bottom-1.5 hidden size-1 rounded-full bg-ink md:block ${active ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      />
      <span
        className="dock-tip pointer-events-none absolute right-1/2 top-full mt-3 hidden whitespace-nowrap rounded-[8px] bg-ink px-2.5 py-1 font-display text-[0.78rem] text-white md:block"
        aria-hidden
      >
        {item.label}
      </span>
    </a>
  );
}

/**
 * الـ dock: مفتوح فوق الصفحة، ولما تنزل يتقفل لزر صغير باسم القسم اللي أنت فيه.
 * على الموبايل ثابت تحت ومفتوح دايماً.
 */
export function Dock() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const pinned = useRef(false); // فتحه بنفسه → ما نقفلهوش عليه وهو بينزل

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onScroll = () => {
      if (!desktop.matches) return setOpen(true);
      const y = window.scrollY;
      if (y < 40) {
        pinned.current = false;
        setOpen(true);
      } else if (y > 160 && !pinned.current) {
        setOpen(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", onScroll);
    };
  }, []);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => e !== null);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const current = ALL.find((i) => i.id === active);

  return (
    <nav
      data-dock={open ? "open" : "closed"}
      aria-label="أقسام الموقع"
      className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 md:bottom-auto md:top-[14px] md:px-0"
    >
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="dock-close hidden size-[26px] place-items-center rounded-full bg-line-strong/70 text-ink-soft hover:bg-line-strong md:grid"
          aria-label="صغّر القائمة"
        >
          <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="dock-surface flex items-center">
          <div className="dock-rail">
            <div>
              <div className="flex items-center gap-0.5 px-1 py-1.5 md:gap-1 md:px-2.5 md:py-[7px]">
                {SECTIONS.map((i) => (
                  <DockItem key={i.id} item={i} active={active === i.id} />
                ))}
                <span className="mx-0.5 h-6 w-px shrink-0 bg-line-strong md:mx-1.5" aria-hidden />
                {PAGES.map((i) => (
                  <DockItem key={i.id} item={i} active={active === i.id} />
                ))}
              </div>
            </div>
          </div>
          <div className="dock-peek" aria-hidden={open}>
            <button
              type="button"
              onClick={() => {
                pinned.current = true;
                setOpen(true);
              }}
              tabIndex={open ? -1 : 0}
              className="flex items-center gap-2 whitespace-nowrap px-3 py-[9px] font-display text-[0.9rem] text-ink"
              aria-label="افتح القائمة"
            >
              {current ? (
                <img src={`/dock/${current.id}.svg`} alt="" width={22} height={22} className="size-[22px]" />
              ) : (
                <span className="flex -space-x-2" aria-hidden>
                  {["events", "campaigns", "pages"].map((id) => (
                    <img key={id} src={`/dock/${id}.svg`} alt="" width={22} height={22} className="size-[22px]" />
                  ))}
                </span>
              )}
              {current ? current.label : "الأقسام"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
