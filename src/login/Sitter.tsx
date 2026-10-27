import { useEffect, useRef } from "react";
import { gsap, reduced } from "../lib/gsap";

/*
 * الشخصية قاعدة على حافة كرت الدخول ورجولها متدلية عليه، وتكلّم التاجر من فقاعة جنبها.
 * شاشة الوجه فاضية في الصورتين، والوجه مرسوم هنا فوقها: ثابت، والعيون بس ترمش (مثل الهيرو).
 *   wave   تأشّر بيدها (ترحّب، أو دخل ونوديه للوحة)
 *   calm   يدها على الحافة
 *   sad    نفس calm وتهز راسها (كلمة مرور غلط أو أي خطأ)
 * الصورتين بنفس الوضعية والمكان بالضبط، والفرق اليد بس، فنبدّل بينهم بشفافية.
 * الأرقام بإحداثيات الصورة (1200×1200).
 */
export type Mood = "wave" | "calm" | "sad";

const SIZE = 1200;
/* الشاشة من 480 لين 735 بالعرض، ومن 275 لين 432 بالطول. الوجه بنفس نسب وجه الهيرو */
const EYES = [{ x: 565, y: 343 }, { x: 649, y: 343 }];
const EYE_R = 14;
const SMILE = "M587 372 Q607 392 627 372";

export function Sitter({ mood, say }: { mood: Mood; say: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const waving = mood === "wave";

  // ترمش كل كم ثانية (ومرات رمشتين ورا بعض)
  useEffect(() => {
    if (reduced()) return;
    const eyes = gsap.utils.selector(svg.current)("[data-eye]");
    const blink = gsap.delayedCall(1.6, () => {
      gsap.to(eyes, { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: Math.random() < 0.2 ? 3 : 1, transformOrigin: "50% 50%", ease: "power1.inOut" });
      blink.delay(2.4 + Math.random() * 3).restart(true);
    });
    return () => {
      blink.kill();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute end-4 top-0 w-[9rem] -translate-y-[64%] select-none sm:end-6 sm:w-[11rem]">
      {/* key: كل خطأ جديد يعيد هزة الراس */}
      <div key={mood === "sad" ? say : undefined} className={mood === "sad" ? "oops" : ""}>
        <div className="relative aspect-square">
          <img src="/login/sit-rest.webp" alt="" width={480} height={480} className={`absolute inset-0 size-full transition-opacity duration-300 ${waving ? "opacity-0" : ""}`} />
          <img src="/login/sit-wave.webp" alt="" width={480} height={480} className={`absolute inset-0 size-full transition-opacity duration-300 ${waving ? "" : "opacity-0"}`} />
          <svg ref={svg} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="absolute inset-0 size-full">
            {EYES.map(({ x, y }) => (
              <g key={x} data-eye>
                <circle cx={x} cy={y} r={EYE_R} fill="#151618" />
                <ellipse cx={x - 4.3} cy={y - 5.3} rx={3.6} ry={2.6} fill="#fff" fillOpacity="0.35" />
              </g>
            ))}
            <path d={SMILE} fill="none" stroke="#151618" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* الفقاعة: هي نفسها رسالة الخطأ، فقارئ الشاشة يقرأها */}
      <p
        role="status"
        aria-live="polite"
        className="absolute left-[82%] top-[2%] w-max max-w-[min(14rem,calc(100vw-11.5rem))] rounded-[16px] rounded-bl-[4px] bg-white px-3.5 py-2 text-[0.875rem] font-semibold leading-[1.5] text-night shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] sm:text-[0.9375rem]"
      >
        {say}
      </p>
    </div>
  );
}

