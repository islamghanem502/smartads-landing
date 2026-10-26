import { useEffect, useRef } from "react";
import { gsap, reduced } from "../../lib/gsap";

/* شاشة الوجه فاضية في الصورة، والوجه مرسوم هنا فوقها عشان يرمش ويلحق المؤشر ويبتسم.
   الأرقام بإحداثيات الصورة الأصلية (2048، مقصوصة من 183,110 بعرض 1802)، والشاشة مايلة 6 درجات حول نصها. */
const VIEW = "183 110 1802 1802";
const TILT = "rotate(-6 965 530)";
const EYES = [{ x: 880, y: 520 }, { x: 1050, y: 520 }];
const EYE_R = 29;
const SMILE = "M925 578 C948 604 985 604 1007 578";
const BIG_SMILE = "M918 572 C944 618 990 618 1014 572";
const FACE_AT = { x: 0.434, y: 0.233 }; // نص الوجه كنسبة من الصورة، منه نحسب وين يطالع

/** الشخصية واقفة وتمدّ يدها للشجرة، كأنها تقول: هذا اللي نسويه لك. */
export function Mascot({ className = "" }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current!;
    if (reduced()) return;
    const q = gsap.utils.selector(el);
    const mouth = q("[data-mouth]");
    // الوجه كله يتحرك مع النظرة، والعيون شوي زيادة: كذا يبان إنه يلف راسه مو بس عيونه
    const fx = gsap.quickTo(q("[data-face]"), "x", { duration: 0.5, ease: "power3" });
    const fy = gsap.quickTo(q("[data-face]"), "y", { duration: 0.5, ease: "power3" });
    const ex = gsap.quickTo(q("[data-eyes]"), "x", { duration: 0.4, ease: "power3" });
    const ey = gsap.quickTo(q("[data-eyes]"), "y", { duration: 0.4, ease: "power3" });

    const look = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width * FACE_AT.x), dy = e.clientY - (r.top + r.height * FACE_AT.y);
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
    const blink = gsap.delayedCall(1.8, () => {
      gsap.to(q("[data-eye]"), { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: Math.random() < 0.2 ? 3 : 1, transformOrigin: "50% 50%", ease: "power1.inOut" });
      blink.delay(2.6 + Math.random() * 3.2).restart(true);
    });

    addEventListener("pointermove", look, { passive: true });
    document.addEventListener("pointerover", smile);
    document.addEventListener("pointerout", smile);
    return () => {
      removeEventListener("pointermove", look);
      document.removeEventListener("pointerover", smile);
      document.removeEventListener("pointerout", smile);
      blink.kill();
    };
  }, []);

  return (
    <div data-a="mascot" data-reveal className={`relative shrink-0 ${className}`}>
      <img
        src="/mascot.webp"
        alt="شخصية مسوّقك الذكي: روبوت أبيض لابس غترة وعقال، واقف ويأشّر بيده على خدماتنا"
        width={1200}
        height={1200}
        fetchPriority="high"
        draggable={false}
        className="h-auto w-full select-none"
      />
      <svg ref={svg} viewBox={VIEW} aria-hidden className="pointer-events-none absolute inset-0 size-full">
        <g transform={TILT}>
          <g data-face>
            <g data-eyes>
              {EYES.map(({ x, y }) => (
                <g key={x} data-eye>
                  <circle cx={x} cy={y} r={EYE_R} fill="#151618" />
                  <ellipse cx={x - 9} cy={y - 11} rx={7.5} ry={5.5} fill="#fff" fillOpacity="0.35" />
                </g>
              ))}
            </g>
            <path data-mouth d={SMILE} fill="none" stroke="#151618" strokeWidth="16" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      <p data-a="hello" data-reveal className="absolute left-[-6%] top-[-3%] whitespace-nowrap rounded-[16px] rounded-br-[4px] bg-white px-4 py-2 text-[0.9375rem] font-semibold text-night sm:text-[1.0625rem]">
        هلا والله!
      </p>
    </div>
  );
}
