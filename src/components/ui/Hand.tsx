"use client";

import { useRef } from "react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";

/* خطوط باليد: سهم، دائرة، خط تحت كلمة، صح. ننرسم مرة وحدة لما تبان. */
const SHAPES = {
  arrow: { vb: "0 0 120 70", d: "M112 8c-22 2-52 10-74 30-6 6-11 14-14 24 M12 46c4 6 8 12 12 17 6-4 12-7 19-9" },
  arrowUp: { vb: "0 0 90 90", d: "M8 82c10-26 28-50 62-66 M52 12c8 1 15 2 22 4-2 7-4 14-8 20" },
  circle: { vb: "0 0 200 70", d: "M118 8C66 2 14 14 8 34c-6 22 60 32 118 28 46-3 70-16 66-32-4-18-50-26-92-22-18 2-34 6-48 12" },
  underline: { vb: "0 0 200 16", d: "M4 10c46-6 100-7 150-5 14 1 28 2 42 4" },
  check: { vb: "0 0 24 24", d: "M3.5 12.8c2 1.8 4 4 5.6 6.2 3.2-5.6 7-10.4 11.6-14.6" },
} as const;

type Props = {
  shape: keyof typeof SHAPES;
  className?: string;
  width?: number;
  delay?: number;
  /** none: تتمدد مع الكلمة اللي تحيط فيها */
  stretch?: boolean;
};

export function Hand({ shape, className = "", width = 2.2, delay = 0.2, stretch = false }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const s = SHAPES[shape];
  useGSAP(() => {
    const p = ref.current!.querySelector("path")!;
    if (reduced()) return;
    const l = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: 0.9, delay, ease: "power2.inOut", scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } });
  });
  return (
    <svg ref={ref} viewBox={s.vb} aria-hidden preserveAspectRatio={stretch ? "none" : undefined} className={`pointer-events-none overflow-visible ${className}`}>
      <path d={s.d} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
