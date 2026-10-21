"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HairlineFigure } from "@/lib/hairline/Figure";
import * as publish from "@/lib/hairline/figures/publish";
import { Facebook, Instagram, TikTok } from "@/components/brand/logos";
import { Hand } from "@/components/ui/Hand";
import { Mark } from "@/components/ui/Mark";
import { H2, Section } from "@/components/ui/Section";

const ACCOUNTS = [
  { name: "انستقرام", L: Instagram, base: 12 },
  { name: "تيك توك", L: TikTok, base: 9 },
  { name: "فيسبوك", L: Facebook, base: 7 },
];

const POINTS = [
  { title: "صور وفيديو بهوية متجرك", text: "من صور منتجاتك وألوانك، بدون مصمم ولا مصوّر." },
  { title: "جدول نشر للشهر كله", text: "منشورات المواسم والعروض جاهزة قبل وقتها." },
  { title: "توافق بضغطة", text: "تشوف المنشور قبل ما ينزل، أو تخلينا ننشر على طول." },
  { title: "نرد على التعليقات", text: "نجاوب أسئلة عملائك في التعليقات والرسائل باسم متجرك." },
];

const n = (v: number) => v.toLocaleString("ar-SA");

export function Publish() {
  const [counts, setCounts] = useState(ACCOUNTS.map((a) => a.base));
  const [last, setLast] = useState<{ i: number; kind: string; key: number } | null>(null);

  /* كل ما طار منشور من الصينية، يوصل للحساب اللي عليه الدور */
  const onRead = useCallback((r: string) => {
    if (r === "rest") return;
    const [c, kind] = r.split(":");
    const i = (Number(c) - 1) % ACCOUNTS.length;
    setCounts((cs) => cs.map((v, k) => (k === i ? v + 1 : v)));
    setLast({ i, kind, key: Number(c) });
  }, []);

  return (
    <Section id="publish" theme="dark">
      <div className="mx-auto grid max-w-[80rem] items-center gap-16 px-5 py-28 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-36">
        <div className="max-w-[36rem]">
          <H2>
            ننشر في حساباتك، <Mark>كل يوم</Mark>.
          </H2>
          <p className="mt-5 text-[1.0625rem] leading-[1.9] text-chalk-soft">
            نكتب المنشور ونصمّم الصورة والفيديو بهوية متجرك، وننشرها في انستقرام وتيك توك وفيسبوك في الوقت اللي يتفاعل فيه جمهورك.
          </p>
          <dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {POINTS.map((p) => (
              <div key={p.title} className="border-t border-white/12 pt-4">
                <dt className="font-display text-[1.0625rem] font-bold text-chalk">{p.title}</dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-[1.75] text-chalk-soft">{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          {/* الحسابات: كل منشور يطير من الصينية يوصل لواحد منها */}
          <ul className="relative z-10 mx-auto flex max-w-[30rem] justify-center gap-8 sm:gap-12">
            {ACCOUNTS.map(({ name, L }, i) => (
              <li key={name} className="relative flex flex-col items-center gap-2">
                <motion.span
                  animate={last?.i === i ? { scale: [1, 1.14, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  key={last?.i === i ? last.key : `s${i}`}
                  className={`grid size-16 place-items-center rounded-full bg-white ring-4 ${last?.i === i ? "ring-green-on-dark" : "ring-white/10"}`}
                >
                  <L className="size-8" />
                </motion.span>
                <span className="text-[0.875rem] text-chalk">{name}</span>
                <span className="text-[0.8125rem] tabular-nums text-chalk-soft">{n(counts[i])} منشور</span>
                <AnimatePresence>
                  {last?.i === i && (
                    <motion.span
                      key={last.key}
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                      className="absolute -top-10 whitespace-nowrap rounded-full bg-green px-3 py-1 font-display text-[0.75rem] font-semibold text-white"
                    >
                      {last.kind === "vid" ? "نزل فيديو" : "نزل منشور"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
          <div className="pointer-events-none absolute left-[2%] top-[36%] hidden flex-col items-center sm:flex">
            <Hand shape="arrowUp" className="size-16 -scale-x-100 text-chalk-soft" width={1.8} />
            <p className="mt-1 font-hand text-[1.25rem] text-chalk-soft">ينزل لحاله</p>
          </div>
          <div className="hl-dark -mt-4">
            <HairlineFigure engine={publish.mount} value={1} label="صينية منشورات ملوّنة، صور وفيديو، وكل شوي يطلع منشور منها لحسابك" onRead={onRead} className="mx-auto w-full max-w-[36rem]" />
          </div>
        </div>
      </div>
    </Section>
  );
}
