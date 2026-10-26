import { useEffect, useRef } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { Google, Meta, Snapchat, TikTok } from "../logos";

/*
 * المشاهد اللي ورا الشخصية في كروت الخدمات. كل مشهد واجهة من منتجنا تحكي قصة قصيرة:
 * تشتغل أول ما يبان الكرت، وتعيد لما تمرّ عليه. الـ HTML مرسوم على آخر القصة، فبدون جافاسكربت
 * أو مع «تقليل الحركة» يبان كامل. المشاهد للزينة (aria-hidden) لأن عنوان الكرت ووصفه يشرحون الخدمة.
 * الأرقام أمثلة توضيحية.
 */
export type SceneProps = { play: number };

type Q = (selector: string) => HTMLElement[];

function useStory(play: number, build: (q: Q) => gsap.core.Timeline) {
  const ref = useRef<HTMLDivElement>(null);
  const story = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (reduced()) return;
    story.current = build(gsap.utils.selector(ref) as Q).pause(0);
  }, { scope: ref });

  // ما نقطع القصة لو المؤشر دخل وطلع وهي شغّالة
  useEffect(() => {
    const s = story.current;
    if (play && s && !s.isActive()) s.restart();
  }, [play]);

  return ref;
}

const panel = "mx-auto rounded-2xl bg-[#1b1e25] text-white ring-1 ring-white/10 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.7)]";

/* ─── الإعلانات: الميزانية تبدأ متساوية، وبعد التحسين تروح للمنصة اللي تبيع ─── */

const VIOLET = "#8b6cff";
const IDLE = "rgb(255 255 255 / 0.22)";
const SPLIT = [
  { L: Snapchat, to: 42, move: "up" },
  { L: TikTok, to: 28 },
  { L: Meta, to: 20 },
  { L: Google, to: 10, move: "down" },
];
const TOP = 42;

export function BudgetScene({ play }: SceneProps) {
  const ref = useStory(play, (q) => {
    const tl = gsap.timeline({ defaults: { duration: 1.1, ease: "power3.inOut" } });
    SPLIT.forEach(({ to }, i) => {
      tl.fromTo(q(`[data-bar="${i}"]`), { height: `${(25 / TOP) * 100}%` }, { height: `${(to / TOP) * 100}%` }, 0.35)
        .fromTo(q(`[data-pct="${i}"]`), { innerText: 25 }, { innerText: to, snap: { innerText: 1 } }, 0.35);
    });
    return tl
      .fromTo(q('[data-bar="0"]'), { backgroundColor: IDLE }, { backgroundColor: VIOLET, duration: 0.45 }, 0.95)
      .fromTo(q("[data-arrow]"), { opacity: 0, y: 3 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.12, ease: "power2.out" }, 1.4);
  });

  return (
    <div ref={ref} aria-hidden className={`${panel} w-[80%] px-3.5 pb-3 pt-3`}>
      <div className="flex items-center justify-between">
        <span className="text-[0.75rem] font-semibold">توزيع الميزانية</span>
        <span className="text-[0.6875rem] text-white/45">اليوم</span>
      </div>
      <ul className="mt-2.5 grid grid-cols-4 gap-3">
        {SPLIT.map(({ L, to, move }, i) => (
          <li key={i} className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-0.5 text-[0.625rem] tabular-nums text-white/70">
              {move && (
                <svg data-arrow viewBox="0 0 10 10" className={`size-2 ${move === "up" ? "text-[#4ade80]" : "rotate-180 text-[#f87171]"}`}>
                  <path d="M5 2 9 7H1z" fill="currentColor" />
                </svg>
              )}
              <span data-pct={i}>{to}</span>٪
            </span>
            <span className="flex h-10 w-full items-end">
              <span data-bar={i} className="w-full rounded-t-md" style={{ height: `${(to / TOP) * 100}%`, background: i === 0 ? VIOLET : IDLE }} />
            </span>
            <span className="mt-1 grid size-6 place-items-center rounded-md bg-white"><L className="size-4" /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── المحتوى: الرينق لايت يولّع، الكاميرا تسجّل، وبعدها المقطع ينجدول ─── */

export function StudioScene({ play }: SceneProps) {
  const ref = useStory(play, (q) => {
    const clock = q("[data-clock]")[0];
    const t = { s: 0 };
    return gsap.timeline()
      // يولّع برمشة، مثل الحقيقي
      .fromTo(q("[data-ring]"), { opacity: 0.12 }, { keyframes: [{ opacity: 0.75, duration: 0.07 }, { opacity: 0.3, duration: 0.1 }, { opacity: 1, duration: 0.35 }] }, 0.2)
      .fromTo(q("[data-spill]"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.35)
      // إطار الكاميرا يقفل على الشخصية
      .fromTo(q("[data-corner]"), { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.6)
      .fromTo(q("[data-rec]"), { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.3 }, 0.85)
      .fromTo(t, { s: 0 }, { s: 12, duration: 1.6, ease: "none", onUpdate: () => { clock.textContent = `00:${String(Math.round(t.s)).padStart(2, "0")}`; } }, 0.9)
      // خلص التصوير: التسجيل يصير موعد نشر
      .to(q("[data-rec]"), { opacity: 0, y: -4, duration: 0.25 }, 2.7)
      .fromTo(q("[data-sched]"), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, 2.85);
  });

  const corner = "absolute size-4 border-white/80";
  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      {/* الرينق ورا راس الشخصية، وضوءه على الخلفية */}
      <div data-spill className="absolute left-1/2 top-[71%] aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_240_220/0.14),transparent)]" />
      <div
        data-ring
        className="absolute left-1/2 top-[71%] aspect-square w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.6rem] border-[#fff5e8] shadow-[0_0_24px_3px_rgb(255_236_210/0.5),inset_0_0_14px_rgb(255_236_210/0.4)]"
      />
      {/* إطار الكاميرا حول الشخصية */}
      <div className="absolute inset-x-[9%] bottom-[5%] top-[31%]">
        <span data-corner className={`${corner} right-0 top-0 rounded-tr-lg border-r-2 border-t-2`} />
        <span data-corner className={`${corner} left-0 top-0 rounded-tl-lg border-l-2 border-t-2`} />
        <span data-corner className={`${corner} bottom-0 right-0 rounded-br-lg border-b-2 border-r-2`} />
        <span data-corner className={`${corner} bottom-0 left-0 rounded-bl-lg border-b-2 border-l-2`} />
        <div className="absolute inset-x-0 -top-3.5 flex justify-center">
          <span data-rec className="absolute flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[0.6875rem] font-medium text-white opacity-0 backdrop-blur-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-[#ef4444]" />
            تسجيل <span data-clock dir="ltr" className="tabular-nums">00:12</span>
          </span>
          <span data-sched className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-night">
            <svg viewBox="0 0 16 16" className="size-3.5 text-[#e85aa6]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <rect x="2" y="3" width="12" height="11" rx="2.5" />
              <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
            </svg>
            مجدول · الخميس 8 م
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── السيو: نكتب البحث، ومتجرك يطلع من تحت لين يصير الأول ─── */

const AMBER = "#ffa94d";
const QUERY = "عباية سوداء";

export function SearchScene({ play }: SceneProps) {
  const ref = useStory(play, (q) => {
    const typed = q("[data-query]")[0];
    const [ours, ...others] = q("[data-row]");
    const gap = parseFloat(getComputedStyle(ours.parentElement!).rowGap) || 0;
    const below = others.reduce((h, r) => h + r.offsetHeight + gap, 0);
    const n = { i: 0 };
    return gsap.timeline()
      .fromTo(n, { i: 0 }, { i: QUERY.length, duration: 0.8, ease: "none", onUpdate: () => { typed.textContent = QUERY.slice(0, Math.round(n.i)); } }, 0.2)
      .fromTo(q("[data-row]"), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06 }, 1.05)
      // متجرك يبدأ آخر واحد، ويطلع فوقهم
      .fromTo(ours, { y: below }, { y: 0, duration: 0.9, ease: "power3.inOut" }, 1.5)
      .fromTo(others, { y: -(ours.offsetHeight + gap) }, { y: 0, duration: 0.9, ease: "power3.inOut" }, 1.5)
      .fromTo(ours, { borderColor: "rgb(255 255 255 / 0.06)", backgroundColor: "rgb(255 255 255 / 0)" }, { borderColor: "rgb(255 169 77 / 0.6)", backgroundColor: "rgb(255 169 77 / 0.1)", duration: 0.4 }, 2.2)
      .fromTo(q("[data-rank]"), { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2.5)" }, 2.3)
      .fromTo(q("[data-star]"), { opacity: 0.2 }, { opacity: 1, duration: 0.15, stagger: 0.07 }, 2.45);
  });

  const other = (w: string) => (
    <li data-row className="flex items-center gap-2 rounded-xl border border-white/[0.06] px-2.5 py-2">
      <span className="size-5 shrink-0 rounded-full bg-white/10" />
      <span className="grid flex-1 gap-1.5">
        <span className={`h-1.5 rounded-full bg-white/15 ${w}`} />
        <span className="h-1.5 w-1/2 rounded-full bg-white/[0.08]" />
      </span>
    </li>
  );

  return (
    <div ref={ref} aria-hidden className={`${panel} w-[86%] p-2.5`}>
      <div className="flex h-7 items-center gap-2 rounded-full bg-white/[0.07] px-3">
        <Google className="size-4 shrink-0" />
        <span className="text-[0.75rem]">
          <span data-query>{QUERY}</span>
          <span className="ms-px inline-block h-3 w-px animate-pulse bg-white/70 align-middle" />
        </span>
      </div>
      <ul className="mt-2 grid gap-1.5">
        <li data-row className="flex items-center gap-2 rounded-xl border px-2.5 py-2" style={{ borderColor: "rgb(255 169 77 / 0.6)", backgroundColor: "rgb(255 169 77 / 0.1)" }}>
          <span data-rank className="grid size-5 shrink-0 place-items-center rounded-full text-[0.6875rem] font-bold text-[#3b2200]" style={{ background: AMBER }}>1</span>
          <span className="min-w-0">
            <span className="block truncate text-[0.75rem] font-semibold">متجرك · عباية سوداء كلوش</span>
            <span className="flex items-center gap-1 text-[0.625rem] text-white/60">
              <span className="flex text-[#fbbf24]">{[0, 1, 2, 3, 4].map((s) => <span key={s} data-star>★</span>)}</span>
              4.9 · 189 ر.س
            </span>
          </span>
        </li>
        {other("w-3/4")}
      </ul>
    </div>
  );
}

/* ─── التقارير: المستشار يكتب، يوصلك التقرير، وترد عليه ─── */

export function ChatScene({ play }: SceneProps) {
  const ref = useStory(play, (q) =>
    gsap.timeline()
      .fromTo(q("[data-typing]"), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.25, transformOrigin: "100% 0" }, 0.2)
      .fromTo(q("[data-dot]"), { y: 0 }, { y: -3, duration: 0.22, yoyo: true, repeat: 3, stagger: 0.1, ease: "sine.inOut" }, 0.35)
      .to(q("[data-typing]"), { opacity: 0, duration: 0.15 }, 1.3)
      .fromTo(q("[data-report]"), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, transformOrigin: "100% 0", ease: "back.out(1.6)" }, 1.35)
      .fromTo(q("[data-col]"), { scaleY: 0 }, { scaleY: 1, duration: 0.4, stagger: 0.05, transformOrigin: "50% 100%", ease: "power2.out" }, 1.55)
      .fromTo(q("[data-reply]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 2.4)
      .fromTo(q("[data-ticks]"), { color: "rgb(255 255 255 / 0.45)" }, { color: "#53bdeb", duration: 0.25 }, 3)
  );

  const cols = [30, 45, 38, 55, 48, 70, 100];
  return (
    <div ref={ref} aria-hidden className={`${panel} w-[86%] overflow-hidden !bg-[#0b141a]`}>
      <div className="flex items-center gap-2 bg-[#202c33] px-3 py-1.5">
        <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-night-3">
          <img src="/mascot-head.png" alt="" width={24} height={24} className="mt-1 size-5 object-contain" />
        </span>
        <span>
          <span className="block text-[0.75rem] font-semibold leading-tight">مسوّقك الذكي</span>
          <span className="block text-[0.625rem] leading-tight text-white/55">متصل</span>
        </span>
      </div>
      <div className="relative grid gap-1.5 p-2">
        {/* يكتب… */}
        <span data-typing className="absolute right-2 top-2 flex gap-1 rounded-2xl rounded-se-md bg-[#202c33] px-3 py-2.5 opacity-0">
          {[0, 1, 2].map((d) => <span key={d} data-dot className="size-1.5 rounded-full bg-white/60" />)}
        </span>
        <div data-report className="me-6 rounded-2xl rounded-se-md bg-[#202c33] px-2.5 py-1.5">
          <p className="text-[0.75rem] font-semibold">تقرير الأسبوع</p>
          <div className="mt-1 flex h-5 items-end gap-1">
            {cols.map((h, i) => (
              <span key={i} data-col className={`flex-1 rounded-sm ${i === cols.length - 1 ? "bg-[#25d366]" : "bg-white/20"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="mt-1 flex items-end justify-between gap-2 text-[0.6875rem] text-white/80">
            الطلبات 42 · المبيعات +18٪
            <span className="shrink-0 text-[0.5625rem] text-white/45">9:00 ص</span>
          </p>
        </div>
        <div data-reply className="ms-8 rounded-2xl rounded-ss-md bg-[#005c4b] px-2.5 py-1">
          <p className="flex items-end justify-between gap-2 text-[0.6875rem]">
            تمام، زيدوا ميزانية سناب
            <span className="flex shrink-0 items-center gap-0.5 text-[0.5625rem] text-white/55">
              9:04
              <svg data-ticks viewBox="0 0 18 11" className="h-2.5 w-3.5 text-[#53bdeb]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m1 6 3 3 6-7M7 8l1 1 6-7" />
              </svg>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
