"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";
import { PIN_AT, PIN_BOX } from "@/components/ui/Pin";
import { Facebook, Google, Instagram, Meta, Salla, Snapchat, TikTok, Website, Zid } from "@/components/brand/logos";

/* اللوح مرسوم على مقاس ثابت (W × H) ويصغر على قد مكانه، فالخيوط تنحسب بنفس الأرقام في كل شاشة. */
const W = 640, H = 640;
const PIN = 30;

type Pt = { x: number; y: number };
type Link = { id: string; from: string; to: string; stage: 0 | 1 };

/* من المتجر للفريق (المرحلة الأولى)، ومن الفريق لكل منصة وحساب (الثانية) */
const LINKS: Link[] = [
  { id: "salla", from: "salla", to: "hub-r", stage: 0 },
  { id: "zid", from: "zid", to: "hub-r", stage: 0 },
  { id: "site", from: "site", to: "hub-r", stage: 0 },
  { id: "meta", from: "hub-l", to: "meta", stage: 1 },
  { id: "snap", from: "hub-l", to: "snap", stage: 1 },
  { id: "tiktok", from: "hub-l", to: "tiktok", stage: 1 },
  { id: "google", from: "hub-l", to: "google", stage: 1 },
  { id: "acct", from: "hub-b", to: "acct", stage: 1 },
];
const PINS = ["salla", "zid", "site", "hub-r", "hub-l", "hub-b", "meta", "snap", "tiktok", "google", "acct"];

const sagPath = (a: Pt, b: Pt) => {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${((a.x + b.x) / 2).toFixed(1)} ${((a.y + b.y) / 2 + d * 0.1).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

const Anchor = ({ id, className = "left-1/2 top-[13px]" }: { id: string; className?: string }) => (
  <span data-anchor={id} aria-hidden className={`pointer-events-none absolute size-0 ${className}`} />
);

const paper = "bg-paper text-ink shadow-[0_1px_0_rgba(255,255,255,.7)_inset,0_18px_24px_-16px_rgba(0,0,0,.9),0_2px_3px_rgba(0,0,0,.35)]";

type Place = { x: number; y: number; r: number };
function At({ p, id, children, onEnter }: { p: Place; id: string; children: React.ReactNode; onEnter?: (id: string) => void }) {
  return (
    <div
      data-paper
      className="absolute -translate-x-1/2"
      style={{ left: p.x, top: p.y, rotate: `${p.r}deg` }}
      onPointerEnter={onEnter ? () => onEnter(id) : undefined}
    >
      {children}
    </div>
  );
}

/** إيصال صغير لكل متجر: سلة، زد، موقعك. */
function StoreTag({ id, name, children }: { id: string; name: string; children: React.ReactNode }) {
  return (
    <div className="relative w-[7.75rem] drop-shadow-[0_14px_14px_rgba(0,0,0,.55)]">
      <Anchor id={id} className="left-[17px] top-[17px]" />
      <div className="receipt flex flex-col items-center gap-2 bg-paper px-3 pb-7 pt-8 text-ink">
        <div className="grid h-10 place-items-center">{children}</div>
        <span className="font-display text-[0.8125rem] font-semibold">{name}</span>
      </div>
    </div>
  );
}

/** بطاقة منصة إعلانية: الشعار واسمه. */
function AdTag({ id, name, children }: { id: string; name: string; children: React.ReactNode }) {
  return (
    <div className={`relative flex w-[7rem] flex-col items-center gap-2 rounded-[4px] px-3 pb-3.5 pt-8 ${paper}`}>
      <Anchor id={id} className="right-[16px] top-[16px]" />
      <div className="grid h-10 place-items-center">{children}</div>
      <span className="font-display text-[0.8125rem] font-semibold">{name}</span>
    </div>
  );
}

export function ConnectBoard() {
  const frame = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [paths, setPaths] = useState<(Link & { d: string })[]>([]);
  const [pins, setPins] = useState<(Pt & { id: string })[]>([]);
  const [ready, setReady] = useState(false);

  /* اللوح يصغر على قد العمود اللي هو فيه */
  useEffect(() => {
    const el = frame.current!;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const measure = useCallback(() => {
    const b = board.current;
    if (!b) return;
    const box = b.getBoundingClientRect(), k = box.width / W;
    const at: Record<string, Pt> = {};
    b.querySelectorAll<HTMLElement>("[data-anchor]").forEach((a) => {
      const r = a.getBoundingClientRect();
      at[a.dataset.anchor!] = { x: (r.left - box.left) / k, y: (r.top - box.top) / k };
    });
    setPaths(LINKS.map((l) => ({ ...l, d: sagPath(at[l.from], at[l.to]) })));
    setPins(PINS.map((id) => ({ id, ...at[id] })));
  }, []);

  useEffect(() => { if (ready) measure(); }, [ready, scale, measure]);

  /** نبضة تمشي على خيط واحد من أوله لآخره. */
  const run = useCallback((id: string, tl?: gsap.core.Timeline, at?: number) => {
    const el = svg.current;
    const path = el?.querySelector<SVGPathElement>(`[data-link="${id}"]`);
    const dot = el?.querySelector<SVGCircleElement>(`[data-pulse="${id}"]`);
    if (!path || !dot) return;
    const len = path.getTotalLength(), s = { p: 0 };
    const move = () => { const q = path.getPointAtLength(len * s.p); dot.setAttribute("cx", q.x.toFixed(1)); dot.setAttribute("cy", q.y.toFixed(1)); };
    const go = gsap.timeline()
      .set(dot, { opacity: 1 })
      .fromTo(s, { p: 0 }, { p: 1, duration: 0.9, ease: "power2.inOut", onUpdate: move })
      .to(dot, { opacity: 0, duration: 0.2 }, "-=0.15");
    if (tl) tl.add(go, at);
  }, []);

  const hover = useCallback((id: string) => { if (!reduced()) run(id); }, [run]);

  /* الدخول: الأوراق تنزل وتتعلق، الدبابيس تنغرز، الخيوط تنشد */
  useGSAP(() => {
    const papers = gsap.utils.toArray<HTMLElement>("[data-paper]", board.current);
    if (reduced()) { gsap.set(papers, { opacity: 1 }); setReady(true); return; }
    gsap.timeline({ delay: 0.5, onComplete: () => setReady(true) })
      .fromTo(papers, { opacity: 0, y: -28 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.6)", stagger: 0.06 });
  }, { scope: board });

  /* بعدها: الدبابيس، الخيوط، وحلقة النبض اللي تشرح الفكرة كلها: طلب يدخل من المتجر ويطلع لكل منصة */
  useGSAP(() => {
    const el = svg.current;
    if (!ready || !el || !paths.length || el.dataset.drawn || reduced()) return;
    el.dataset.drawn = "1";
    const strings = el.querySelectorAll<SVGPathElement>("[data-string]");
    strings.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
    const loop = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true });
    LINKS.filter((l) => l.stage === 0).forEach((l, i) => run(l.id, loop, i * 0.12));
    loop.fromTo("[data-hub-ring]", { scale: 0.9, opacity: 0.9, transformOrigin: "50% 50%" }, { scale: 1.25, opacity: 0, duration: 0.6, ease: "power2.out" }, 1.0);
    LINKS.filter((l) => l.stage === 1).forEach((l, i) => run(l.id, loop, 1.05 + i * 0.08));

    let started = false;
    gsap.timeline({ onComplete: () => { gsap.set(strings, { clearProps: "strokeDasharray,strokeDashoffset" }); started = true; loop.play(); } })
      .fromTo("[data-pin]", { scale: 1.8, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out", stagger: 0.04 })
      .to(strings, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut", stagger: 0.04 }, "-=0.2");

    // الحلقة تنام لما اللوح يطلع من الشاشة
    const io = new IntersectionObserver(([e]) => { if (started) { if (e.isIntersecting) loop.resume(); else loop.pause(); } });
    io.observe(el);
    return () => { io.disconnect(); loop.kill(); };
  }, { dependencies: [ready, paths.length], scope: board });

  const s = PIN / PIN_BOX;
  return (
    <div ref={frame} className="relative w-full" style={{ height: H * scale }}>
      <div ref={board} className="absolute left-1/2 top-0 origin-top" style={{ width: W, height: H, transform: `translateX(-50%) scale(${scale})` }}>
        {/* عناوين المجموعات بخط اليد */}
        <p className="absolute right-[38px] top-[-6px] font-hand text-[1.35rem] text-chalk-soft">متجرك</p>
        <p className="absolute left-[44px] top-[-14px] font-hand text-[1.35rem] text-chalk-soft">إعلاناتك</p>

        <At p={{ x: 548, y: 34, r: 3 }} id="salla" onEnter={hover}><StoreTag id="salla" name="سلة"><Salla className="h-9" /></StoreTag></At>
        <At p={{ x: 556, y: 228, r: -2.5 }} id="zid" onEnter={hover}><StoreTag id="zid" name="زد"><Zid className="h-7" /></StoreTag></At>
        <At p={{ x: 544, y: 418, r: 2 }} id="site" onEnter={hover}><StoreTag id="site" name="موقعك الخاص"><Website className="h-10" /></StoreTag></At>

        {/* الفريق: بطاقة المنصة في النص */}
        <At p={{ x: 322, y: 196, r: -1.5 }} id="hub">
          <div className={`relative w-[12.5rem] rounded-[5px] px-5 pb-6 pt-8 text-center ${paper}`}>
            <Anchor id="hub-r" className="right-[15px] top-[15px]" />
            <Anchor id="hub-l" className="left-[15px] top-[15px]" />
            <Anchor id="hub-b" className="bottom-[15px] left-1/2" />
            <span data-hub-ring aria-hidden className="absolute inset-0 rounded-[5px] ring-2 ring-pin/60 opacity-0" />
            <p className="font-display text-[1.1875rem] font-bold">مسوّقك الذكي</p>
            <p className="mt-1.5 text-[0.875rem] leading-[1.55] text-ink-soft">يقرأ، ويقرر، وينفّذ كل يوم.</p>
            <p className="mb-2 mt-3 font-hand text-[1.15rem] text-green">فريقك التسويقي</p>
          </div>
        </At>

        <At p={{ x: 92, y: 24, r: -3 }} id="meta" onEnter={hover}><AdTag id="meta" name="ميتا"><Meta className="h-9" /></AdTag></At>
        <At p={{ x: 104, y: 172, r: 2.5 }} id="snap" onEnter={hover}><AdTag id="snap" name="سناب شات"><Snapchat className="h-10" /></AdTag></At>
        <At p={{ x: 88, y: 320, r: -2 }} id="tiktok" onEnter={hover}><AdTag id="tiktok" name="تيك توك"><TikTok className="h-9" /></AdTag></At>
        <At p={{ x: 102, y: 468, r: 3 }} id="google" onEnter={hover}><AdTag id="google" name="قوقل"><Google className="h-9" /></AdTag></At>

        {/* حسابات النشر: شريط فيه صور الحسابات */}
        <At p={{ x: 320, y: 486, r: 1.5 }} id="acct" onEnter={hover}>
          <div className={`relative w-[14.5rem] rounded-[5px] px-4 pb-4 pt-8 ${paper}`}>
            <Anchor id="acct" />
            <div className="flex items-center justify-center gap-3">
              {[Instagram, TikTok, Facebook].map((L, i) => (
                <span key={i} className="grid size-12 place-items-center rounded-full bg-white ring-1 ring-ink/10"><L className="size-6" /></span>
              ))}
            </div>
            <p className="mt-3 text-center text-[0.8125rem] leading-[1.5] text-ink-soft">ننشر في حساباتك، ونرد على التعليقات</p>
          </div>
        </At>
        <p className="absolute bottom-[8px] right-[118px] font-hand text-[1.35rem] text-chalk-soft">حساباتك</p>

        <svg ref={svg} aria-hidden viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible">
          {paths.map((l) => (
            <g key={l.id}>
              <path d={l.d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth="2.2" transform="translate(1.5 3)" data-string="" />
              <path d={l.d} fill="none" stroke="#c9281b" strokeWidth="1.6" strokeLinecap="round" data-string="" data-link={l.id} />
              <circle data-pulse={l.id} r="3.6" fill="#ff7a62" opacity="0" />
            </g>
          ))}
          {pins.map((p) => (
            <g key={p.id} transform={`translate(${(p.x - PIN_AT.x * s).toFixed(1)} ${(p.y - PIN_AT.y * s).toFixed(1)})`}>
              <use data-pin href="#pushpin" width={PIN} height={PIN} />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
