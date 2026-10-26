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
      tl.fromTo(q(`[data-bar="${i}"]`), { height: `${(25 / TOP) * 100}%` }, { height: `${(to / TOP) * 100}%` }, 0.35);
    });
    return tl
      .fromTo(q('[data-bar="0"]'), { backgroundColor: IDLE }, { backgroundColor: VIOLET, duration: 0.45 }, 0.95)
      .fromTo(q("[data-share]"), { innerText: 25 }, { innerText: TOP, snap: { innerText: 1 } }, 0.35);
  });

  return (
    <div ref={ref} aria-hidden className={`${panel} w-[78%] px-4 pb-3.5 pt-3.5`}>
      <p className="text-[0.6875rem] text-white/55">ميزانيتك رايحة لـ</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-[1.125rem] font-bold leading-none">
        <Snapchat className="size-5 rounded-[5px]" />
        سناب <span className="tabular-nums"><span data-share>{TOP}</span>٪</span>
      </p>
      <ul className="mt-3 grid grid-cols-4 items-end gap-2.5">
        {SPLIT.map(({ L, to }, i) => (
          <li key={i} className="flex flex-col items-center gap-1.5">
            <span className="flex h-11 w-full items-end">
              <span data-bar={i} className="w-full rounded-md" style={{ height: `${(to / TOP) * 100}%`, background: i === 0 ? VIOLET : IDLE }} />
            </span>
            <span className="grid size-6 place-items-center rounded-md bg-white"><L className="size-4" /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── المحتوى: رينق لايت فيه جوال على حامل يسار، والشخصية يمين تعرض المنتج قدّامه ─── */

export function StudioScene({ play }: SceneProps) {
  const ref = useStory(play, (q) =>
    gsap.timeline()
      // يولّع ويطفي برمشة مثل الحقيقي، وبعدها يثبت
      .fromTo(q("[data-ring]"), { opacity: 0.15 }, { keyframes: [{ opacity: 0.8, duration: 0.07 }, { opacity: 0.2, duration: 0.12 }, { opacity: 0.9, duration: 0.07 }, { opacity: 0.35, duration: 0.1 }, { opacity: 1, duration: 0.4 }] }, 0.25)
      .fromTo(q("[data-beam]"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.75)
      .fromTo(q("[data-rec]"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.05)
  );

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      {/* الضوء من الرينق للشخصية */}
      <div data-beam className="absolute inset-0 bg-[radial-gradient(52%_26%_at_40%_63%,rgb(255_240_220/0.12),transparent)]" />
      {/* الحامل: عمود ورجول */}
      <div className="absolute bottom-0 left-[22%] top-[62%] w-[3px] -translate-x-1/2 rounded-full bg-[#3a3f4b]" />
      <svg viewBox="0 0 60 20" className="absolute bottom-0 left-[22%] w-[24%] -translate-x-1/2" fill="none" stroke="#3a3f4b" strokeWidth="3" strokeLinecap="round">
        <path d="M30 2 8 20M30 2l22 18M30 2v18" />
      </svg>
      {/* الرينق مايل شوي ناحية الشخصية، وفي نصّه الجوال اللي يصوّر */}
      <div className="absolute left-[22%] top-[62%] aspect-square w-[30%] [transform:translate(-50%,-50%)_perspective(400px)_rotateY(-28deg)]">
        <div data-ring className="absolute inset-0 rounded-full border-[0.45rem] border-[#fff5e8] shadow-[0_0_22px_3px_rgb(255_236_210/0.5),inset_0_0_12px_rgb(255_236_210/0.4)]" />
        <div className="absolute left-1/2 top-1/2 h-[46%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-[5px] bg-[#0b0c10] ring-1 ring-white/25">
          <span data-rec className="absolute right-1 top-1 size-1.5 animate-pulse rounded-full bg-[#ef4444]" />
        </div>
      </div>
    </div>
  );
}

/* ─── السيو: خانة بحث وتحتها موقعك، والشخصية تكبّر «متجرك» بالعدسة ─── */

const QUERY = "عباية سوداء";
const WORD = "متجرك";

/*
 * العدسة في صورة الشخصية (seo.webp، 760×716): نصّها عند 80.66٪ من العرض و27.93٪ من الطول،
 * ونصف قطرها من داخل 12.37٪ من العرض، ووسطها شفاف. نرسم الكلمة ورا الصورة، ونسخة مكبّرة منها
 * داخل دائرة بحجم العدسة بالضبط، فتبان العدسة تكبّر الحرف اللي وراها (الكاف).
 * الصندوق بنفس مقاس الصورة ومكانها في الكرت، فكل شي يمشي معها في أي عرض.
 */
const LENS = { x: "80.66%", y: "27.93%", r: "12.37%" };

export function SearchScene({ play }: SceneProps) {
  const ref = useStory(play, (q) => {
    const typed = q("[data-query]")[0];
    const n = { i: 0 };
    return gsap.timeline()
      .fromTo(n, { i: 0 }, { i: QUERY.length, duration: 0.8, ease: "none", onUpdate: () => { typed.textContent = QUERY.slice(0, Math.round(n.i)); } }, 0.2)
      .fromTo(q("[data-site]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 1.05)
      .fromTo(q("[data-word]"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.3)
      // العدسة تكبّر الحرف
      .fromTo(q("[data-zoom]"), { scale: 1 }, { scale: 1.7, duration: 0.7, ease: "back.out(1.7)" }, 1.6);
  });

  const word = "absolute left-[-0.27em] top-[-0.66em] whitespace-nowrap font-black leading-[1.2]";
  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      <div className={`${panel} absolute inset-x-0 top-[21%] w-[86%] p-2.5`}>
        <div className="flex h-7 items-center gap-2 rounded-full bg-white/[0.07] px-3">
          <Google className="size-4 shrink-0" />
          <span className="text-[0.75rem]">
            <span data-query>{QUERY}</span>
            <span className="ms-px inline-block h-3 w-px animate-pulse bg-white/70 align-middle" />
          </span>
        </div>
        {/* موقعك: شريط المتصفح ومنتج */}
        <div data-site className="mt-2 overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/10">
          <div className="flex items-center gap-1 border-b border-white/[0.06] px-2.5 py-1.5">
            {[0, 1, 2].map((d) => <span key={d} className="size-1.5 rounded-full bg-white/20" />)}
            <span className="ms-2 h-1.5 w-1/3 rounded-full bg-white/10" />
          </div>
          <div className="flex items-center gap-2.5 p-2.5">
            <span className="size-9 shrink-0 rounded-lg bg-[linear-gradient(135deg,#ffa94d,#ff6b6b)]" />
            <span className="grid flex-1 gap-1.5">
              <span className="h-1.5 w-3/4 rounded-full bg-white/25" />
              <span className="text-[0.625rem] leading-none text-[#fbbf24]">★★★★★</span>
            </span>
          </div>
        </div>
      </div>

      {/* نفس صندوق صورة الشخصية. الخط بوحدة cqw (من عرض الكرت) فيكبر ويصغر معها */}
      <div className="absolute bottom-0 left-1/2 aspect-[760/716] w-[58%] -translate-x-1/2">
        {/* الكلمة العادية، والكاف عند نص العدسة */}
        <span className="absolute text-[10.5cqw]" style={{ left: LENS.x, top: LENS.y }}>
          <span data-word className={`${word} text-white`}>{WORD}</span>
        </span>
        {/* داخل العدسة: لون زجاج يغطي الكلمة العادية، وفوقه الكلمة مكبّرة حول نص العدسة */}
        <span
          className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#1b1f28]"
          style={{ left: LENS.x, top: LENS.y, width: `calc(${LENS.r} * 2)` }}
        >
          <span className="absolute left-1/2 top-1/2 text-[10.5cqw]">
            <span data-zoom className="absolute left-0 top-0 block origin-top-left" style={{ transform: "scale(1.7)" }}>
              <span className={`${word} text-white`}>{WORD}</span>
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
      .fromTo(q("[data-msg]"), { opacity: 0, y: 10, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.9, ease: "back.out(1.6)" }, 0.25)
  );

  const bubble = "rounded-2xl px-3 shadow-[0_10px_28px_-10px_rgb(0_0_0/0.8)]";
  return (
    <div ref={ref} aria-hidden className="mx-auto grid w-[84%] gap-1.5 text-white">
      <div data-msg className={`${bubble} me-5 rounded-ss-md bg-[#202c33] py-2`}>
        <p className="text-[0.6875rem] font-semibold text-[#53bdeb]">مسوّقك الذكي</p>
        <p className="mt-0.5 text-[0.8125rem] font-semibold">تقرير الأسبوع</p>
        <p className="flex items-end justify-between gap-2 text-[0.75rem] text-white/80">
          الطلبات 42 · المبيعات +18٪
          <span className="shrink-0 text-[0.5625rem] text-white/45">9:00 ص</span>
        </p>
      </div>
      <div data-msg className={`${bubble} ms-8 rounded-se-md bg-[#005c4b] py-1.5`}>
        <p className="flex items-end justify-between gap-2 text-[0.75rem]">
          تمام، زيدوا ميزانية سناب
          <span className="shrink-0 text-[0.5625rem] text-white/55">9:04 ص</span>
        </p>
      </div>
    </div>
  );
}
