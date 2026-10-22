"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";
import { SIGNUP_URL } from "@/lib/links";
import { Facebook, Google, Instagram, Meta, Salla, Snapchat, TikTok, Website, ZidMark } from "@/components/brand/logos";

type Svg = React.SVGProps<SVGSVGElement>;
type Brand = { L: (p: Svg) => React.ReactElement; n: string };

/* كل خدمة بأقل كلام، والمنصات بشعاراتها بس */
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

function Services() {
  return (
    <ul className="mh-services divide-y divide-white/10 border-y border-white/10">
      {SERVICES.map((s) => (
        <li key={s.title} data-a="service" className="flex items-center justify-between gap-5 py-5 sm:py-6">
          <div className="min-w-0">
            <h3 className="text-[1.125rem] font-semibold text-white sm:text-[1.25rem]">{s.title}</h3>
            <p className="mt-1 text-[0.9375rem] text-[#cfd3db]">{s.text}</p>
          </div>
          <ul className="flex shrink-0 gap-1.5 sm:gap-2" aria-label="المنصات">
            {s.on.map(({ L, n }) => (
              <li key={n} title={n} className="grid size-10 place-items-center rounded-[13px] bg-white sm:size-12 sm:rounded-[15px]">
                <L className="size-5 sm:size-6" />
                <span className="sr-only">{n}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/** الشخصية: خط القص في صورتها يركب على حافة الشاشة اليسار، فجسمها برا الشاشة وتطلّ لداخل. */
function Mascot({ className = "" }: { className?: string }) {
  return (
    <div data-a="mascot" data-reveal className={`mh-mascot relative ${className}`}>
      <Image
        src="/landing/mascot.webp"
        alt="شخصية مسوّقك الذكي: روبوت أبيض لابس غترة وعقال، يطلّ من طرف الشاشة ويسلّم"
        width={1200}
        height={1200}
        priority
        sizes="(min-width: 1280px) 34vw, 60vw"
        className="h-auto w-full select-none"
        draggable={false}
      />
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
    <section ref={ref} className="mh relative overflow-x-clip pt-28 xl:pt-32">
      <div className="mx-auto grid min-h-[calc(100svh-8rem)] max-w-[78rem] items-center gap-x-12 px-4 pb-16 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_auto]">
        {/* الكلام: يمين */}
        <div className="max-w-[35rem]">
          <h1 className="text-[clamp(2.15rem,3.6vw,3.5rem)] font-bold leading-[1.3]">
            <span data-reveal data-a="line" className="block">
              وكالة تسويق{" "}
              <span className="mh-chip">كاملة</span>،
            </span>
            <span data-reveal data-a="line" className="block">بدون ما توظّف أحد.</span>
          </h1>
          <p data-reveal data-a="fade" className="mt-5 text-[1.0625rem] font-semibold leading-[1.7] text-white sm:text-[1.1875rem]">
            أول وكالة تسويق في الوطن العربي يشغّلها الذكاء الاصطناعي.
          </p>
          <p data-reveal data-a="fade" className="mt-3 max-w-[31em] text-[1.0625rem] leading-[1.9] text-[#dfe2e8] sm:text-[1.125rem]">
            اربط متجرك أو موقعك، وإحنا نطلق حملاتك، ونصمّم منشوراتك وفيديوهاتك وننشرها، ونرفع ظهورك في قوقل. كل يوم، وبدون إجازات.
          </p>
          <div data-reveal data-a="fade" className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <motion.a
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
        <div className="mh-bleed mt-14 xl:hidden">
          <Mascot />
        </div>

        {/* الخدمات: يسار، وتبعد عن الشخصية بقدر ما تاخذ من الشاشة */}
        <div id="services" className="mh-col scroll-mt-28">
          <Services />
        </div>
      </div>

      {/* الشاشة العريضة: الشخصية لاصقة في حافة الشاشة اليسار، في نص الهيرو */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center pt-24 xl:flex">
        <Mascot />
      </div>
    </section>
  );
}
