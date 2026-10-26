import { useEffect, useState } from "react";
import { gsap, reduced } from "../../lib/gsap";
import { useStory } from "../../lib/story";
import { Facebook, Google, Instagram, Meta, Snapchat, TikTok, type Logo } from "../logos";

/*
 * رسمات «كيف نشتغل»: عنصر واحد كبير في كل رسمة، وكلمتين بالكثير. كل رسمة مرسومة على آخر قصتها،
 * والقصة تشتغل لما توصل خطوتها (play). المقاسات بوحدة cqw من عرض المسرح، فتمشي في الجوال واللابتوب.
 */
export type VisualProps = { play: number };

const VIOLET = "#8b6cff";
const PINK = "#e85aa6";
const GREEN = "#22c55e";

const tile = "grid place-items-center rounded-[22%] bg-white";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

/* ─── 1. رابط متجرك ينكتب، ونحلّل: منتجات، عملاء، أسعار ─── */

const URL = "matjarak.com";
const ICONS = [
  // منتجات
  <path key="p" d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5zM4 8.5l8 4.5 8-4.5M12 13v7" />,
  // عملاء
  <path key="c" d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.5M17.5 14a5 5 0 0 1 3 5" />,
  // أسعار
  <path key="t" d="M3.5 12.5V5a1.5 1.5 0 0 1 1.5-1.5h7.5l8 8-9 9zM8 8h.01" />,
];

export function LinkVisual({ play }: VisualProps) {
  const ref = useStory(play, (q) => {
    const typed = q("[data-url]")[0];
    const n = { i: 0 };
    return gsap.timeline()
      .fromTo(n, { i: 0 }, { i: URL.length, duration: 0.9, ease: "none", onUpdate: () => { typed.textContent = URL.slice(0, Math.round(n.i)); } }, 0.15)
      .fromTo(q("[data-scan]"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 1.1)
      .fromTo(q("[data-done]"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.18, ease: "back.out(2.4)" }, 1.75)
      .fromTo(q("[data-icon]"), { color: "rgb(255 255 255 / 0.35)", borderColor: "rgb(255 255 255 / 0.08)" }, { color: "#fff", borderColor: VIOLET, duration: 0.3, stagger: 0.18 }, 1.75);
  });

  return (
    <div ref={ref} aria-hidden className="flex w-[78%] flex-col items-center gap-[7cqw]">
      <div className="relative w-full overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-white/10">
        <div className="flex h-[13cqw] items-center gap-[3cqw] px-[5cqw]">
          <svg viewBox="0 0 24 24" className="size-[5cqw] shrink-0 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
          </svg>
          <span dir="ltr" className="flex-1 text-left text-[4.6cqw] font-medium"><span data-url>{URL}</span></span>
        </div>
        <span data-scan className="absolute inset-x-0 bottom-0 h-[3px] origin-right" style={{ background: "linear-gradient(90deg,#7c5cff,#d946ef,#ffa94d)" }} />
      </div>
      <div className="flex gap-[5cqw]">
        {ICONS.map((d, i) => (
          <span key={i} className="relative">
            <span data-icon className="grid size-[17cqw] place-items-center rounded-[28%] border-2 bg-white/[0.04] text-white" style={{ borderColor: VIOLET }}>
              <svg viewBox="0 0 24 24" className="size-[44%]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
            </span>
            <span data-done className="absolute -left-[1.5cqw] -top-[1.5cqw] grid size-[6cqw] place-items-center rounded-full text-white" style={{ background: VIOLET }}>
              <Check className="size-[60%]" />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── 2. وش نمسك لك: إعلانات، أو نشر، أو الاثنين. الزائر يقدر يضغط بنفسه ─── */

const MODES = ["إعلانات", "نشر", "الاثنين"];
const ADS: Logo[] = [Snapchat, TikTok, Meta, Google];
const POSTS: Logo[] = [Instagram, TikTok, Facebook];

export function ChooseVisual({ play }: VisualProps) {
  const [mode, setMode] = useState(2);

  // القصة: تمرّ على الاختيارات الثلاثة وتوقف على «الاثنين»
  useEffect(() => {
    if (!play || reduced()) return;
    setMode(0);
    const ts = [window.setTimeout(() => setMode(1), 1100), window.setTimeout(() => setMode(2), 2200)];
    return () => ts.forEach(clearTimeout);
  }, [play]);

  const on = (row: 0 | 1) => mode === 2 || mode === row;
  const row = (logos: Logo[], lit: boolean) => (
    <div className={`flex justify-center gap-[3.5cqw] transition-all duration-500 ${lit ? "opacity-100" : "scale-95 opacity-20 grayscale"}`}>
      {logos.map((L, i) => <span key={i} className={`${tile} size-[13cqw]`}><L className="size-[55%]" /></span>)}
    </div>
  );

  return (
    <div className="flex w-[84%] flex-col items-center gap-[7cqw]">
      <div role="radiogroup" aria-label="وش نمسك لك" className="relative grid w-full grid-cols-3 rounded-full bg-white/[0.06] p-[1.2cqw] ring-1 ring-white/10">
        {/* المؤشر الأبيض يتحرك تحت الاختيار */}
        <span
          aria-hidden
          className="absolute inset-y-[1.2cqw] w-[calc((100%-2.4cqw)/3)] rounded-full bg-white transition-[right] duration-500 ease-lift"
          style={{ right: `calc(1.2cqw + ${mode} * (100% - 2.4cqw) / 3)` }}
        />
        {MODES.map((m, i) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === i}
            onClick={() => setMode(i)}
            className={`relative h-[11cqw] rounded-full text-[4.2cqw] font-semibold transition-colors duration-300 ${mode === i ? "text-night" : "text-white/70 hover:text-white"}`}
          >
            {m}
          </button>
        ))}
      </div>
      <div aria-hidden className="grid gap-[4cqw]">
        {row(ADS, on(0))}
        {row(POSTS, on(1))}
      </div>
    </div>
  );
}

/* ─── 3. إعلانين يتنافسون، والميزانية تروح للي يبيع ─── */

export function TestVisual({ play }: VisualProps) {
  const ref = useStory(play, (q) =>
    gsap.timeline()
      .fromTo(q("[data-fill]"), { scaleX: 0 }, { scaleX: 0.45, duration: 0.8, ease: "power2.out" }, 0.2)
      .to(q('[data-fill="b"]'), { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, 1.1)
      .fromTo(q('[data-ad="b"]'), { scale: 1 }, { scale: 1.06, duration: 0.5, ease: "back.out(2)" }, 1.6)
      .fromTo(q('[data-ad="a"]'), { opacity: 1 }, { opacity: 0.35, duration: 0.5 }, 1.6)
      .fromTo(q("[data-win]"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)" }, 1.9)
  );

  const ad = (id: "a" | "b", from: string, to: string) => (
    <div data-ad={id} className={`relative flex w-[34cqw] flex-col gap-[3cqw] ${id === "a" ? "opacity-35" : "scale-[1.06]"}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[18%] ring-1 ring-white/10" style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}>
        {/* منتج بسيط في نص الإعلان */}
        <span className="absolute left-1/2 top-[30%] h-[9%] w-[16%] -translate-x-1/2 rounded-t-md bg-white/70" />
        <span className="absolute left-1/2 top-[39%] h-[30%] w-[38%] -translate-x-1/2 rounded-[22%] bg-white/85" />
      </div>
      <div className="relative h-[3.5cqw] overflow-hidden rounded-full bg-white/10">
        <span data-fill={id} className="absolute inset-0 origin-right rounded-full" style={{ background: id === "b" ? GREEN : "rgb(255 255 255 / 0.4)", transform: `scaleX(${id === "b" ? 1 : 0.45})` }} />
      </div>
      {id === "b" && (
        <span data-win className="absolute -right-[3cqw] -top-[3cqw] grid size-[10cqw] place-items-center rounded-full text-white shadow-[0_6px_20px_-6px_rgb(34_197_94/0.8)]" style={{ background: GREEN }}>
          <svg viewBox="0 0 24 24" className="size-[55%]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16l5-5 4 4 7-7M14 8h6v6" />
          </svg>
        </span>
      )}
    </div>
  );

  return (
    <div ref={ref} aria-hidden className="flex items-center justify-center gap-[7cqw]">
      {ad("a", "#3b4256", "#232733")}
      {ad("b", "#f9a8d4", "#8b6cff")}
    </div>
  );
}

/* ─── 4. طلب من سناب يعلّم باقي المنصات ─── */

const LEARNERS: { L: Logo; y: number }[] = [
  { L: Meta, y: 18 },
  { L: TikTok, y: 50 },
  { L: Google, y: 82 },
];

export function LearnVisual({ play }: VisualProps) {
  const ref = useStory(play, (q) => {
    const tl = gsap.timeline()
      .fromTo(q("[data-order]"), { opacity: 0, y: 6, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0.2)
      .fromTo(q("[data-source]"), { scale: 1 }, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }, 0.25);
    q("[data-wire]").forEach((wire, i) => {
      const path = wire as unknown as SVGPathElement, len = path.getTotalLength();
      const dot = q(`[data-dot="${i}"]`)[0], s = { t: 0 };
      tl.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0.8 + i * 0.12)
        .fromTo(s, { t: 0 }, { t: 1, duration: 0.7, ease: "power2.inOut", onUpdate: () => { const p = path.getPointAtLength(len * s.t); dot.setAttribute("cx", `${p.x}`); dot.setAttribute("cy", `${p.y}`); } }, 0.8 + i * 0.12)
        .fromTo(dot, { opacity: 1 }, { opacity: 0, duration: 0.2 }, 1.45 + i * 0.12)
        .fromTo(q(`[data-node="${i}"]`), { borderColor: "rgb(255 255 255 / 0)", scale: 1 }, { borderColor: VIOLET, scale: 1.08, duration: 0.3, ease: "back.out(2.5)" }, 1.45 + i * 0.12);
    });
    return tl;
  });

  return (
    <div ref={ref} aria-hidden className="relative aspect-square w-[86%]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" fill="none">
        {LEARNERS.map(({ y }, i) => (
          <path key={i} data-wire d={`M70 50C50 50 46 ${y} 24 ${y}`} stroke={VIOLET} strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
        ))}
        {LEARNERS.map((_, i) => <circle key={i} data-dot={i} r="1.6" fill="#fff" opacity="0" />)}
      </svg>
      {/* المصدر: سناب، وجاه طلب */}
      <div className="absolute left-[78%] top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span data-order className="absolute bottom-[115%] left-1/2 flex -translate-x-1/2 items-center gap-[1.5cqw] whitespace-nowrap rounded-full bg-white px-[3cqw] py-[1.4cqw] text-[3.6cqw] font-semibold text-night">
          <span className="size-[2cqw] rounded-full" style={{ background: GREEN }} />
          طلب جديد
        </span>
        <span data-source className="block size-[19cqw] rounded-[24%] shadow-[0_0_0_6px_rgb(255_252_0/0.14)]"><Snapchat className="size-full rounded-[24%]" /></span>
      </div>
      {/* المنصات اللي تتعلّم */}
      {LEARNERS.map(({ L, y }, i) => (
        <span key={i} data-node={i} className={`${tile} absolute size-[14cqw] border-[3px]`} style={{ left: "18%", top: `${y}%`, borderColor: VIOLET, transform: "translate(-50%,-50%) scale(1.08)" }}>
          <L className="size-[55%]" />
        </span>
      ))}
    </div>
  );
}

/* ─── 5. منشورات بهويتك تنزل بانتظام، والطلب يجي بدون إعلان ─── */

const POSTS_GRID = [
  "linear-gradient(160deg,#ffd3e8,#e85aa6)",
  "linear-gradient(160deg,#2a2e3a,#1b1e25)",
  "linear-gradient(160deg,#ffe0bf,#ffa94d)",
  "linear-gradient(160deg,#2a2e3a,#1b1e25)",
  "linear-gradient(160deg,#e3dcff,#8b6cff)",
  "linear-gradient(160deg,#2a2e3a,#1b1e25)",
  "linear-gradient(160deg,#ffa94d,#e85aa6)",
  "linear-gradient(160deg,#2a2e3a,#1b1e25)",
  "linear-gradient(160deg,#ffd3e8,#8b6cff)",
];

export function GrowVisual({ play }: VisualProps) {
  const ref = useStory(play, (q) =>
    gsap.timeline()
      .fromTo(q("[data-post]"), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.12, ease: "back.out(1.8)" }, 0.15)
      .fromTo(q("[data-sale]"), { opacity: 0, y: 10, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2)" }, 1.5)
  );

  return (
    <div ref={ref} aria-hidden className="relative w-[64%]">
      <div className="grid grid-cols-3 gap-[2.2cqw]">
        {POSTS_GRID.map((bg, i) => (
          <span key={i} data-post className="relative aspect-square rounded-[16%]" style={{ background: bg }}>
            {i % 3 === 0 && (
              <span className="absolute left-1/2 top-1/2 ml-[0.4cqw] -translate-x-1/2 -translate-y-1/2 border-y-[1.6cqw] border-l-[2.4cqw] border-y-transparent border-l-white/90" />
            )}
          </span>
        ))}
      </div>
      <span data-sale className="absolute -bottom-[5cqw] left-1/2 flex -translate-x-1/2 items-center gap-[2cqw] whitespace-nowrap rounded-full bg-white px-[4cqw] py-[2cqw] text-[3.8cqw] font-semibold text-night shadow-[0_14px_34px_-12px_rgb(0_0_0/0.8)]">
        <svg viewBox="0 0 24 24" className="size-[4.4cqw]" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8h12l-1 12H7zM9 8a3 3 0 0 1 6 0" />
        </svg>
        طلب من منشور
      </span>
    </div>
  );
}
