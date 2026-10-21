"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { H2, Section } from "@/components/ui/Section";

const QA = [
  { q: "أحتاج خبرة في الإعلانات؟", a: "لا. تربط متجرك وتحدد ميزانيتك، والباقي علينا. وإذا حبيت تتدخل، كل شي قدامك في اللوحة." },
  { q: "وش المنصات اللي تشتغلون عليها؟", a: "الإعلانات على سناب شات وتيك توك وميتا (انستقرام وفيسبوك) وقوقل ويوتيوب. والنشر على انستقرام وتيك توك وفيسبوك." },
  { q: "متجري على موقع خاص، ينفع؟", a: "ينفع. نعطيك سطر واحد تحطه في موقعك مرة وحدة، وبعدها كل شي يشتغل مثل سلة وزد." },
  { q: "مين يقرر وين تروح الميزانية؟", a: "مسوّقك الذكي يقرر على حسب مبيعاتك الفعلية، وما يتعدى السقف اللي حددته. وكل قرار يوصلك مع سببه." },
  { q: "أقدر أوقف حملة أو أرفض منشور؟", a: "أكيد. توافق أو ترفض بضغطة من اللوحة، أو برد واحد على الواتساب." },
  { q: "الاشتراك يشمل ميزانية الإعلانات؟", a: "لا. ميزانية الإعلانات منفصلة وتحددها أنت. الاشتراك يغطي إدارتها، والمحتوى، والتقارير." },
  { q: "أقدر ألغي؟", a: "تلغي بضغطة، بدون التزام." },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" theme="light">
      <div className="mx-auto grid max-w-[80rem] gap-12 px-5 py-28 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-36">
        <div>
          <H2>أسئلة توصلنا كثير</H2>
          <p className="mt-4 text-[1.0625rem] leading-[1.85] text-ink-soft">وإذا سؤالك مو هنا، اسأل مسوّقك الذكي بعد ما تربط متجرك.</p>
        </div>
        <ul className="border-t border-ink/12">
          {QA.map((x, i) => {
            const on = open === i;
            return (
              <li key={x.q} className="border-b border-ink/12">
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setOpen(on ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-right font-display text-[1.0625rem] font-bold"
                  >
                    {x.q}
                    <motion.svg viewBox="0 0 24 24" className="size-5 shrink-0 text-ink-soft" animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }} aria-hidden>
                      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </motion.svg>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[40em] pb-6 text-[1rem] leading-[1.85] text-ink-soft">{x.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
