import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { gsap, reduced } from "../../lib/gsap";

/*
 * «اسحب الخط وشوف الفرق»: طبقتين فوق بعض بنفس الترتيب. تحت «بدون» (فريق مستقلين بالشهر)، وفوقها «مع» مقصوصة لين الخط.
 * الخط من اليسار (--p): يسار الخط «مع»، ويمينه «بدون». أول ما توصل يوقف على «بدون» شوي، وبعدها يمشي لحاله لين «مع».
 * كل طبقة اسمها ومجموعها في جهتها («بدون» يمين و«مع» يسار)، فلما يكون الخط في النص تقرأ الاثنين.
 * الماوس يسحب من أي مكان، وفي الجوال من المقبض بس عشان التمرير العادي ما يحرّك الخط.
 * على الخط فقاعة فيها تكلفتك الشهرية: تنزل من رواتب الفريق لين سعر أول باقة كل ما تسحب الخط لـ«مع».
 * في اللابتوب في صف الأسماء فوق (فاضي في النص)، وفي الجوال فوق المقبض.
 * الأسعار تقريبية لمستقلين في السوق السعودي (شهرياً). موظفين بدوام كامل أغلى بكثير، فما نبالغ.
 */
const ROLES = [
  { role: "مسوّق إعلانات", salary: 2500, gain: "إعلانات تتحسّن لحظة بلحظة" },
  { role: "مصمم", salary: 1500, gain: "تصاميم بهويتك" },
  { role: "مونتير", salary: 1500, gain: "فيديوهات جاهزة للنشر" },
  { role: "مسؤول سوشال", salary: 1800, gain: "نشر منتظم في حساباتك" },
  { role: "مختص سيو", salary: 1500, gain: "متجرك أول في قوقل" },
];
const TOTAL = ROLES.reduce((sum, r) => sum + r.salary, 0);
/** أرخص باقة (المبتدئ) في المنصة، وفيها كل الخدمات. لو تغيّر السعر هناك غيّره هنا */
const PLAN = 799;
const PAINS = ["تنسيق بين 5 أشخاص", "مواعيد تتأخر", "كل واحد يشتغل لحاله"];
const GAINS = ["نشتغل 24/7", "بدون توظيف", "كله في مكان واحد"];

const sar = (n: number) => n.toLocaleString("en-US");

export function Compare() {
  const box = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLButtonElement>(null);
  const cost = useRef<HTMLSpanElement>(null);
  const sweep = useRef<gsap.core.Timeline | null>(null);

  // نحرّك الخط بمتغيّر CSS مباشرة (بدون رسم React كل فريم)
  const set = (p: number) => {
    p = Math.min(100, Math.max(0, p));
    box.current!.style.setProperty("--p", `${p}%`);
    // على الأطراف نفس الأرقام اللي في المجموع بالضبط، وبينها تقريب لأقرب 10
    const now = sar(p <= 1 ? TOTAL : p >= 99 ? PLAN : Math.round((TOTAL - ((TOTAL - PLAN) * p) / 100) / 10) * 10);
    cost.current!.textContent = now;
    knob.current!.setAttribute("aria-valuenow", `${Math.round(p)}`);
    knob.current!.setAttribute("aria-valuetext", `${p < 50 ? "بدون مسوّقك الذكي" : "مع مسوّقك الذكي"}: ${now} ريال شهرياً`);
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (reduced()) return set(100);
      const s = { p: 0 };
      // يمشي لين «مع»، وبعدين يرجع شوي ويرجع، عشان يبان إن الخط ينسحب
      sweep.current = gsap.timeline({ delay: 1.4, onUpdate: () => set(s.p) })
        .to(s, { p: 100, duration: 1.8, ease: "power2.inOut" })
        .to(s, { p: 86, duration: 0.4, ease: "power1.out" }, "+=0.5")
        .to(s, { p: 100, duration: 0.5, ease: "power2.inOut" });
    }, { threshold: 0.6 });
    io.observe(box.current!);
    return () => {
      io.disconnect();
      sweep.current?.kill();
    };
  }, []);

  const follow = (e: PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * 100);
  };
  const start = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" && !knob.current!.contains(e.target as Node)) return;
    sweep.current?.kill();
    e.currentTarget.setPointerCapture(e.pointerId);
    follow(e);
  };
  const keys = (e: KeyboardEvent) => {
    const now = Number(knob.current!.getAttribute("aria-valuenow"));
    const next = { ArrowLeft: now - 10, ArrowRight: now + 10, Home: 0, End: 100 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    sweep.current?.kill();
    set(next);
  };

  return (
    <div className="mt-24 lg:mt-32">
      <div className="text-center">
        <h3 className="text-[clamp(1.625rem,2.8vw,2.25rem)] font-bold leading-[1.35]">
          اسحب الخط… <mark className="hl [--hl:#ffd9a8]">وشوف الفرق</mark>
        </h3>
        <p className="mt-3 text-[1.0625rem] text-ink-soft">فريق تسويق كامل من المستقلين، ولا مسوّقك الذكي؟</p>
      </div>

      <div
        ref={box}
        onPointerDown={start}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && follow(e)}
        style={{ "--p": "0%" } as CSSProperties}
        className="relative mt-10 grid cursor-ew-resize select-none touch-pan-y overflow-hidden rounded-[32px] shadow-[0_30px_60px_-30px_rgb(17_19_24/0.35)] ring-1 ring-black/5"
      >
        {/* بدون: فريق مستقلين */}
        <Layer
          className="bg-white"
          label={<span className="rounded-full bg-[#eceef2] px-4 py-1.5 text-ink-soft">بدون مسوّقك الذكي</span>}
          tiles={ROLES.map(({ role, salary }) => (
            <Tile key={role} className="bg-cloud" icon={<Person />} title={role} sub={<span className="text-[#c2410c]">{sar(salary)} ريال</span>} />
          ))}
          chips={PAINS.map((p) => <span key={p} className="rounded-full bg-cloud px-3.5 py-1.5 text-ink-soft">{p}</span>)}
          total={
            <>
              <span className="text-[0.9375rem] text-ink-soft">كل شهر تقريباً، بأسعار المستقلين</span>
              <strong className="block text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-[#c2410c]">{sar(TOTAL)} ريال</strong>
            </>
          }
        />
        {/* مع: نفس المكان، والفرق */}
        <Layer
          end
          className="bg-night text-white [clip-path:inset(0_calc(100%-var(--p))_0_0)]"
          label={<span className="rounded-full bg-(image:--gradient) px-4 py-1.5">مع مسوّقك الذكي</span>}
          tiles={ROLES.map(({ role, gain }) => (
            <Tile key={role} className="bg-white/[0.06] ring-1 ring-white/10" icon={<Check />} title={gain} />
          ))}
          chips={GAINS.map((g) => <span key={g} className="rounded-full bg-white/[0.08] px-3.5 py-1.5 text-mist">{g}</span>)}
          total={
            <>
              <span className="text-[0.9375rem] text-mist">من {sar(PLAN)} ريال في الشهر، والفريق كامل</span>
              <strong className="block bg-(image:--gradient) bg-clip-text text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-transparent">بأقل من تكلفة واحد منهم</strong>
            </>
          }
        />

        {/* الخط والمقبض، وفوقه تكلفتك الشهرية */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-[calc(50%-4.5rem)] z-10 lg:top-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[0.875rem] font-bold text-night shadow-[0_8px_24px_-8px_rgb(17_19_24/0.5)] ring-1 ring-black/10 [left:clamp(5.75rem,var(--p),calc(100%-5.75rem))]"
        >
          <span ref={cost} className="tabular-nums">{sar(TOTAL)}</span> ريال/شهر
        </span>
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-(--p) w-[3px] -translate-x-1/2 bg-[linear-gradient(#7c5cff,#d946ef,#ffa94d)]" />
        <button
          ref={knob}
          type="button"
          role="slider"
          aria-label="قارن: بدون مسوّقك الذكي ومعه"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-valuetext="بدون مسوّقك الذكي"
          onKeyDown={keys}
          className="absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none place-items-center rounded-full bg-white focus-visible:rounded-full! text-night shadow-[0_8px_24px_-6px_rgb(17_19_24/0.5)] ring-1 ring-black/10 [left:clamp(1.75rem,var(--p),calc(100%-1.75rem))]"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 7 4 12l5 5M15 7l5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* الطبقتين بنفس الهيكل بالضبط، عشان كل كرت ينقلب في مكانه لما يمر عليه الخط. end: الاسم والمجموع في الجهة اليسار */
function Layer({ className, end = false, label, tiles, chips, total }: { className: string; end?: boolean; label: ReactNode; tiles: ReactNode; chips: ReactNode; total: ReactNode }) {
  return (
    <div className={`flex flex-col gap-6 p-5 [grid-area:1/1] sm:p-8 lg:p-10 ${className}`}>
      <div className={`flex text-[1rem] font-semibold ${end ? "justify-end" : ""}`}>{label}</div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{tiles}</ul>
      {/* في الجوال عمود في جهة الطبقة، ومن 1024 صف: المجموع في جهتها والمميزات في الثانية */}
      <div className={`mt-auto flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8 ${end ? "items-end text-end" : "items-start lg:flex-row-reverse"}`}>
        <div className={`flex flex-wrap gap-2 text-[0.875rem] font-medium ${end ? "justify-end" : ""}`}>{chips}</div>
        <div>{total}</div>
      </div>
    </div>
  );
}

function Tile({ className, icon, title, sub }: { className: string; icon: ReactNode; title: string; sub?: ReactNode }) {
  return (
    <li className={`flex h-20 items-center gap-3 rounded-2xl p-4 lg:h-36 lg:flex-col lg:items-start lg:justify-between ${className}`}>
      {icon}
      <span>
        <span className="block text-[1rem] font-semibold leading-[1.5]">{title}</span>
        {sub && <span className="mt-0.5 block text-[0.9375rem] font-medium">{sub}</span>}
      </span>
    </li>
  );
}

function Person() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e3e5ea] text-[#8a8f9c]">
      <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="currentColor">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0z" />
      </svg>
    </span>
  );
}

function Check() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-(image:--gradient) text-white">
      <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3.5 8.5 3 3 6-7" />
      </svg>
    </span>
  );
}
