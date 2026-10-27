import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { gsap, reduced } from "../../lib/gsap";

/*
 * «اسحب الخط وشوف الفرق»: طبقتين فوق بعض بنفس الترتيب. تحت «بدون» (فريق مستقلين بالشهر)، وفوقها «مع» مقصوصة لين الخط.
 * الخط من اليسار (--p): يسار الخط «مع»، ويمينه «بدون». أول ما توصل يوقف على «بدون» شوي، وبعدها يمشي لحاله لين «مع».
 * كل طبقة اسمها ومجموعها في جهتها («بدون» يمين و«مع» يسار)، فلما يكون الخط في النص تقرأ الاثنين.
 * الماوس يسحب من أي مكان، وفي الجوال من المقبض بس عشان التمرير العادي ما يحرّك الخط.
 * على الخط فقاعة فيها تكلفتك الشهرية: تنزل من رواتب الفريق لين سعر أول باقة كل ما تسحب الخط لـ«مع».
 * الفقاعة في صف الأسماء فوق (في اللابتوب فاضي في النص)، والمقبض في نص صورة الفريق عشان ما يغطي الكلام.
 * الأسعار تقريبية لمستقلين في السوق السعودي (شهرياً). موظفين بدوام كامل أغلى بكثير، فما نبالغ.
 */
// كل دور «بدون» (شخص رمادي وسعره) يقابله في «مع» واحد من فريقنا في الصورة الجماعية، في نفس المكان،
// شايل أداة الدور. color: لون أداته، وهو العلامة جنب اسمه
const ROLES = [
  { role: "مسوّق إعلانات", salary: 2200, gain: "إعلانات تتحسّن لحظة بلحظة", crew: "مدير الحملات", color: "#8b6cff" },
  { role: "مصمم ومونتير", salary: 2200, gain: "صور وفيديوهات بهويتك", crew: "المصمم", color: "#ec4899" },
  { role: "مسؤول سوشال", salary: 1600, gain: "نشر منتظم في حساباتك", crew: "الناشر", color: "#22c55e" },
  { role: "مختص سيو", salary: 1400, gain: "متجرك أول في قوقل", crew: "مختص السيو", color: "#f59e0b" },
  { role: "محلل بيانات", salary: 1400, gain: "تقريرك كل يوم على واتساب", crew: "المحلل", color: "#eab308" },
];
/** صورة فريقنا (الخمسة جنب بعض) */
const ART = { src: "/why/team.webp", w: 1800, h: 612 };
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
        style={{ "--p": "0%", "--fig": ART.h / ART.w } as CSSProperties}
        className="@container relative mt-10 grid cursor-ew-resize select-none touch-pan-y overflow-hidden rounded-[32px] shadow-[0_30px_60px_-30px_rgb(17_19_24/0.35)] ring-1 ring-black/5"
      >
        {/* بدون: فريق مستقلين */}
        <Layer
          className="bg-white"
          label={<span className="rounded-full bg-[#eceef2] px-4 py-1.5 text-ink-soft">بدون مسوّقك الذكي</span>}
          body={
            <Team className="bg-cloud" figure={<Freelancers />}>
              {ROLES.map(({ role, salary }) => (
                <Row key={role} title={role} sub={<span className="text-[#c2410c]">{sar(salary)} ريال</span>} />
              ))}
            </Team>
          }
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
          label={
            <span className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-night-3 ring-1 ring-white/15">
                <img src="/mascot-head.png" alt="" width={36} height={36} loading="lazy" className="mt-1 size-8 object-contain" />
              </span>
              مع مسوّقك الذكي
            </span>
          }
          body={
            <Team className="bg-white/[0.04] ring-1 ring-white/10" figure={<img src={ART.src} alt="فريق مسوّقك الذكي: خمسة، كل واحد شايل أداة شغله" width={ART.w} height={ART.h} loading="lazy" className="block h-auto w-full" />}>
              {ROLES.map(({ role, gain, crew, color }) => (
                <Row
                  key={role}
                  title={gain}
                  sub={
                    <span className="flex items-center gap-1.5 text-mist">
                      <span className="size-2 shrink-0 rounded-full" style={{ background: color }} />
                      {crew}
                    </span>
                  }
                />
              ))}
            </Team>
          }
          chips={GAINS.map((g) => <span key={g} className="rounded-full bg-white/[0.08] px-3.5 py-1.5 text-mist">{g}</span>)}
          total={
            <>
              <span className="text-[0.9375rem] text-mist">كل شهر، أقل من تكلفة واحد منهم</span>
              <strong className="mt-2 block text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">
                <span className="chip">{sar(PLAN)} ريال</span>
              </strong>
            </>
          }
        />

        {/* الخط والمقبض، وفوقه تكلفتك الشهرية */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-[2.375rem] z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap sm:top-[3.125rem] lg:top-[3.625rem] rounded-full bg-white px-3.5 py-1.5 text-[0.875rem] font-bold text-night shadow-[0_8px_24px_-8px_rgb(17_19_24/0.5)] ring-1 ring-black/10 [left:clamp(5.75rem,var(--p),calc(100%-5.75rem))]"
        >
          <span ref={cost} className="tabular-nums">{sar(TOTAL)}</span> ريال/شهر
        </span>
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-(--p) w-[3px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(17_19_24/0.15)]" />
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
          className="absolute top-[calc(5rem+(100cqw-2.5rem)*var(--fig)/2)] grid size-12 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none place-items-center rounded-full bg-white focus-visible:rounded-full! text-night shadow-[0_8px_24px_-6px_rgb(17_19_24/0.5)] ring-1 ring-black/10 sm:top-[calc(5.75rem+(100cqw-4rem)*var(--fig)/2)] lg:top-[calc(6.25rem+(100cqw-5rem)*var(--fig)/2)] [left:clamp(1.75rem,var(--p),calc(100%-1.75rem))]"
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
function Layer({ className, end = false, label, body, chips, total }: { className: string; end?: boolean; label: ReactNode; body: ReactNode; chips: ReactNode; total: ReactNode }) {
  return (
    <div className={`flex flex-col gap-6 p-5 [grid-area:1/1] sm:p-8 lg:p-10 ${className}`}>
      <div className={`flex h-9 items-center text-[1rem] font-semibold ${end ? "justify-end" : ""}`}>{label}</div>
      {body}
      {/* في الجوال عمود في جهة الطبقة، ومن 1024 صف: المجموع في جهتها والمميزات في الثانية */}
      <div className={`mt-auto flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8 ${end ? "items-end text-end" : "items-start lg:flex-row-reverse"}`}>
        <div className={`flex flex-wrap gap-2 text-[0.875rem] font-medium ${end ? "justify-end" : ""}`}>{chips}</div>
        <div>{total}</div>
      </div>
    </div>
  );
}

/*
 * الفريق في الطبقتين بنفس الشكل: صف فيه الخمسة، وتحته وش يسوي كل واحد.
 * «مع» صورة وحدة لفريقنا، و«بدون» أشخاص رماديين في نفس أماكنهم بالضبط (X)، فلما يمر الخط كل واحد ينقلب لواحد منا.
 * في اللابتوب كل واحد كلامه تحته (الهامش px-[3%] يجيب الأعمدة تحتهم)، وفي الجوال قائمة تحت الصورة.
 */
/** وسط راس كل واحد في الصورة، من عرضها (بترتيب ROLES: أولهم يمين) */
const X = [0.874, 0.686, 0.501, 0.314, 0.126];

function Team({ className, figure, children }: { className: string; figure: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className={`overflow-hidden rounded-2xl ${className}`}>{figure}</div>
      <ul className="mt-4 grid gap-2.5 text-[0.9375rem] leading-[1.5] lg:mt-3 lg:grid-cols-5 lg:gap-3 lg:px-[3%]">{children}</ul>
    </div>
  );
}

function Row({ title, sub }: { title: string; sub: ReactNode }) {
  return (
    <li className="flex items-baseline justify-between gap-3 lg:flex-col lg:items-center lg:gap-0.5 lg:text-center">
      <span className="font-semibold">{title}</span>
      {sub}
    </li>
  );
}

/** خمسة أشخاص رماديين بمقاس صورة فريقنا، كل واحد مكان اللي يقابله فيها */
function Freelancers() {
  return (
    <svg viewBox={`0 0 ${ART.w} ${ART.h}`} aria-hidden className="block h-auto w-full" fill="#dcdfe5">
      {X.map((x) => {
        const cx = x * ART.w;
        return (
          <g key={x}>
            <circle cx={cx} cy={165} r={80} />
            <path d={`M${cx - 165} ${ART.h}V400C${cx - 165} 330 ${cx - 115} 285 ${cx - 45} 285H${cx + 45}C${cx + 115} 285 ${cx + 165} 330 ${cx + 165} 400V${ART.h}Z`} />
          </g>
        );
      })}
    </svg>
  );
}
