"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";
import { SIGNUP_URL } from "@/lib/links";
import { Facebook, Google, Instagram, Meta, Salla, Snapchat, TikTok, Website, ZidMark } from "@/components/brand/logos";

type Svg = React.SVGProps<SVGSVGElement>;
type Brand = { L: (p: Svg) => React.ReactElement; n: string };

/* كل خدمة بأقل كلام، والمنصات بشعاراتها بس. التفاصيل في قسم الخدمات تحت. */
const SERVICES: { title: string; text: string; on: Brand[] }[] = [
  {
    title: "حملات إعلانية",
    text: "نطلقها ونحسّنها كل يوم",
    on: [{ L: Snapchat, n: "سناب شات" }, { L: TikTok, n: "تيك توك" }, { L: Meta, n: "ميتا" }, { L: Google, n: "قوقل" }],
  },
  {
    title: "منشورات وفيديوهات",
    text: "نصمّمها وننشرها لك",
    on: [{ L: Instagram, n: "انستقرام" }, { L: TikTok, n: "تيك توك" }, { L: Facebook, n: "فيسبوك" }],
  },
  {
    title: "سيو متجرك",
    text: "نرفعك في نتائج قوقل",
    on: [{ L: Google, n: "قوقل" }],
  },
];

const STORES: Brand[] = [
  { L: Salla, n: "سلة" },
  { L: ZidMark, n: "زد" },
  { L: Website, n: "موقعك الخاص" },
];

/** كلام يتلوّن بالتدرّج لما يمر عليه المؤشر، كلمة كلمة. */
function Ink({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="ink">{w}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

function Services() {
  return (
    <ul className="mh-services divide-y divide-white/10 border-y border-white/10">
      {SERVICES.map((s) => (
        <li key={s.title} data-a="service">
          <a href="#services" className="group flex items-center justify-between gap-5 py-5 sm:py-6">
            <div className="min-w-0">
              <h3 className="text-[1.125rem] font-semibold text-white sm:text-[1.25rem]">
                <span className="ink">{s.title}</span>
              </h3>
              <p className="mt-1 text-[0.9375rem] text-[#cfd3db]">{s.text}</p>
            </div>
            <ul className="flex shrink-0 gap-1.5 sm:gap-2" aria-label="المنصات">
              {s.on.map(({ L, n }) => (
                <li key={n} title={n} className="grid size-10 place-items-center rounded-[13px] bg-white transition-transform duration-300 group-hover:-translate-y-0.5 sm:size-12 sm:rounded-[15px]">
                  <L className="size-5 sm:size-6" />
                  <span className="sr-only">{n}</span>
                </li>
              ))}
            </ul>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* الوجه مرسوم فوق الصورة (والصورة نفسها بدون عيون ولا فم)، فيقدر يرمش ويلحق المؤشر ويبتسم.
   الأرقام بإحداثيات الصورة الأصلية 1920×1920. */
const SMILE = "M672 609 Q753 662 782 630";
const BIG_SMILE = "M664 602 Q752 694 790 624";

function Face() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el || reduced()) return;
    const eyes = el.querySelector<SVGGElement>("[data-eyes]")!;
    const mouth = el.querySelector<SVGPathElement>("[data-mouth]")!;
    const lids = el.querySelectorAll<SVGGElement>("[data-eye]");
    const ex = gsap.quickTo(eyes, "x", { duration: 0.45, ease: "power3" });
    const ey = gsap.quickTo(eyes, "y", { duration: 0.45, ease: "power3" });
    const mx = gsap.quickTo(mouth, "x", { duration: 0.6, ease: "power3" });

    // العيون تلحق المؤشر، على قد ما الشاشة تسمح
    const look = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const dx = e.clientX - (r.left + r.width * 0.39), dy = e.clientY - (r.top + r.height * 0.3);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 320);
      ex((dx / d) * 22 * k); ey((dy / d) * 14 * k); mx((dx / d) * 8 * k);
    };
    // يبتسم أكثر لما المؤشر على زر الربط
    const smile = (e: Event) => {
      const t = (e.target as Element).closest?.("[data-smile]");
      if (!t) return;
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
      <path data-mouth d={SMILE} fill="none" stroke="#151618" strokeWidth="16" strokeLinecap="round" />
    </svg>
  );
}

/** الشخصية: خط القص في صورتها يركب على حافة الشاشة اليسار، فجسمها برا الشاشة وتطلّ لداخل. */
function Mascot({ className = "" }: { className?: string }) {
  return (
    <div data-a="mascot" data-reveal className={`mh-mascot relative ${className}`}>
      <Image
        src="/landing/mascot-faceless.webp"
        alt="شخصية مسوّقك الذكي: روبوت أبيض لابس غترة وعقال، يطلّ من طرف الشاشة ويسلّم"
        width={1200}
        height={1200}
        priority
        sizes="(min-width: 1280px) 34vw, 78vw"
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

export function MascotHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const all = gsap.utils.toArray<HTMLElement>("[data-a]", ref.current);
    if (reduced()) { gsap.set(all, { opacity: 1 }); return; }
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo("[data-a=line]", { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12 }, 0.1)
      .fromTo("[data-a=fade]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.4)
      .fromTo("[data-a=service]", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 0.5)
      // تطلع من حافة الشاشة وتثبت
      .fromTo("[data-a=mascot]", { xPercent: -45, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.1, ease: "back.out(1.3)" }, 0.7)
      .fromTo("[data-a=hello]", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.2)" }, 1.6);
  }, { scope: ref });

  return (
    <section ref={ref} className="mh relative overflow-x-clip pt-24 xl:pt-28">
      <div className="mx-auto grid min-h-[calc(100svh-9rem)] max-w-[78rem] items-center gap-x-12 px-4 pb-12 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_auto]">
        {/* الكلام: يمين */}
        <div className="max-w-[35rem]">
          <h1 className="text-[clamp(2.15rem,3.6vw,3.5rem)] font-bold leading-[1.3]">
            <span data-reveal data-a="line" className="block">
              <Ink text="وكالة تسويق" />{" "}
              <span className="mh-chip">كاملة</span>،
            </span>
            <span data-reveal data-a="line" className="block">
              <Ink text="بدون ما توظّف أحد." />
            </span>
          </h1>
          <p data-reveal data-a="fade" className="mt-5 text-[1.0625rem] font-semibold leading-[1.7] text-white sm:text-[1.1875rem]">
            <Ink text="يشغّلها الذكاء الاصطناعي، والأولى من نوعها في الوطن العربي" />
          </p>
          <div data-reveal data-a="fade" className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <motion.a
              data-smile
              whileTap={{ scale: 0.97 }}
              href={SIGNUP_URL}
              className="inline-flex h-12 items-center rounded-[14px] bg-white px-7 text-[1rem] font-semibold text-[var(--night)] transition-colors hover:bg-[#e9eaee]"
            >
              اربط متجرك
            </motion.a>
            <a href="#services" className="text-[1rem] text-white underline decoration-white/40 underline-offset-[7px] transition-colors hover:decoration-white">
              شوف وش نسوي
            </a>
          </div>
          <div data-reveal data-a="fade" className="mt-9">
            <p className="text-[0.9375rem] font-medium text-white">نشتغل مع متجرك على</p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {STORES.map(({ L, n }) => (
                <li key={n} className="flex h-12 items-center gap-2.5 rounded-full bg-white ps-3 pe-4 text-[0.9375rem] font-semibold text-[var(--card-ink)]">
                  <span className="grid size-8 place-items-center rounded-full bg-[#f2f3f6]"><L className="size-5" /></span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* الجوال والتابلت: الشخصية تطلّ من حافة الشاشة فوق الخدمات */}
        <div className="mh-bleed mt-12 xl:hidden">
          <Mascot />
        </div>

        {/* الخدمات: يسار، وتبعد عن الشخصية بقدر ما تاخذ من الشاشة */}
        <div className="mh-col">
          <Services />
        </div>
      </div>

      {/* الشاشة العريضة: الشخصية لاصقة في حافة الشاشة اليسار، في نص الهيرو */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center pt-20 xl:flex">
        <Mascot />
      </div>
    </section>
  );
}
