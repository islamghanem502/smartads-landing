"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, reduced } from "@/lib/gsap";
import { Facebook, Google, Instagram, Meta, Snapchat, TikTok } from "@/components/brand/logos";

type Svg = React.SVGProps<SVGSVGElement>;
type Logo = (p: Svg) => React.ReactElement;

/* الشجرة: مسوّقك الذكي فوق، ومنه ثلاث فروع للخدمات، وفي آخر كل فرع المنصات اللي يشتغل عليها */
const SERVICES: { title: string; text: string; on: { L: Logo; n: string }[] }[] = [
  {
    title: "حملات إعلانية",
    text: "نطلقها ونحسّنها كل يوم",
    on: [{ L: Snapchat, n: "سناب شات" }, { L: TikTok, n: "تيك توك" }, { L: Meta, n: "ميتا" }, { L: Google, n: "قوقل" }],
  },
  {
    title: "منشورات وفيديوهات",
    text: "نصمّمها وننشرها في حساباتك",
    on: [{ L: Instagram, n: "انستقرام" }, { L: TikTok, n: "تيك توك" }, { L: Facebook, n: "فيسبوك" }],
  },
  {
    title: "سيو متجرك",
    text: "نرفعك في نتائج قوقل",
    on: [{ L: Google, n: "قوقل" }],
  },
];

const R = 14; // انحناءة الفرع

type Pt = { x: number; y: number };

export function ServiceTree() {
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  /* الجذع يطلع من نص علامة الجذر، وكل فرع ينزل معه وينعطف لعنوان خدمته */
  const measure = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const at = (q: string): Pt => {
      const r = el.querySelector(q)!.getBoundingClientRect();
      return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
    };
    const root = el.querySelector("[data-root]")!.getBoundingClientRect();
    const sx = root.left - b.left + root.width / 2, sy = root.bottom - b.top + 6;
    setSize({ w: b.width, h: b.height });
    setPaths(SERVICES.map((_, i) => {
      const a = at(`[data-end="${i}"]`);
      return `M${sx.toFixed(1)} ${sy.toFixed(1)}V${(a.y - R).toFixed(1)}Q${sx.toFixed(1)} ${a.y.toFixed(1)} ${(sx - R).toFixed(1)} ${a.y.toFixed(1)}H${(a.x + 4).toFixed(1)}`;
    }));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box.current!);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  /* الدخول: الفروع تنرسم، والمنصات تطلع. بعدها نبضة تنزل في الشجرة لفرع ورا فرع، ومنصاته تنطّ لما توصل */
  useEffect(() => {
    const el = svg.current;
    if (!el || !paths.length) return;
    const base = el.querySelectorAll<SVGPathElement>("[data-base]");
    const leaves = (i: number) => box.current!.querySelectorAll<HTMLElement>(`[data-leaf="${i}"]`);
    if (reduced()) return;
    if (!el.dataset.drawn) {
      el.dataset.drawn = "1";
      base.forEach((p) => { const l = p.getTotalLength(); gsap.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: 0.9, delay: 0.9, ease: "power2.inOut", clearProps: "strokeDasharray,strokeDashoffset" }); });
      gsap.fromTo(box.current!.querySelectorAll("[data-leaf]"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, delay: 1.4, stagger: 0.05, ease: "back.out(2)" });
    }

    let i = 0, on = true, t = 0;
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; });
    io.observe(el);
    const pulse = () => {
      if (on && !document.hidden) {
        const path = el.querySelector<SVGPathElement>(`[data-glow="${i}"]`)!;
        const dot = el.querySelector<SVGCircleElement>("[data-pulse]")!;
        const len = path.getTotalLength(), s = { p: 0 }, k = i;
        gsap.timeline()
          .set(dot, { opacity: 1 })
          .to(path, { opacity: 1, duration: 0.3 }, 0)
          .to(s, { p: 1, duration: 1.1, ease: "power2.inOut", onUpdate: () => { const q = path.getPointAtLength(len * s.p); dot.setAttribute("cx", q.x.toFixed(1)); dot.setAttribute("cy", q.y.toFixed(1)); } }, 0)
          .to(dot, { opacity: 0, duration: 0.2 }, 1.0)
          .fromTo(leaves(k), { y: 0 }, { y: -6, duration: 0.22, yoyo: true, repeat: 1, stagger: 0.07, ease: "power2.out" }, 1.0)
          .to(path, { opacity: 0, duration: 0.6 }, 1.5);
        i = (i + 1) % SERVICES.length;
      }
      t = window.setTimeout(pulse, 2600);
    };
    t = window.setTimeout(pulse, 2600);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [paths]);

  /* المؤشر على خدمة: فرعها يتلوّن */
  const glow = (i: number, v: number) => {
    const p = svg.current?.querySelector(`[data-glow="${i}"]`);
    if (p) gsap.to(p, { opacity: v, duration: 0.3, overwrite: "auto" });
  };

  return (
    <div ref={box} data-a="tree" className="mh-tree relative lg:mx-auto">
      <div className="flex items-center gap-3">
        <span data-root className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--night-3)] ring-1 ring-white/15">
          <Image src="/landing/mascot-head.png" alt="" width={48} height={48} className="mt-1.5 size-11 object-contain min-[1180px]:hidden" />
          <span className="hidden size-3 rounded-full bg-[linear-gradient(135deg,#7c5cff,#d946ef,#ff6b6b)] min-[1180px]:block" />
        </span>
        <div>
          <p className="text-[1.0625rem] font-bold text-white">مسوّقك الذكي</p>
          <p className="text-[0.875rem] text-[#cfd3db]">يشغّل كل هذا عنك</p>
        </div>
      </div>

      <ul className="mh-svc mt-6 grid gap-6 ps-[3.75rem] sm:gap-7">
        {SERVICES.map((s, i) => (
          <li key={s.title} className="relative" onPointerEnter={() => glow(i, 1)} onPointerLeave={() => glow(i, 0)}>
            <span data-end={i} aria-hidden className="absolute right-0 top-[0.8rem] size-0" />
            <a href="#services" className="group block">
              <h3 className="text-[1.0625rem] font-semibold leading-snug text-white sm:text-[1.1875rem]">
                <span className="ink">{s.title}</span>
              </h3>
              <p className="mt-0.5 text-[0.875rem] text-[#cfd3db]">{s.text}</p>
              <ul className="mh-leaves mt-3 flex flex-wrap gap-2" aria-label="المنصات">
                {s.on.map(({ L, n }) => (
                  <li key={n} data-leaf={i} title={n} className="mh-leaf grid size-11 place-items-center rounded-[14px] bg-white transition-transform duration-300 group-hover:-translate-y-1 sm:size-12 sm:rounded-[15px]">
                    <L className="size-[1.35rem] sm:size-6" />
                    <span className="sr-only">{n}</span>
                  </li>
                ))}
              </ul>
            </a>
          </li>
        ))}
      </ul>

      <svg ref={svg} aria-hidden width={size.w} height={size.h} className="pointer-events-none absolute inset-0 overflow-visible">
        <defs>
          <linearGradient id="tree-glow" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={size.h || 1}>
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset=".5" stopColor="#d946ef" />
            <stop offset="1" stopColor="#ffa94d" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => <path key={`b${i}`} data-base d={d} fill="none" stroke="#3b404c" strokeWidth="1.6" strokeLinecap="round" />)}
        {paths.map((d, i) => <path key={`g${i}`} data-glow={i} d={d} fill="none" stroke="url(#tree-glow)" strokeWidth="2.2" strokeLinecap="round" opacity="0" />)}
        <circle data-pulse r="4.5" fill="#ffffff" opacity="0" />
      </svg>
    </div>
  );
}
