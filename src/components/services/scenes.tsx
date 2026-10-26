import { useEffect, useRef, type ReactNode } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { Facebook, Google, Instagram, Meta, Snapchat, TikTok } from "../logos";

/*
 * المشاهد في كروت الخدمات. كل مشهد واجهة من منتجنا تحكي قصة قصيرة، تشتغل لما يجي دور الكرت
 * (الكروت تمشي ورا بعض) وتعيد لما تمرّ عليه. الـ HTML مرسوم على آخر القصة، فبدون جافاسكربت
 * أو مع «تقليل الحركة» يبان كامل. المشاهد للزينة (aria-hidden) لأن عنوان الكرت ووصفه يشرحون الخدمة.
 *
 * كل مشهد على «توهّج» (Glow): لون الخدمة خفيف من فوق، ويختفي تدريجياً لين يدخل ورا الشخصية، بدون إطار.
 * الأشياء اللي لازم تركب على الشخصية نفسها (الرينق لايت، كلمة العدسة) مكانها absolute بالنسبة للكرت كله،
 * بنفس مقاسات صورة الشخصية (ART). الأرقام أمثلة توضيحية.
 */
export type SceneProps = { play: number; hover: boolean };

/** صورة الشخصية: عرضها من الكرت، ونسبتها (760×716). نفسها في Services.tsx */
export const ART = { width: "66%", ratio: "760/716" };

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

/** اللوحة بدون إطار: لون خفيف من فوق يختفي لتحت، وتمتد ورا الشخصية (الهامش السالب يدخلها تحت راسها) */
function Glow({ tint, children }: { tint: string; children: ReactNode }) {
  return (
    <div
      className="-mb-[30%] flex-1 rounded-t-[22px] px-4 pt-4 text-white [mask-image:linear-gradient(to_bottom,#000_55%,transparent_96%)]"
      style={{ background: `linear-gradient(180deg, ${tint}, transparent 88%)` }}
    >
      {children}
    </div>
  );
}

const tile = "grid place-items-center rounded-md bg-white";

/* ─── الإعلانات: الميزانية تبدأ متساوية، وبعد التحسين تروح للمنصة اللي تبيع ─── */

const VIOLET = "#8b6cff";
const IDLE = "rgb(255 255 255 / 0.2)";
const SPLIT = [
  { L: Snapchat, to: 42 },
  { L: TikTok, to: 28 },
  { L: Meta, to: 20 },
  { L: Google, to: 10 },
];
const TOP = 42;

export function BudgetScene({ play }: SceneProps) {
  const ref = useStory(play, (q) => {
    const tl = gsap.timeline({ defaults: { duration: 1.1, ease: "power3.inOut" } });
    SPLIT.forEach(({ to }, i) => {
      tl.fromTo(q(`[data-bar="${i}"]`), { height: `${(25 / TOP) * 100}%` }, { height: `${(to / TOP) * 100}%` }, 0.2);
    });
    return tl
      .fromTo(q('[data-bar="0"]'), { backgroundColor: IDLE }, { backgroundColor: VIOLET, duration: 0.45 }, 0.8)
      .fromTo(q("[data-share]"), { innerText: 25 }, { innerText: TOP, snap: { innerText: 1 } }, 0.2);
  });

  return (
    <div ref={ref} aria-hidden className="contents">
      <Glow tint="rgb(124 92 255 / 0.3)">
        <p className="text-[0.6875rem] text-white/60">ميزانيتك رايحة لـ</p>
        <p className="mt-1 flex items-center gap-1.5 text-[1.25rem] font-bold leading-none">
          <Snapchat className="size-5 rounded-[5px]" />
          سناب <span className="tabular-nums"><span data-share>{TOP}</span>٪</span>
        </p>
        <ul className="mt-3.5 grid grid-cols-4 items-end gap-3">
          {SPLIT.map(({ L, to }, i) => (
            <li key={i} className="flex flex-col items-center gap-1.5">
              <span className="flex h-10 w-full items-end">
                <span data-bar={i} className="w-full rounded-md" style={{ height: `${(to / TOP) * 100}%`, background: i === 0 ? VIOLET : IDLE }} />
              </span>
              <span className={`${tile} size-5`}><L className="size-3.5" /></span>
            </li>
          ))}
        </ul>
      </Glow>
    </div>
  );
}

/* ─── المحتوى: الرينق لايت قدّام الشخصية يولّع ويصوّر، والمنشور ينجدول، والتفاعل يطير مثل اللايف ─── */

/* أيقونات التفاعل (مثل لايف فيسبوك): لايك أزرق وقلب أحمر وقلب وردي */
const REACTIONS = [
  `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="#1877f2"/><path fill="#fff" d="M7 10.5h2.2v7H7zM10.2 17.5v-6.4l2.6-4.3c.3-.5 1.1-.3 1.1.3v3h3.3c.8 0 1.4.8 1.2 1.6l-1.1 4.6c-.2.7-.8 1.2-1.5 1.2z"/></svg>`,
  `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="#f33e58"/><path fill="#fff" d="M12 18s-5.5-3.3-5.5-7.2A3 3 0 0 1 12 9a3 3 0 0 1 5.5 1.8C17.5 14.7 12 18 12 18z"/></svg>`,
  `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="#e85aa6"/><path fill="#fff" d="M12 18s-5.5-3.3-5.5-7.2A3 3 0 0 1 12 9a3 3 0 0 1 5.5 1.8C17.5 14.7 12 18 12 18z"/></svg>`,
];

/** تفاعل واحد يطلع من تحت يمين الكرت، يتمايل وهو طالع، ويختفي */
function float(layer: HTMLElement) {
  const el = document.createElement("span");
  el.className = "absolute size-7";
  el.innerHTML = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
  layer.append(el);
  const w = layer.clientWidth, h = layer.clientHeight;
  const x = w * gsap.utils.random(0.72, 0.9);
  gsap.set(el, { left: x, top: h * 0.86, scale: 0.4, opacity: 0, xPercent: -50 });
  gsap.timeline({ onComplete: () => el.remove() })
    .to(el, { opacity: 1, scale: gsap.utils.random(0.8, 1.05), duration: 0.25, ease: "back.out(2)" })
    .to(el, { y: -h * gsap.utils.random(0.42, 0.58), duration: gsap.utils.random(1.7, 2.3), ease: "power1.out" }, 0)
    .to(el, { x: gsap.utils.random(-16, 16), duration: 0.55, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0)
    .to(el, { opacity: 0, duration: 0.5 }, "-=0.6");
}

export function StudioScene({ play, hover }: SceneProps) {
  const ref = useStory(play, (q) =>
    gsap.timeline()
      // يولّع ويطفي برمشة مثل الحقيقي، وبعدها يثبت
      .fromTo(q("[data-ring]"), { opacity: 0.15 }, { keyframes: [{ opacity: 0.8, duration: 0.07 }, { opacity: 0.2, duration: 0.12 }, { opacity: 0.9, duration: 0.07 }, { opacity: 0.35, duration: 0.1 }, { opacity: 1, duration: 0.4 }] }, 0.15)
      .fromTo(q("[data-beam]"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.65)
      .fromTo(q("[data-rec]"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.9)
      // خلص التصوير: المنشور جاهز ومجدول
      .fromTo(q("[data-post]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" }, 1.4)
  );
  const layer = useRef<HTMLDivElement>(null);

  // التفاعل يطير طول ما المؤشر على الكرت
  useEffect(() => {
    if (!hover || reduced()) return;
    const t = window.setInterval(() => float(layer.current!), 260);
    float(layer.current!);
    return () => clearInterval(t);
  }, [hover]);

  // وفي الجوال (ما فيه تحويم): دفعة صغيرة بعد ما يخلص التصوير
  useEffect(() => {
    if (play !== 1 || reduced()) return;
    const ts = [0, 1, 2, 3, 4].map((i) => window.setTimeout(() => float(layer.current!), 1900 + i * 230));
    return () => ts.forEach(clearTimeout);
  }, [play]);

  return (
    <div ref={ref} aria-hidden className="contents">
      <Glow tint="rgb(232 90 166 / 0.26)">
        {/* المنشور الجاهز: وين ينزل، ومتى */}
        <div data-post className="flex items-center justify-between gap-2">
          <span className="flex gap-1">
            {[Instagram, TikTok, Facebook].map((L, i) => <span key={i} className={`${tile} size-6`}><L className="size-4" /></span>)}
          </span>
          <span className="flex items-center gap-1 text-[0.6875rem] font-semibold">
            <svg viewBox="0 0 16 16" className="size-3 text-[#f9a8d4]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <rect x="2" y="3" width="12" height="11" rx="2.5" />
              <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
            </svg>
            مجدول · الخميس 8 م
          </span>
        </div>
      </Glow>

      {/* الضوء من الرينق لوجه الشخصية */}
      <div data-beam className="pointer-events-none absolute inset-0 bg-[radial-gradient(48%_22%_at_34%_69%,rgb(255_240_220/0.13),transparent)]" />
      {/* الحامل: عمود من نص الرينق للأرض، ورجول */}
      <div className="absolute bottom-0 left-[17%] top-[69%] w-[3px] -translate-x-1/2 rounded-full bg-[#3a3f4b]" />
      <svg viewBox="0 0 60 20" className="absolute bottom-0 left-[17%] w-[22%] -translate-x-1/2" fill="none" stroke="#3a3f4b" strokeWidth="3" strokeLinecap="round">
        <path d="M30 2 8 20M30 2l22 18M30 2v18" />
      </svg>
      {/* الرينق عند مستوى وجه الشخصية، ومايل ناحيتها كأنه يصوّرها، وفي نصّه الجوال */}
      <div className="absolute left-[17%] top-[69%] aspect-square w-[28%] [transform:translate(-50%,-50%)_perspective(420px)_rotateY(42deg)]">
        <div data-ring className="absolute inset-0 rounded-full border-[0.42rem] border-[#fff5e8] shadow-[0_0_22px_3px_rgb(255_236_210/0.5),inset_0_0_12px_rgb(255_236_210/0.4)]" />
        <div className="absolute left-1/2 top-1/2 h-[46%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-[5px] bg-[#0b0c10] ring-1 ring-white/25">
          <span data-rec className="absolute left-1 top-1 size-1.5 animate-pulse rounded-full bg-[#ef4444]" />
        </div>
      </div>
      {/* طبقة التفاعل: فوق الشخصية (z-20) */}
      <div ref={layer} className="pointer-events-none absolute inset-0 z-20 overflow-hidden" />
    </div>
  );
}

/* ─── السيو: نكتب البحث، متجرك يطلع الأول، والشخصية تكبّر «متجرك» بالعدسة ─── */

const QUERY = "عباية سوداء";
// «ر» ما تتصل باللي بعدها، فنقسم الكلمة بدون ما يتغيّر شكلها: «متجر» برّا العدسة، و«ك» مكبّرة داخلها
const WORD = { out: "متجر", in: "ك" };

/*
 * العدسة في صورة الشخصية (seo.webp): نصّها عند 80.66٪ من العرض و27.93٪ من الطول، ونصف قطرها من داخل
 * 12.37٪ من العرض، ووسطها شفاف. نرسم الكلمة ورا الصورة، ونسخة مكبّرة منها داخل دائرة بحجم العدسة بالضبط،
 * فتبان العدسة تكبّر آخر حرف في الكلمة اللي وراها (الكاف). الصندوق بنفس مقاس الصورة ومكانها، والخط بوحدة cqw
 * (من عرض الكرت)، فكل شي يمشي معها في أي عرض.
 */
const LENS = { x: "80.66%", y: "27.93%", r: "12.37%" };
/** مكان شخصية السيو بالعرض: يسار النص شوي، عشان الكلمة اللي جنب العدسة تبقى داخل هامش الكرت. نفسها في Services.tsx */
export const SEO_AT = "44%";

export function SearchScene({ play }: SceneProps) {
  const ref = useStory(play, (q) => {
    const typed = q("[data-query]")[0];
    const n = { i: 0 };
    return gsap.timeline()
      .fromTo(n, { i: 0 }, { i: QUERY.length, duration: 0.8, ease: "none", onUpdate: () => { typed.textContent = QUERY.slice(0, Math.round(n.i)); } }, 0.15)
      .fromTo(q("[data-result]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 1)
      .fromTo(q("[data-star]"), { opacity: 0.2 }, { opacity: 1, duration: 0.12, stagger: 0.06 }, 1.25)
      .fromTo(q("[data-word]"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5)
      // العدسة تكبّر الحرف
      .fromTo(q("[data-zoom]"), { scale: 1 }, { scale: 1.6, duration: 0.7, ease: "back.out(1.7)" }, 1.75);
  });

  // بخط 8cqw نصف قطر العدسة من برّا (مع الإطار البرتقالي) تقريباً 1.27em، فـ«متجر» تبدأ بعده بشوي
  const word = "absolute top-[-0.66em] whitespace-nowrap font-black leading-[1.2] text-white";
  return (
    <div ref={ref} aria-hidden className="contents">
      <Glow tint="rgb(255 169 77 / 0.24)">
        <div className="flex h-7 items-center gap-2 rounded-full bg-white/10 px-3">
          <Google className="size-4 shrink-0" />
          <span className="text-[0.75rem]">
            <span data-query>{QUERY}</span>
            <span className="ms-px inline-block h-3 w-px animate-pulse bg-white/70 align-middle" />
          </span>
        </div>
        {/* أول نتيجة: منتجك */}
        <div data-result className="mt-3 flex items-center gap-2.5 px-1">
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#ffa94d] text-[0.6875rem] font-bold text-[#3b2200]">1</span>
          <span className="min-w-0">
            <span className="block truncate text-[0.75rem] font-semibold">عباية سوداء كلوش</span>
            <span className="flex items-center gap-1 text-[0.625rem] text-white/60">
              <span className="flex text-[#fbbf24]">{[0, 1, 2, 3, 4].map((s) => <span key={s} data-star>★</span>)}</span>
              189 ر.س
            </span>
          </span>
        </div>
      </Glow>

      {/* نفس صندوق صورة الشخصية */}
      <div className="absolute bottom-0 -translate-x-1/2" style={{ left: SEO_AT, width: ART.width, aspectRatio: ART.ratio }}>
        {/* «متجر» جنب العدسة */}
        <span className="absolute text-[8cqw]" style={{ left: LENS.x, top: LENS.y }}>
          <span data-word className={`${word} left-[1.32em]`}>{WORD.out}</span>
        </span>
        {/* داخل العدسة: لون زجاج، وفي نصّه «ك» مكبّرة */}
        <span
          className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#1b1f28]"
          style={{ left: LENS.x, top: LENS.y, width: `calc(${LENS.r} * 2)` }}
        >
          <span className="absolute left-1/2 top-1/2 text-[8cqw]">
            <span data-zoom className="absolute left-0 top-0 block origin-top-left" style={{ transform: "scale(1.6)" }}>
              <span className={`${word} left-0 -translate-x-1/2`}>{WORD.in}</span>
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}

/* ─── التقارير: رسالة التقرير من المستشار، وردّك عليه ─── */

export function ChatScene({ play }: SceneProps) {
  const ref = useStory(play, (q) =>
    gsap.timeline()
      .fromTo(q("[data-msg]"), { opacity: 0, y: 10, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.9, ease: "back.out(1.6)" }, 0.15)
  );

  const bubble = "rounded-2xl px-3";
  return (
    <div ref={ref} aria-hidden className="contents">
      <Glow tint="rgb(59 143 230 / 0.26)">
        <div className="grid gap-1.5">
          <div data-msg className={`${bubble} rounded-ss-md bg-[#202c33] py-2`}>
            <p className="text-[0.6875rem] font-semibold text-[#53bdeb]">مسوّقك الذكي</p>
            <p className="mt-0.5 text-[0.8125rem] font-semibold">تقرير الأسبوع</p>
            <p className="flex items-end justify-between gap-2 whitespace-nowrap text-[0.75rem] text-white/80">
              الطلبات 42 · المبيعات +18٪
              <span className="shrink-0 text-[0.5625rem] text-white/45">9:00 ص</span>
            </p>
          </div>
          <div data-msg className={`${bubble} ms-7 rounded-se-md bg-[#005c4b] py-1.5`}>
            <p className="flex items-end justify-between gap-2 text-[0.75rem]">
              تمام، زيدوا ميزانية سناب
              <span className="shrink-0 text-[0.5625rem] text-white/55">9:04 ص</span>
            </p>
          </div>
        </div>
      </Glow>
    </div>
  );
}
