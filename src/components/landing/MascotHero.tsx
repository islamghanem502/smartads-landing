"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";
import { SIGNUP_URL } from "@/lib/links";
import { Facebook, Google, Instagram, Meta, Salla, Snapchat, TikTok, Website, Zid } from "@/components/brand/logos";

type Svg = React.SVGProps<SVGSVGElement>;
const icon = (d: string) => function Icon(p: Svg) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
      <path d={d} />
    </svg>
  );
};
const Megaphone = icon("M4 10.2v3.6c0 .7.5 1.2 1.2 1.2H7l5 4V5L7 9H5.2C4.5 9 4 9.5 4 10.2ZM16 9.2a4 4 0 0 1 0 5.6M18.6 6.6a7.6 7.6 0 0 1 0 10.8");
const Media = icon("M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5ZM10.2 9.3v5.4l4.6-2.7Z");
const Search = icon("M10.8 4a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6ZM20 20l-4.4-4.4M7.8 12.6l2-2 1.8 1.4 2.6-3");

const SERVICES = [
  {
    title: "الحملات الإعلانية",
    text: "نجهّز الإعلان والجمهور والميزانية، ونطلق الحملة ونتابعها كل يوم.",
    Icon: Megaphone,
    on: [{ L: Snapchat, n: "سناب شات" }, { L: TikTok, n: "تيك توك" }, { L: Meta, n: "ميتا" }, { L: Google, n: "قوقل" }],
  },
  {
    title: "المنشورات والفيديوهات",
    text: "نصمّمها بهوية متجرك، وننشرها في حساباتك بوقتها.",
    Icon: Media,
    on: [{ L: Instagram, n: "انستقرام" }, { L: TikTok, n: "تيك توك" }, { L: Facebook, n: "فيسبوك" }],
  },
  {
    title: "سيو متجرك",
    text: "نرفع منتجاتك في نتايج قوقل، ونكتب وصفها بالكلمات اللي يدوّر عليها عميلك.",
    Icon: Search,
    on: [{ L: Google, n: "قوقل" }, { L: Salla, n: "سلة" }, { L: Zid, n: "زد" }],
  },
];

function ServiceCard({ s }: { s: (typeof SERVICES)[number] }) {
  return (
    <motion.article
      data-a="card"
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="rounded-[18px] bg-white p-4 text-[var(--card-ink)] sm:rounded-[20px] sm:p-5"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#f2f3f6] sm:size-10">
          <s.Icon className="size-[1.15rem] sm:size-5" />
        </span>
        <h3 className="text-[0.9375rem] font-semibold leading-snug sm:text-[1.0625rem]">{s.title}</h3>
      </div>
      <p className="mt-2 text-[0.8125rem] leading-[1.65] text-[var(--card-soft)] sm:text-[0.9375rem]">{s.text}</p>
      <ul className="mt-3 flex items-center gap-1.5 border-t border-[var(--card-line)] pt-3 sm:mt-4 sm:gap-2" aria-label="المنصات">
        {s.on.map(({ L, n }) => (
          <li key={n} title={n} className="grid size-7 place-items-center rounded-full bg-[#f2f3f6] sm:size-8">
            <L className={L === Zid ? "w-5" : "size-4 sm:size-[1.1rem]"} />
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function MascotHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const all = gsap.utils.toArray<HTMLElement>("[data-a]", ref.current);
    if (reduced()) { gsap.set(all, { opacity: 1 }); return; }
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo("[data-a=line]", { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12 }, 0.1)
      .fromTo("[data-a=fade]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.4)
      .fromTo("[data-a=panel]", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.25)
      .fromTo("[data-a=card]", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 0.45)
      // الشخصية تطلّ من ورا اللوحة، وبعدين تسلّم
      .fromTo("[data-a=mascot]", { xPercent: -16, rotate: -5, opacity: 0 }, { xPercent: 0, rotate: 0, opacity: 1, duration: 1, ease: "back.out(1.5)" }, 0.75)
      .fromTo("[data-a=hello]", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.2)" }, 1.55);
    tl.add(() => {
      gsap.to("[data-a=mascot]", { y: -7, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative overflow-x-clip pt-28 lg:pt-32">
      <div className="mx-auto grid min-h-[calc(100svh-8rem)] max-w-[78rem] items-center gap-14 px-4 pb-16 sm:px-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-10 lg:px-8">
        {/* الكلام: يمين */}
        <div className="max-w-[34rem]">
          <h1 className="text-[clamp(2.2rem,3.7vw,3.6rem)] font-bold leading-[1.25]">
            <span data-reveal data-a="line" className="block">وكالتك التسويقية،</span>
            <span data-reveal data-a="line" className="block">تحت أمرك.</span>
          </h1>
          <p data-reveal data-a="fade" className="mt-6 max-w-[31em] text-[1.0625rem] leading-[1.9] text-[var(--fog)] sm:text-[1.125rem]">
            اربط متجرك أو موقعك، وهي تتكفّل بالباقي: تطلق حملاتك، وتصمّم منشوراتك وفيديوهاتك وتنشرها، وترفع ظهورك في قوقل. تداوم كل يوم، وما تاخذ إجازة.
          </p>
          <div data-reveal data-a="fade" className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <motion.a
              whileTap={{ scale: 0.97 }}
              href={SIGNUP_URL}
              className="inline-flex h-12 items-center rounded-[14px] bg-white px-7 text-[1rem] font-semibold text-[var(--night)] transition-colors hover:bg-[#e9eaee]"
            >
              اربط متجرك
            </motion.a>
            <a href="#services" className="text-[1rem] text-white underline decoration-white/30 underline-offset-[7px] transition-colors hover:decoration-white">
              شوف وش نسوي
            </a>
          </div>
          <div data-reveal data-a="fade" className="mt-10 flex items-center gap-3 text-[0.875rem] text-[var(--fog)]">
            يشتغل مع
            <span className="flex items-center gap-2">
              {[{ L: Salla, n: "سلة", c: "size-4" }, { L: Zid, n: "زد", c: "w-5" }, { L: Website, n: "موقعك الخاص", c: "size-[1.1rem]" }].map(({ L, n, c }) => (
                <span key={n} title={n} className="grid size-8 place-items-center rounded-full bg-white"><L className={c} /></span>
              ))}
            </span>
          </div>
        </div>

        {/* اللوحة والشخصية: يسار. الشخصية ماسكة حافة اللوحة وجسمها وراها */}
        <div id="services" className="mh-stage relative mx-auto scroll-mt-28 xl:mx-0" dir="ltr">
          <div
            data-a="panel"
            data-reveal
            dir="rtl"
            className="mh-panel relative z-0 grid gap-2.5 bg-[var(--night-2)] p-2.5 ring-1 ring-[var(--line)] sm:gap-3 sm:p-3"
          >
            {SERVICES.map((s) => <ServiceCard key={s.title} s={s} />)}
          </div>
          <div data-a="mascot" data-reveal className="mh-mascot pointer-events-none absolute z-10">
            <Image
              src="/landing/mascot.webp"
              alt="شخصية مسوّقك الذكي: روبوت أبيض لابس غترة وعقال، ماسك طرف اللوحة ويسلّم"
              width={1200}
              height={1200}
              priority
              sizes="(min-width: 1024px) 33rem, (min-width: 640px) 26rem, 60vw"
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
        </div>
      </div>
    </section>
  );
}
