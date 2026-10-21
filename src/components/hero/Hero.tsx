"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { Header } from "@/components/Header";
import { SIGNUP_URL } from "@/lib/links";
import { Board } from "./Board";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const all = gsap.utils.toArray<HTMLElement>("[data-h]", ref.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { gsap.set(all, { opacity: 1 }); return; }
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo("[data-h=header]", { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo("[data-h=line]", { yPercent: 35, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12 }, 0.05)
      .fromTo("[data-h=fade]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.4);
  }, { scope: ref });

  return (
    <section ref={ref} className="board-grain relative overflow-x-clip">
      <Header />
      <div className="mx-auto max-w-[56rem] px-5 pt-8 text-center lg:pt-12">
        <p data-reveal data-h="fade" className="inline-flex items-center gap-2.5 text-[0.9375rem] text-chalk-soft">
          <span aria-hidden className="size-2 rounded-full bg-pin" />
          أول وكالة تسويق بالذكاء الاصطناعي في الوطن العربي
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.05rem,6.2vw,5rem)] font-extrabold leading-[1.25] text-chalk">
          <span data-reveal data-h="line" className="block">اربط متجرك،</span>
          <span data-reveal data-h="line" className="block">والتسويق كله علينا.</span>
        </h1>
        <p data-reveal data-h="fade" className="mx-auto mt-6 max-w-[34em] text-[1.125rem] leading-[1.85] text-chalk-soft">
          نسوي حملاتك، ونوصّل كل طلب من متجرك للمنصات الإعلانية، وننشر في حساباتك. فريق تسويق كامل يشتغل بالذكاء الاصطناعي كل يوم، وأنت تشوف كل خطوة.
        </p>
        <div data-reveal data-h="fade" className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <motion.a
            whileTap={{ scale: 0.97 }}
            href={SIGNUP_URL}
            className="inline-flex h-12 items-center rounded-[12px] bg-green px-7 font-display text-[1rem] font-semibold text-white transition-colors hover:bg-green-deep"
          >
            اربط متجرك
          </motion.a>
          <a href="#board" className="text-[1rem] text-chalk underline decoration-chalk/30 underline-offset-[7px] transition-colors hover:decoration-chalk">
            شوف وش نسوي
          </a>
        </div>
      </div>
      <div id="board" className="mt-16 scroll-mt-6 lg:mt-20">
        <Board />
      </div>
    </section>
  );
}
