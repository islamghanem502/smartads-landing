"use client";

import { useRef } from "react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";

/** تظليل بقلم ماركر على الكلام المهم: ينرسم من اليمين لما يوصل له السكرول. */
export function Mark({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const el = ref.current!;
    if (reduced()) { el.style.setProperty("--p", "1"); return; }
    gsap.fromTo(el, { "--p": 0 }, { "--p": 1, duration: 0.85, delay: 0.15, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  return <span ref={ref} className={`mark mark-${tone}`}>{children}</span>;
}
