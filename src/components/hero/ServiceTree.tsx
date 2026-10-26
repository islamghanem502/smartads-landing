import { useEffect, useRef, useState } from "react";
import { gsap, reduced } from "../../lib/gsap";
import { Facebook, Google, Instagram, Meta, Snapchat, TikTok, type Logo } from "../logos";

/* مسوّقك الذكي فوق، ومنه فرع لكل خدمة، وفي آخر الفرع المنصات اللي نشتغل عليها */
const SERVICES: { title: string; text: string; on: Logo[] }[] = [
  { title: "حملات إعلانية", text: "نطلقها ونحسّنها كل يوم", on: [Snapchat, TikTok, Meta, Google] },
  { title: "منشورات وفيديوهات", text: "نصمّمها وننشرها في حساباتك", on: [Instagram, TikTok, Snapchat, Facebook] },
  { title: "سيو متجرك", text: "نرفعك في نتائج قوقل", on: [Google] },
];

const R = 14; // انحناءة الفرع

/** الجذع ينزل من نص الجذر، وكل فرع ينعطف لعنوان خدمته. الأرقام من مكان العناصر نفسها، فتمشي مع أي عرض أو خط. */
function branches(box: HTMLElement) {
  const b = box.getBoundingClientRect();
  const root = box.querySelector("[data-root]")!.getBoundingClientRect();
  const x = Math.round(root.left - b.left + root.width / 2);
  const top = Math.round(root.bottom - b.top + 6);
  return [...box.querySelectorAll("[data-end]")].map((end) => {
    const e = end.getBoundingClientRect();
    const ex = Math.round(e.left - b.left), ey = Math.round(e.top - b.top);
    return `M${x} ${top}V${ey - R}Q${x} ${ey} ${x - R} ${ey}H${ex + 4}`;
  });
}

export function ServiceTree() {
  const box = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    const el = box.current!;
    const measure = () => setPaths(branches(el));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  /* أول مرة: الفروع تنرسم والمنصات تطلع. بعدها نبضة تنزل لفرع ورا فرع، ومنصاته تنطّ لما توصل */
  useEffect(() => {
    const el = box.current!;
    if (!paths.length || reduced()) return;
    const q = gsap.utils.selector(el);

    if (!el.dataset.drawn) {
      el.dataset.drawn = "1";
      for (const p of el.querySelectorAll<SVGPathElement>("[data-base]")) {
        const l = p.getTotalLength();
        gsap.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: 0.9, delay: 0.9, ease: "power2.inOut", clearProps: "strokeDasharray,strokeDashoffset" });
      }
      gsap.fromTo(q("[data-leaf]"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, delay: 1.4, stagger: 0.05, ease: "back.out(2)" });
    }

    let i = 0, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const dot = el.querySelector<SVGCircleElement>("[data-pulse]")!;

    const pulse = () => {
      if (visible) {
        const path = el.querySelector<SVGPathElement>(`[data-glow="${i}"]`)!;
        const len = path.getTotalLength(), s = { t: 0 };
        gsap.timeline()
          .set(dot, { opacity: 1 })
          .to(path, { opacity: 1, duration: 0.3 }, 0)
          .to(s, {
            t: 1, duration: 1.1, ease: "power2.inOut",
            onUpdate: () => { const p = path.getPointAtLength(len * s.t); dot.setAttribute("cx", `${p.x}`); dot.setAttribute("cy", `${p.y}`); },
          }, 0)
          .to(dot, { opacity: 0, duration: 0.2 }, 1)
          .to(q(`[data-leaf="${i}"]`), { y: -6, duration: 0.22, yoyo: true, repeat: 1, stagger: 0.07, ease: "power2.out" }, 1)
          .to(path, { opacity: 0, duration: 0.6 }, 1.5);
        i = (i + 1) % SERVICES.length;
      }
      loop.restart(true);
    };
    const loop = gsap.delayedCall(2.6, pulse);
    return () => { loop.kill(); io.disconnect(); };
  }, [paths]);

  /* المؤشر على خدمة: فرعها يتلوّن */
  const glow = (i: number, opacity: number) =>
    gsap.to(box.current!.querySelector(`[data-glow="${i}"]`), { opacity, duration: 0.3, overwrite: "auto" });

  return (
    <div ref={box} data-a="tree" data-reveal className="tree relative w-max">
      <div className="flex items-center gap-3">
        <span data-root className="grid size-12 shrink-0 place-items-center rounded-full bg-night-3 ring-1 ring-white/15">
          <span className="size-3 rounded-full bg-[image:var(--gradient)]" />
        </span>
        <div>
          <p className="text-[1.0625rem] font-bold">مسوّقك الذكي</p>
          <p className="text-sm text-mist">يشغّل كل هذا عنك</p>
        </div>
      </div>

      <ul className="mt-6 grid gap-y-(--branch-gap) ps-15">
        {SERVICES.map((s, i) => (
          <li key={s.title} className="group relative" onPointerEnter={() => glow(i, 1)} onPointerLeave={() => glow(i, 0)}>
            <span data-end aria-hidden className="absolute right-0 top-[0.8rem]" />
            <h3 className="text-[1.0625rem] font-semibold leading-snug sm:text-[1.1875rem]">
              <span className="ink">{s.title}</span>
            </h3>
            <p className="mt-0.5 text-sm text-mist">{s.text}</p>
            <ul aria-label="المنصات" className="mt-3 flex gap-2">
              {s.on.map((L, k) => (
                <li key={k} data-leaf={i} className="grid size-(--leaf) place-items-center rounded-[30%] bg-white transition-transform duration-300 group-hover:-translate-y-1">
                  <L className="size-1/2" />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id="tree-glow" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset=".5" stopColor="#d946ef" />
            <stop offset="1" stopColor="#ffa94d" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => <path key={i} data-base d={d} fill="none" stroke="#3b404c" strokeWidth="1.6" strokeLinecap="round" />)}
        {paths.map((d, i) => <path key={i} data-glow={i} d={d} fill="none" stroke="url(#tree-glow)" strokeWidth="2.2" strokeLinecap="round" opacity="0" />)}
        <circle data-pulse r="4.5" fill="#fff" opacity="0" />
      </svg>
    </div>
  );
}
