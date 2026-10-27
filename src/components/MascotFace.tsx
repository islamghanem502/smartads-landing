import { useEffect, useRef } from "react";
import { gsap, reduced } from "../lib/gsap";

/* شاشة الوجه فاضية في صور الشخصية، والوجه مرسوم هنا فوقها: ثابت، والعيون بس ترمش.
   نفس الوجه في الهيرو وصفحة الدخول. يتحط فوق الصورة بنفس مقاسها (absolute inset-0).
   الأرقام بإحداثيات صورة الهيرو الأصلية (2048، مقصوصة من 183,110 بعرض 1802)، وشاشتها مايلة 6 درجات حول نصها (965,530).
   صورة ثانية: view مقاسها، وplace ينقل الوجه من نص شاشة الهيرو لنص شاشتها (ويميله ويصغّره). */
const VIEW = "183 110 1802 1802";
const TILT = "rotate(-6 965 530)";
const EYES = [{ x: 880, y: 520 }, { x: 1050, y: 520 }];
const EYE_R = 29;
const SMILE = "M925 578 C948 604 985 604 1007 578";

export function MascotFace({ view = VIEW, place = TILT }: { view?: string; place?: string }) {
  const svg = useRef<SVGSVGElement>(null);

  // العيون ترمش كل كم ثانية (ومرات رمشتين ورا بعض)
  useEffect(() => {
    if (reduced()) return;
    const eyes = gsap.utils.selector(svg.current)("[data-eye]");
    const blink = gsap.delayedCall(1.8, () => {
      gsap.to(eyes, { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: Math.random() < 0.2 ? 3 : 1, transformOrigin: "50% 50%", ease: "power1.inOut" });
      blink.delay(2.6 + Math.random() * 3.2).restart(true);
    });
    return () => {
      blink.kill();
    };
  }, []);

  return (
    <svg ref={svg} viewBox={view} aria-hidden className="pointer-events-none absolute inset-0 size-full">
      <g transform={place}>
        {EYES.map(({ x, y }) => (
          <g key={x} data-eye>
            <circle cx={x} cy={y} r={EYE_R} fill="#151618" />
            <ellipse cx={x - 9} cy={y - 11} rx={7.5} ry={5.5} fill="#fff" fillOpacity="0.35" />
          </g>
        ))}
        <path d={SMILE} fill="none" stroke="#151618" strokeWidth="16" strokeLinecap="round" />
      </g>
    </svg>
  );
}
