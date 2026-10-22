"use client";

import Image from "next/image";
import { motion } from "motion/react";

const EASE = [0.32, 0.72, 0, 1] as const;

/* المقارنة بالكلام بس، بدون أرقام عن غيرنا ما نقدر نثبتها. أرقامنا من باقات المنصة نفسها. */
const ROWS = [
  { k: "التكلفة", emp: "راتب كل شهر، وتأمين، وإجازات", agency: "أتعاب إدارة شهرية، وغالباً عقد بمدة", us: "من ٧٩٩ ريال بالشهر" },
  { k: "وقت الشغل", emp: "ساعات الدوام", agency: "أيام الأسبوع", us: "٢٤ ساعة، ونراجع كل ١٥ دقيقة" },
  { k: "المنصات", emp: "اللي يعرفها", agency: "على حسب الباقة", us: "سناب وتيك توك وميتا وقوقل، والسيو والنشر" },
  { k: "سرعة التعديل", emp: "على حسب وقته", agency: "أيام بين كل تعديل", us: "لحظة ما تبيّن النتيجة" },
  { k: "الوضوح", emp: "تسأله وتنتظر", agency: "تقرير آخر الشهر", us: "كل قرار يوصلك مع سببه، بالعربي" },
  { k: "الالتزام", emp: "عقد توظيف", agency: "عقد بمدة", us: "تلغي بضغطة" },
];

const COLS = [
  { key: "emp", label: "موظف تسويق" },
  { key: "agency", label: "وكالة تقليدية" },
] as const;

function UsHead() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-[var(--night)] ring-1 ring-white/15">
        <Image src="/landing/mascot-head.png" alt="" width={36} height={36} className="mt-1 size-8 object-contain" />
      </span>
      مسوّقك الذكي
    </span>
  );
}

export function WhyUs() {
  return (
    <section id="why" className="scroll-mt-20">
      <div className="mx-auto max-w-[78rem] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-[44rem]">
          <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.3]">
            ليش <span className="mh-chip">مسوّقك الذكي</span>؟
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-[1.9] text-[#dfe2e8] sm:text-[1.125rem]">
            عندك ثلاث طرق تسوّق فيها متجرك. قارن بنفسك.
          </p>
        </div>

        {/* الشاشات الكبيرة: جدول، وعمودنا مرفوع ومميّز */}
        <div className="mt-14 hidden md:block" role="table" aria-label="مقارنة بين موظف تسويق ووكالة تقليدية ومسوّقك الذكي">
          <div role="rowgroup" className="grid grid-cols-[10rem_1fr_1fr_1.15fr] items-end gap-x-3">
            <span role="columnheader" />
            {COLS.map((c) => (
              <span key={c.key} role="columnheader" className="px-5 pb-4 text-[1rem] font-semibold text-[#cfd3db]">{c.label}</span>
            ))}
            <span role="columnheader" className="rounded-t-[24px] bg-white px-5 pb-4 pt-5 text-[1.0625rem] font-bold text-[var(--night)]">
              <UsHead />
            </span>
          </div>
          <div role="rowgroup">
            {ROWS.map((r, i) => (
              <motion.div
                key={r.k}
                role="row"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="grid grid-cols-[10rem_1fr_1fr_1.15fr] gap-x-3"
              >
                <span role="rowheader" className="border-t border-white/10 py-5 text-[1rem] font-semibold text-white">{r.k}</span>
                <span role="cell" className="border-t border-white/10 px-5 py-5 text-[0.9375rem] leading-[1.6] text-[#a9aeba]">{r.emp}</span>
                <span role="cell" className="border-t border-white/10 px-5 py-5 text-[0.9375rem] leading-[1.6] text-[#a9aeba]">{r.agency}</span>
                <span
                  role="cell"
                  className={`flex items-start gap-2.5 bg-white px-5 py-5 text-[1rem] font-semibold leading-[1.55] text-[var(--night)] ${i === ROWS.length - 1 ? "rounded-b-[24px]" : "border-t border-black/[0.06]"}`}
                >
                  <svg viewBox="0 0 24 24" className="mt-[0.2rem] size-4 shrink-0 text-[#22c55e]" aria-hidden>
                    <path d="M4.5 12.5 9.5 17.5 19.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {r.us}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* الجوال: كل بند كرت، وجوابنا فوق والباقي تحته */}
        <ul className="mt-12 grid gap-3 md:hidden">
          {ROWS.map((r) => (
            <li key={r.k} className="rounded-[22px] bg-[var(--night-2)] p-5 ring-1 ring-[var(--line)]">
              <p className="text-[0.875rem] font-semibold text-[#cfd3db]">{r.k}</p>
              <p className="mt-2 flex items-start gap-2 text-[1.0625rem] font-semibold leading-[1.55] text-white">
                <svg viewBox="0 0 24 24" className="mt-[0.25rem] size-4 shrink-0 text-[#22c55e]" aria-hidden>
                  <path d="M4.5 12.5 9.5 17.5 19.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {r.us}
              </p>
              <dl className="mt-3 grid gap-1 border-t border-white/10 pt-3 text-[0.875rem] text-[#a9aeba]">
                <div className="flex gap-2"><dt className="shrink-0 text-[#cfd3db]">موظف:</dt><dd>{r.emp}</dd></div>
                <div className="flex gap-2"><dt className="shrink-0 text-[#cfd3db]">وكالة:</dt><dd>{r.agency}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
