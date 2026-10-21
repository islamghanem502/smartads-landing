"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";
import { Mark } from "@/components/ui/Mark";
import { SIGNUP_URL } from "@/lib/links";
import { ConnectBoard } from "./ConnectBoard";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const all = gsap.utils.toArray<HTMLElement>("[data-h]", ref.current);
    if (reduced()) { gsap.set(all, { opacity: 1 }); return; }
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo("[data-h=line]", { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12 }, 0.1)
      .fromTo("[data-h=fade]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.4);
  }, { scope: ref });

  return (
    <section id="top" data-theme="dark" ref={ref} className="board-grain relative overflow-x-clip bg-board pt-28 lg:pt-32">
      <div className="mx-auto grid max-w-[80rem] items-center gap-14 px-5 pb-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8 lg:px-8 lg:pb-28">
        <div className="max-w-[36rem]">
          <h1 className="font-display text-[clamp(2.15rem,3.75vw,3.6rem)] font-extrabold leading-[1.28] text-chalk">
            <span data-reveal data-h="line" className="block">اربط متجرك،</span>
            <span data-reveal data-h="line" className="block">
              والتسويق <Mark>كله علينا</Mark>.
            </span>
          </h1>
          <p data-reveal data-h="fade" className="mt-6 font-display text-[clamp(1rem,1.3vw,1.125rem)] font-semibold leading-[1.7] text-chalk">
            أول وكالة تسويق في الوطن العربي يشغّلها الذكاء الاصطناعي.
          </p>
          <p data-reveal data-h="fade" className="mt-3 max-w-[32em] text-[1.0625rem] leading-[1.9] text-chalk-soft">
            من سلة أو زد أو موقعك الخاص: نطلق حملاتك على سناب وتيك توك وميتا وقوقل، ونوصّل لها كل طلب من متجرك، وننشر في انستقرام وتيك توك وفيسبوك. وأنت تتابع كل خطوة.
          </p>
          <div data-reveal data-h="fade" className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <motion.a
              whileTap={{ scale: 0.97 }}
              href={SIGNUP_URL}
              className="inline-flex h-12 items-center rounded-[12px] bg-green px-7 font-display text-[1rem] font-semibold text-white transition-colors hover:bg-green-deep"
            >
              اربط متجرك
            </motion.a>
            <a href="#how" className="text-[1rem] text-chalk underline decoration-chalk/30 underline-offset-[7px] transition-colors hover:decoration-chalk">
              كيف نشتغل
            </a>
          </div>
          <p data-reveal data-h="fade" className="mt-6 text-[0.875rem] text-chalk-soft">بدون التزام، وتلغي بضغطة.</p>
        </div>
        <ConnectBoard />
      </div>
    </section>
  );
}
