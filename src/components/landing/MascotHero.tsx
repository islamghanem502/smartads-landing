"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";
import { SIGNUP_URL } from "@/lib/links";
import { Salla, Website, ZidMark } from "@/components/brand/logos";
import { Mascot, Presenter } from "./Mascot";
import { ServiceTree } from "./ServiceTree";

type Svg = React.SVGProps<SVGSVGElement>;

const STORES: { L: (p: Svg) => React.ReactElement; n: string }[] = [
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

/*
 * التخطيط على حسب العرض الفعلي (يعني بعد الزوم):
 *   الجوال: الكلام، بعده الشخصية تطلّ من حافة الشاشة، بعدها الشجرة وجذرها راس الشخصية.
 *   من 640: تحت الكلام الشجرة، وجنبها الشخصية واقفة تقدّمها.
 *   من 1024: عمودين، الكلام يمين بعرضه، والشجرة في نص اللي باقي.
 *   من 1180 (يعني 1366 على زوم 110٪): ترجع الشخصية الواقفة جنب الشجرة.
 */
export function MascotHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const all = gsap.utils.toArray<HTMLElement>("[data-a]", ref.current);
    if (reduced()) { gsap.set(all, { opacity: 1 }); return; }
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo("[data-a=line]", { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12 }, 0.1)
      .fromTo("[data-a=fade]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.4)
      .fromTo("[data-a=tree]", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.45)
      // تطلع من حافة الشاشة وتثبت
      .fromTo("[data-a=mascot]", { xPercent: -45, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.1, ease: "back.out(1.3)" }, 0.7)
      // تدخل من جنب الشجرة وتمدّ يدها
      .fromTo("[data-a=presenter]", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "back.out(1.4)" }, 0.75)
      .fromTo("[data-a=hello]", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.2)" }, 1.6);
  }, { scope: ref });

  return (
    <section ref={ref} className="mh relative overflow-x-clip pt-24 lg:pt-28">
      <div className="mh-grid mx-auto grid max-w-[78rem] items-center gap-x-10 px-4 pb-14 sm:px-6 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-[auto_minmax(0,1fr)] lg:px-8">
        {/* الكلام: يمين */}
        <div className="max-w-[34rem]">
          <h1 className="mh-h1 font-bold leading-[1.3]">
            <span data-reveal data-a="line" className="block">
              <Ink text="وكالة تسويق" />{" "}
              <span className="mh-chip">كاملة</span>،
            </span>
            <span data-reveal data-a="line" className="block">
              <Ink text="بدون ما توظّف أحد." />
            </span>
          </h1>
          <p data-reveal data-a="fade" className="mt-4 text-[1.0625rem] font-semibold leading-[1.7] text-white lg:text-[1.125rem]">
            <Ink text="يشغّلها الذكاء الاصطناعي، والأولى من نوعها في الوطن العربي" />
          </p>
          <div data-reveal data-a="fade" className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
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
          <div data-reveal data-a="fade" className="mt-8">
            <p className="text-[0.9375rem] font-medium text-white">نشتغل مع متجرك على</p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {STORES.map(({ L, n }) => (
                <li key={n} className="flex h-11 items-center gap-2.5 rounded-full bg-white ps-2.5 pe-4 text-[0.9375rem] font-semibold text-[var(--card-ink)]">
                  <span className="grid size-7 place-items-center rounded-full bg-[#f2f3f6]"><L className="size-[1.1rem]" /></span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* الجوال: الشخصية تطلّ من حافة الشاشة فوق الشجرة */}
        <div className="mh-bleed mt-12 sm:hidden">
          <Mascot />
        </div>

        {/* الشجرة: يسار */}
        {/* الشجرة، وجنبها الشخصية واقفة تأشّر عليها (ما عدا الجوال، وما بين 1024 و1180 لأن المكان ما يكفي) */}
        <div className="mt-2 flex items-center justify-between gap-4 sm:mt-12 lg:mt-0 lg:justify-center">
          <ServiceTree />
          <Presenter />
        </div>
      </div>
    </section>
  );
}
