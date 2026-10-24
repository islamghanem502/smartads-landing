"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, reduced } from "@/lib/gsap";

/* الوجه مرسوم فوق الصورة (والصورة نفسها شاشتها فاضية)، فيقدر يرمش ويلحق المؤشر ويبتسم.
   كل وضعية لها مكان وجهها بإحداثيات صورتها الأصلية. */
type Rig = {
  view: string;
  eyes: { cx: number; cy: number; r: number }[];
  smile: string;
  bigSmile: string;
  stroke: number;
  /** ميلان الشاشة حول نصها */
  tilt?: { a: number; cx: number; cy: number };
  /** نص الوجه كنسبة من الصورة، منه نحسب وين يطالع */
  at: [number, number];
};

/* الشخصية تطلّ من حافة الشاشة (1920×1920)، والفم منحنى مطابق لفمها الأصلي */
const PEEK: Rig = {
  view: "0 0 1920 1920",
  eyes: [{ cx: 655.5, cy: 535.5, r: 31 }, { cx: 839.5, cy: 581, r: 30.5 }],
  smile: "M672 609.5 C702 632.1 745.3 655.7 782 630",
  bigSmile: "M664 603 C698 640 749 676 790 622",
  stroke: 18,
  at: [0.39, 0.3],
};

/* الشخصية واقفة وتقدّم بيدها (مقصوصة من 2048: تبدأ من 183,110 وعرضها 1802) */
const PRESENT: Rig = {
  view: "183 110 1802 1802",
  eyes: [{ cx: 880, cy: 520, r: 29 }, { cx: 1050, cy: 520, r: 29 }],
  smile: "M925 578 C948 604 985 604 1007 578",
  bigSmile: "M918 572 C944 618 990 618 1014 572",
  stroke: 16,
  tilt: { a: -6, cx: 965, cy: 530 },
  at: [0.434, 0.233],
};

function Face({ rig }: { rig: Rig }) {
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
      const dx = e.clientX - (r.left + r.width * rig.at[0]), dy = e.clientY - (r.top + r.height * rig.at[1]);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 320), ux = dx / d, uy = dy / d;
      fx(ux * 16 * k); fy(uy * 10 * k);
      ex(ux * 7 * k); ey(uy * 5 * k);
    };
    // يبتسم أكثر لما المؤشر على زر الربط
    const smile = (e: Event) => {
      if (!(e.target as Element).closest?.("[data-smile]")) return;
      gsap.to(mouth, { attr: { d: e.type === "pointerover" ? rig.bigSmile : rig.smile }, duration: 0.35, ease: "power3.out" });
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
  }, [rig]);

  const t = rig.tilt;
  return (
    <svg ref={svg} viewBox={rig.view} aria-hidden className="pointer-events-none absolute inset-0 size-full">
      <g transform={t ? `rotate(${t.a} ${t.cx} ${t.cy})` : undefined}>
        <g data-face>
          <g data-eyes>
            {rig.eyes.map((e) => (
              <g key={e.cx} data-eye>
                <circle cx={e.cx} cy={e.cy} r={e.r} fill="#151618" />
                <ellipse cx={e.cx - e.r * 0.3} cy={e.cy - e.r * 0.37} rx={e.r * 0.26} ry={e.r * 0.19} fill="#ffffff" fillOpacity="0.35" />
              </g>
            ))}
          </g>
          <path data-mouth d={rig.smile} fill="none" stroke="#151618" strokeWidth={rig.stroke} strokeLinecap="round" />
        </g>
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
      <Face rig={PEEK} />
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

/** الشخصية واقفة جنب الشجرة، وتمدّ يدها لها كأنها تقول: هذا اللي نسويه لك. */
export function Presenter({ className = "" }: { className?: string }) {
  return (
    <div data-a="presenter" data-reveal className={`mh-presenter relative shrink-0 ${className}`}>
      <Image
        src="/landing/mascot-present.webp"
        alt="شخصية مسوّقك الذكي: روبوت أبيض لابس غترة وعقال، واقف ويأشّر بيده على خدماتنا"
        width={1200}
        height={1200}
        priority
        sizes="(min-width: 1180px) 22rem, 40vw"
        className="h-auto w-full select-none"
        draggable={false}
      />
      <Face rig={PRESENT} />
      <p
        data-a="hello"
        data-reveal
        dir="rtl"
        className="mh-hello-p absolute whitespace-nowrap rounded-[16px] rounded-br-[4px] bg-white px-4 py-2 text-[0.9375rem] font-semibold text-[var(--night)] sm:text-[1.0625rem]"
      >
        هلا والله!
      </p>
    </div>
  );
}
