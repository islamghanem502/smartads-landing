"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { HairlineFigure } from "@/lib/hairline/Figure";
import { CARDS, type CardDef } from "./cards";

gsap.registerPlugin(useGSAP);

type Pt = { x: number; y: number };
type Link = { to: string; from: string; end: string };

const STORE = "store";
const SWING = { type: "spring", stiffness: 140, damping: 11, mass: 0.9 } as const;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* في الشاشة العريضة: الإيصال مثبّت من زواياه الأربع، ومن كل زاوية خيط لورقة.
   في الجوال: الأوراق تحت بعض، والخيط ينزل من تحت كل ورقة لدبوس اللي بعدها. */
const WIDE: Link[] = [
  { to: "events", from: "store-tl", end: "events" },
  { to: "ads", from: "store-tr", end: "ads" },
  { to: "budget", from: "store-bl", end: "budget" },
  { to: "posts", from: "store-br", end: "posts" },
];
const ORDER = [STORE, ...CARDS.map((c) => c.id)];
const NARROW: Link[] = ORDER.slice(1).map((id, i) => ({ to: id, from: `${ORDER[i]}-b`, end: id }));

/** خيط مرخي بين دبوسين: ينزل في النص على قد طوله. */
const sagPath = (a: Pt, b: Pt) => {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${((a.x + b.x) / 2).toFixed(1)} ${((a.y + b.y) / 2 + d * 0.12).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

function useMedia(q: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const m = matchMedia(q);
    const f = () => setOn(m.matches);
    f();
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, [q]);
  return on;
}

const Anchor = ({ id, className }: { id: string; className: string }) => (
  <span data-anchor={id} aria-hidden className={`pointer-events-none absolute size-0 ${className}`} />
);

/** ورقة معلّقة من دبوس في نص راسها: تتمرجح حول الدبوس لما يقرب منها المؤشر. */
function FigureCard({ def, swing, play, onEnter }: { def: CardDef; swing: boolean; play: boolean; onEnter: (id: string) => void }) {
  const [near, setNear] = useState(false);
  const [line, setLine] = useState(def.rest);
  const onRead = useCallback((r: string) => setLine(r === "rest" ? def.rest : def.say(r) ?? def.rest), [def]);
  return (
    <motion.article
      className="hl-paper relative w-[17.5rem] rounded-[6px] bg-paper px-4 pb-4 pt-2 text-ink shadow-[0_1px_0_rgba(255,255,255,.6)_inset,0_22px_30px_-20px_rgba(0,0,0,.85),0_2px_4px_rgba(0,0,0,.35)]"
      style={{ transformOrigin: "50% 0%" }}
      initial={false}
      animate={{ rotate: near && swing ? 0 : def.at.rot }}
      transition={SWING}
      onPointerEnter={() => { setNear(true); onEnter(def.id); }}
      onPointerLeave={() => setNear(false)}
    >
      <Anchor id={def.id} className="left-1/2 top-[9px]" />
      <Anchor id={`${def.id}-b`} className="bottom-[9px] left-1/2" />
      {/* الرسمة أكبر من مكانها شوي، والفراغ اللي حواليها ينقص */}
      <div className="relative -mx-4 overflow-hidden" style={{ aspectRatio: "5 / 3.5" }}>
        <HairlineFigure
          engine={def.fig.mount}
          value={def.fig.range[1]}
          label={def.label}
          stops={def.fig.stops}
          play={play}
          onRead={onRead}
          // ستايل hairline بدون طبقة، فيغلب كلاسات تيلويند: المكان هنا لازم يكون inline
          style={{ position: "absolute", width: "122%", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        />
      </div>
      <h3 className="font-display text-[1.0625rem] font-bold leading-snug">{def.title}</h3>
      <p className="mt-1.5 min-h-[4.65em] text-[0.9375rem] leading-[1.55] text-ink-soft" aria-live="polite">{line}</p>
    </motion.article>
  );
}

/** بطاقة المتجر: إيصال مقصوص بأسنان من تحت، لأن كل شي يبدأ من الطلب. */
function StoreCard({ onEnter }: { onEnter: (id: string) => void }) {
  const rows = [
    { name: "سلة", on: true },
    { name: "زد", on: false },
    { name: "موقعك الخاص", on: false },
  ];
  return (
    <article className="relative w-[17.5rem] -rotate-[1.5deg] text-ink drop-shadow-[0_18px_18px_rgba(0,0,0,.55)]" onPointerEnter={() => onEnter(STORE)}>
      <Anchor id="store-tl" className="left-[14px] top-[14px]" />
      <Anchor id="store-tr" className="right-[14px] top-[14px]" />
      <Anchor id="store-bl" className="bottom-[30px] left-[14px]" />
      <Anchor id="store-br" className="bottom-[30px] right-[14px]" />
      <Anchor id="store-b" className="bottom-[30px] left-1/2" />
      <div className="receipt bg-paper px-7 pb-12 pt-7">
        <h3 className="font-display text-[1.375rem] font-bold">متجرك</h3>
        <p className="mt-1 text-[0.9375rem] leading-[1.55] text-ink-soft">تربطه مرة وحدة، والباقي يشتغل لحاله.</p>
        <ul className="mt-4 border-t border-dashed border-ink/20 pt-2">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center justify-between py-1.5 text-[0.9375rem]">
              <span className="font-medium">{r.name}</span>
              {r.on ? (
                <span className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-green">
                  مربوط
                  <svg viewBox="0 0 12 12" className="size-3" aria-hidden><path d="M2 6.4 4.8 9 10 3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              ) : (
                <span className="text-[0.8125rem] text-ink-faint">متاح</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** ورقة لاصقة بخط اليد، بشريط لاصق بدل الدبوس. */
function Note() {
  return (
    <div className="relative w-[12.5rem] rotate-[4deg]">
      <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-white/30" />
      <p className="bg-[#d8eadc] px-5 pb-6 pt-6 font-hand text-[1.45rem] leading-[1.5] text-green-deep shadow-[0_16px_22px_-14px_rgba(0,0,0,.8)]">
        وكل صباح يوصلك تقرير على الواتساب
      </p>
    </div>
  );
}

const SLOTS: Record<string, { x: number; y: number }> = {
  [STORE]: { x: 50, y: 24 },
  note: { x: 50, y: 590 },
  ...Object.fromEntries(CARDS.map((c) => [c.id, c.at])),
};

export function Board() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const wide = useMedia("(min-width: 1024px)");
  const touch = useMedia("(hover: none)");
  const [paths, setPaths] = useState<{ to: string; d: string }[]>([]);
  const [pins, setPins] = useState<(Pt & { id: string })[]>([]);
  const [ready, setReady] = useState(false);

  /* الدبابيس والخيوط من أماكن الأوراق الفعلية */
  const measure = useCallback(() => {
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    const at: Record<string, Pt> = {};
    root.current!.querySelectorAll<HTMLElement>("[data-anchor]").forEach((a) => {
      const r = a.getBoundingClientRect();
      at[a.dataset.anchor!] = { x: r.left - box.left, y: r.top - box.top };
    });
    const links = wide ? WIDE : NARROW;
    setPaths(links.map((l) => ({ to: l.to, d: sagPath(at[l.from], at[l.end]) })));
    const ends = [...new Set(links.flatMap((l) => [l.from, l.end]))];
    setPins(ends.map((id) => ({ id, ...at[id] })));
  }, [wide]);

  useEffect(() => {
    if (!ready) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root.current!);
    return () => ro.disconnect();
  }, [ready, measure]);

  /** نبضة حمرا تمشي على الخيط من المتجر للورقة: الطلب وهو يوصل. */
  const pulse = useCallback((id: string) => {
    if (!svg.current || reduced()) return;
    const targets = id === STORE ? CARDS.map((c) => c.id) : [id];
    for (const t of targets) {
      const path = svg.current.querySelector<SVGPathElement>(`[data-link="${t}"]`);
      const dot = svg.current.querySelector<SVGCircleElement>(`[data-pulse="${t}"]`);
      if (!path || !dot) continue;
      const len = path.getTotalLength(), s = { p: 0 };
      gsap.killTweensOf(dot);
      gsap.fromTo(dot, { opacity: 1 }, { opacity: 0, duration: 0.25, delay: 0.85 });
      gsap.to(s, {
        p: 1, duration: 0.95, ease: "power2.inOut",
        onUpdate: () => { const q = path.getPointAtLength(len * s.p); dot.setAttribute("cx", q.x.toFixed(1)); dot.setAttribute("cy", q.y.toFixed(1)); },
      });
    }
  }, []);

  /* الدخول: الأوراق تنزل وتتعلق، بعدين تنغرز الدبابيس، بعدين تنشد الخيوط وتمشي عليها أول نبضة */
  useGSAP(() => {
    const papers = gsap.utils.toArray<HTMLElement>("[data-slot]", root.current);
    if (reduced()) { gsap.set(papers, { opacity: 1 }); setReady(true); return; }
    gsap.timeline({ delay: 0.55, onComplete: () => setReady(true) })
      .fromTo(papers, { opacity: 0, y: -36, rotate: 5 }, { opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: "back.out(1.5)", stagger: 0.09 });
  }, { scope: root });

  useGSAP(() => {
    const el = svg.current;
    if (!ready || !el || !paths.length || el.dataset.drawn || reduced()) return;
    el.dataset.drawn = "1";
    const strings = el.querySelectorAll<SVGPathElement>("[data-string]");
    const heads = el.querySelectorAll<SVGGElement>("[data-pin]");
    strings.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
    gsap.timeline({ onComplete: () => { gsap.set(strings, { clearProps: "strokeDasharray,strokeDashoffset" }); pulse(STORE); } })
      .fromTo(heads, { scale: 1.9, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out", stagger: 0.06 })
      .to(strings, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.08 }, "-=0.15");
  }, { dependencies: [ready, paths.length], scope: root });

  const place = (id: string) => (wide ? { left: `${SLOTS[id].x}%`, top: SLOTS[id].y } : undefined);
  const slot = "relative z-10 lg:absolute lg:m-0 lg:-translate-x-1/2";

  return (
    <div ref={root} className="relative mx-auto flex w-full max-w-[80rem] flex-col items-center gap-14 px-4 pb-24 pt-6 lg:block lg:h-[52rem] lg:w-[calc(100%-3rem)] lg:px-0 lg:pb-0 lg:pt-0">
      <div data-slot data-reveal className={slot} style={place(STORE)}>
        <StoreCard onEnter={pulse} />
      </div>
      {CARDS.map((c, i) => (
        <div key={c.id} data-slot data-reveal className={`${slot} ${i % 2 ? "ms-10" : "me-10"}`} style={place(c.id)}>
          <FigureCard def={c} swing={wide} play={touch} onEnter={pulse} />
        </div>
      ))}
      <div data-slot data-reveal className={slot} style={place("note")}>
        <Note />
      </div>

      <svg ref={svg} aria-hidden className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible">
        {paths.map((l) => (
          <g key={l.to}>
            <path d={l.d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth="2.2" transform="translate(1.5 3)" data-string="" />
            <path d={l.d} fill="none" stroke="var(--color-pin)" strokeWidth="1.6" strokeLinecap="round" data-string="" data-link={l.to} />
            <circle data-pulse={l.to} r="3.4" fill="#ff6a55" opacity="0" />
          </g>
        ))}
        {pins.map((p) => (
          <g key={p.id} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
            <g data-pin={p.id}>
              <ellipse cx="2.2" cy="4.2" rx="7" ry="6" fill="rgba(0,0,0,.45)" />
              <circle r="7.5" fill="var(--color-pin)" />
              <circle r="7.5" fill="none" stroke="var(--color-pin-deep)" strokeWidth="1" />
              <circle cx="-2.4" cy="-2.6" r="2.4" fill="rgba(255,255,255,.5)" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
