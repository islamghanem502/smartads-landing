import { useEffect, useRef } from "react";
import { gsap, reduced, useGSAP } from "./gsap";

export type Q = (selector: string) => HTMLElement[];

/**
 * قصة قصيرة بـ GSAP لرسمة: تنبني مرة وتوقف على أولها، وكل ما يزيد play تعيد من البداية.
 * الـ HTML نفسه لازم يكون مرسوم على آخر القصة، فبدون جافاسكربت أو مع «تقليل الحركة» يبان كامل.
 */
export function useStory(play: number, build: (q: Q) => gsap.core.Timeline) {
  const ref = useRef<HTMLDivElement>(null);
  const story = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (reduced()) return;
    story.current = build(gsap.utils.selector(ref) as Q).pause(0);
  }, { scope: ref });

  // ما نقطع القصة لو انطلبت مرة ثانية وهي شغّالة
  useEffect(() => {
    const s = story.current;
    if (play && s && !s.isActive()) s.restart();
  }, [play]);

  return ref;
}
