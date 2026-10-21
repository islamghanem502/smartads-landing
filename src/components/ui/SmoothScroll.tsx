"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, reduced, ScrollTrigger } from "@/lib/gsap";

/** سكرول ناعم، ومربوط بـ ScrollTrigger عشان الحركات اللي على السكرول تمشي معه. */
export function SmoothScroll() {
  useEffect(() => {
    // الخطوط تغيّر أطوال الأقسام، فنعيد حساب نقاط السكرول بعد ما تنزل
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -72 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return null;
}
