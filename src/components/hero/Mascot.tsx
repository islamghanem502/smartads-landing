import { useEffect, useRef } from "react";
import { gsap, reduced } from "../../lib/gsap";

/* شاشة الوجه فاضية في الصورة، والوجه مرسوم هنا فوقها عشان يرمش.
   الأرقام بإحداثيات الصورة الأصلية (2048، مقصوصة من 183,110 بعرض 1802)، والشاشة مايلة 6 درجات حول نصها. */
const VIEW = "183 110 1802 1802";
const TILT = "rotate(-6 965 530)";
const EYES = [{ x: 880, y: 520 }, { x: 1050, y: 520 }];
const EYE_R = 29;
const SMILE = "M925 578 C948 604 985 604 1007 578";

/** الشخصية واقفة وتمدّ يدها لكرت الفريق، كأنها تقول: هذا فريقك. */
export function Mascot({ className = "" }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);

  // الوجه ثابت في مكانه، والعيون بس ترمش كل كم ثانية (ومرات رمشتين ورا بعض)
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
    <div data-a="mascot" data-reveal className={`mascot-ground relative shrink-0 ${className}`}>
      <img
        src="/mascot.webp"
        alt="شخصية مسوّقك الذكي: روبوت أبيض لابس غترة وعقال، واقف ويأشّر بيده على فريقك التسويقي"
        width={1200}
        height={1200}
        fetchPriority="high"
        draggable={false}
        className="h-auto w-full select-none"
      />
      <svg ref={svg} viewBox={VIEW} aria-hidden className="pointer-events-none absolute inset-0 size-full">
        <g transform={TILT}>
          <g>
            <g>
              {EYES.map(({ x, y }) => (
                <g key={x} data-eye>
                  <circle cx={x} cy={y} r={EYE_R} fill="#151618" />
                  <ellipse cx={x - 9} cy={y - 11} rx={7.5} ry={5.5} fill="#fff" fillOpacity="0.35" />
                </g>
              ))}
            </g>
            <path d={SMILE} fill="none" stroke="#151618" strokeWidth="16" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      <p data-a="hello" data-reveal className="absolute left-[-6%] top-[-3%] whitespace-nowrap rounded-[16px] rounded-br-[4px] bg-white px-4 py-2 text-[0.9375rem] font-semibold text-night sm:text-[1.0625rem]">
        هلا والله!
      </p>
    </div>
  );
}
