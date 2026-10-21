"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HairlineFigure } from "@/lib/hairline/Figure";
import * as mailboxes from "@/lib/hairline/figures/mailboxes";
import { Google, Meta, Snapchat, TikTok } from "@/components/brand/logos";
import { Mark } from "@/components/ui/Mark";
import { H2, Section } from "@/components/ui/Section";

const PLATFORMS = [
  { name: "سناب شات", L: Snapchat },
  { name: "تيك توك", L: TikTok },
  { name: "ميتا", L: Meta },
  { name: "قوقل", L: Google },
];

/* أمثلة لخطوات عملاء في متجر. قوقل ياخذ الشراء بس، والباقي ياخذون كل خطوة. */
const SAMPLE = [
  { verb: "اشترى", item: "عطر عود، ١٠٠ مل", buy: true },
  { verb: "أضاف للسلة", item: "عباية كريب سوداء", buy: false },
  { verb: "بدأ الدفع", item: "طقم فناجين قهوة", buy: false },
  { verb: "زار صفحة", item: "ساعة يد كلاسيك", buy: false },
  { verb: "اشترى", item: "دهن عود ملكي", buy: true },
  { verb: "أضاف للسلة", item: "بخور معطّر", buy: false },
];

function Feed() {
  const [rows, setRows] = useState(() => SAMPLE.slice(0, 3).map((r, i) => ({ ...r, key: i })));
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 3, t = 0, on = false;
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; });
    io.observe(box.current!);
    t = window.setInterval(() => {
      if (!on) return;
      const r = SAMPLE[n % SAMPLE.length];
      setRows((rs) => [{ ...r, key: n }, ...rs].slice(0, 3));
      n++;
    }, 2400);
    return () => { clearInterval(t); io.disconnect(); };
  }, []);

  return (
    <div ref={box} className="mt-10">
      <p className="mb-3 font-hand text-[1.25rem] text-chalk-soft">مثال من متجر، لحظة بلحظة</p>
      <ul className="grid gap-2.5">
        <AnimatePresence initial={false}>
          {rows.map((r) => (
            <motion.li
              key={r.key}
              layout
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="flex items-center justify-between gap-4 rounded-[12px] bg-board-2 px-4 py-3 ring-1 ring-white/8"
            >
              <span className="min-w-0 truncate text-[0.9375rem]">
                <b className={`font-display font-semibold ${r.buy ? "text-green-on-dark" : "text-chalk"}`}>{r.verb}</b>
                <span className="text-chalk-soft"> {r.item}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                {PLATFORMS.map(({ name, L }, i) => {
                  const got = r.buy || i < 3;
                  return (
                    <motion.span
                      key={name}
                      title={got ? `وصل ${name}` : `${name} ياخذ الشراء بس`}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: got ? 1 : 0.18 }}
                      transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 300, damping: 18 }}
                      className="grid size-7 place-items-center rounded-full bg-white"
                    >
                      <L className="size-4" />
                    </motion.span>
                  );
                })}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-3 text-[0.8125rem] leading-[1.7] text-chalk-soft">قوقل ياخذ المشتريات بس، لأنها اللي يحسّن عليها إعلاناتك.</p>
    </div>
  );
}

export function Events() {
  const [lit, setLit] = useState(-1);
  return (
    <Section id="events" theme="dark">
      <div className="mx-auto grid max-w-[80rem] items-center gap-14 px-5 py-28 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-36">
        <div className="max-w-[36rem]">
          <H2>
            كل طلب في متجرك يوصل <Mark>لكل منصة</Mark>.
          </H2>
          <p className="mt-5 text-[1.0625rem] leading-[1.9] text-chalk-soft">
            المنصات الإعلانية تتعلّم من اللي يصير في متجرك. فنوصّل لها كل خطوة يسويها العميل: يزور، يضيف للسلة، يبدأ الدفع، ويشتري. كذا تعرف إعلاناتك مين يشتري فعلاً، وتدوّر لك على ناس يشبهونه.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-[1.8] text-chalk">في سلة وزد يشتغل لحاله. وفي موقعك الخاص، سطر واحد تحطه مرة وحدة.</p>
          <Feed />
        </div>

        <div className="hl-dark">
          <HairlineFigure
            engine={mailboxes.mount}
            value={mailboxes.range[1]}
            label="أربعة صناديق بريد، لكل منصة إعلانية صندوق، والطلب يرفع علم الصناديق كلها"
            stops={mailboxes.stops}
            play
            onRead={(r) => setLit(r === "rest" ? -1 : Number(r) - 1)}
            className="mx-auto w-full max-w-[36rem]"
          />
          <ul className="mx-auto mt-2 flex max-w-[30rem] flex-wrap justify-center gap-2 sm:gap-3">
            {PLATFORMS.map(({ name, L }, i) => (
              <li key={name} className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.8125rem] transition-colors duration-300 ${lit === i ? "bg-chalk text-ink" : "bg-board-2 text-chalk-soft ring-1 ring-white/8"}`}>
                <span className="grid size-5 place-items-center rounded-full bg-white"><L className="size-3.5" /></span>
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
