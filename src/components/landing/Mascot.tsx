"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, reduced } from "@/lib/gsap";

/* الوجه مرسوم فوق الصورة (والصورة نفسها بدون عيون ولا فم)، فيقدر يرمش ويلحق المؤشر ويبتسم.
   الأرقام بإحداثيات الصورة الأصلية 1920×1920، والفم منحنى مطابق لفمها الأصلي. */
const SMILE = "M672 609.5 C702 632.1 745.3 655.7 782 630";
const BIG_SMILE = "M664 603 C698 640 749 676 790 622";

function Face() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el || reduced()) return;
    const face = el.querySelector<SVGGElement>("[data-face]")!;
    const eyes = el.querySelector<SVGGElement>("[data-eyes]")!;
    const mouth = el.querySelector<SVGPathElement>("[data-mouth]")!;
    const lids = el.querySelectorAll<SVGGElement>("[data-eye]");
    // الوجه كله يتحرك مع النظرة، والعيون شوي زيادة: كذا يبان إنه يلف راسه مو بس عيونه
    const fx = gsap.quickTo(face, "x", { duration: 0.5, ease: "power3" });
    const fy = gsap.quickTo(face, "y", { duration: 0.5, ease: "power3" });
    const ex = gsap.quickTo(eyes, "x", { duration: 0.4, ease: "power3" });
    const ey = gsap.quickTo(eyes, "y", { duration: 0.4, ease: "power3" });

    const look = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const dx = e.clientX - (r.left + r.width * 0.39), dy = e.clientY - (r.top + r.height * 0.3);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 320), ux = dx / d, uy = dy / d;
      fx(ux * 16 * k); fy(uy * 10 * k);
      ex(ux * 7 * k); ey(uy * 5 * k);
    };
    // يبتسم أكثر لما المؤشر على زر الربط
    const smile = (e: Event) => {
      if (!(e.target as Element).closest?.("[data-smile]")) return;
      gsap.to(mouth, { attr: { d: e.type === "pointerover" ? BIG_SMILE : SMILE }, duration: 0.35, ease: "power3.out" });
    };
    // يرمش كل كم ثانية، ومرات رمشتين ورا بعض
    let blinkT = 0;
    const blink = () => {
      gsap.to(lids, { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: Math.random() < 0.2 ? 3 : 1, transformOrigin: "50% 50%", ease: "power1.inOut" });
      blinkT = window.setTimeout(blink, 2600 + Math.random() * 3200);
    };
    blinkT = window.setTimeout(blink, 1800);

    addEventListener("pointermove", look, { passive: true });
    document.addEventListener("pointerover", smile);
    document.addEventListener("pointerout", smile);
    return () => {
      removeEventListener("pointermove", look);
      document.removeEventListener("pointerover", smile);
      document.removeEventListener("pointerout", smile);
      clearTimeout(blinkT);
    };
  }, []);

  return (
    <svg ref={svg} viewBox="0 0 1920 1920" aria-hidden className="pointer-events-none absolute inset-0 size-full">
      <g data-face>
        <g data-eyes>
          <g data-eye>
            <ellipse cx="655.5" cy="535.5" rx="31" ry="31" fill="#151618" />
            <ellipse cx="646" cy="524" rx="8" ry="6" fill="#ffffff" fillOpacity="0.35" />
          </g>
          <g data-eye>
            <ellipse cx="839.5" cy="581" rx="30" ry="30.5" fill="#151618" />
            <ellipse cx="830" cy="570" rx="7.5" ry="5.5" fill="#ffffff" fillOpacity="0.35" />
          </g>
        </g>
        <path data-mouth d={SMILE} fill="none" stroke="#151618" strokeWidth="18" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** الشخصية: خط القص في صورتها يركب على حافة الشاشة اليسار، فجسمها برا الشاشة وتطلّ لداخل. */
export function Mascot({ className = "" }: { className?: string }) {
  return (
    <div data-a="mascot" data-reveal className={`mh-mascot relative ${className}`}>
      <Image
        src="/landing/mascot-faceless.webp"
        alt="شخصية مسوّقك الذكي: روبوت أبيض لابس غترة وعقال، يطلّ من طرف الشاشة ويسلّم"
        width={1200}
        height={1200}
        priority
        sizes="(min-width: 1180px) 33vw, 78vw"
        className="h-auto w-full select-none"
        draggable={false}
      />
      <Face />
      <p
        data-a="hello"
        data-reveal
        dir="rtl"
        className="mh-hello absolute whitespace-nowrap rounded-[16px] rounded-bl-[4px] bg-white px-4 py-2 text-[0.9375rem] font-semibold text-[var(--night)] sm:text-[1.0625rem]"
      >
        هلا والله!
      </p>
    </div>
  );
}
