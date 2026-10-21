"use client";

import { useRef } from "react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";
import { HairlineFigure } from "@/lib/hairline/Figure";
import * as coins from "@/lib/hairline/figures/coins";
import { Google, Meta, Snapchat, TikTok } from "@/components/brand/logos";
import { Hand } from "@/components/ui/Hand";
import { Mark } from "@/components/ui/Mark";
import { Pin } from "@/components/ui/Pin";
import { H2, Section, paperShadow } from "@/components/ui/Section";

const PLATFORMS = [
  { name: "سناب شات", L: Snapchat, text: "إعلانات بين القصص، وإعلانات منتجات توديه لصفحة المنتج على طول.", from: 25, to: 34, tone: "#e8e45a" },
  { name: "تيك توك", L: TikTok, text: "فيديو قصير بأسلوب المنصة، يطلع في صفحة «لك».", from: 25, to: 14, tone: "#2a2a28" },
  { name: "ميتا", L: Meta, text: "انستقرام وفيسبوك: صور وفيديو وكاروسيل، ونرجّع اللي زاروا متجرك.", from: 25, to: 38, tone: "#3b7be0" },
  { name: "قوقل", L: Google, text: "بحث ويوتيوب وتسوّق وأداء أقصى، للي يدوّر على منتجك.", from: 25, to: 14, tone: "#34a853" },
];

const DAILY = [
  "نوقف الإعلان اللي يصرف وما يبيع",
  "نزيد الميزانية على اللي يجيب طلبات",
  "نجرّب جماهير وإعلانات جديدة كل أسبوع",
  "ما نتعدى السقف اللي حددته، أبداً",
];

/** شريط الميزانية: يتوزع بالتساوي، ومع السكرول يميل للمنصة اللي تبيع. */
function BudgetBar() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const segs = gsap.utils.toArray<HTMLElement>("[data-seg]", ref.current);
    const nums = gsap.utils.toArray<HTMLElement>("[data-num]", ref.current);
    const when = ref.current!.querySelectorAll<HTMLElement>("[data-when]");
    const apply = (p: number) => {
      PLATFORMS.forEach((pl, i) => {
        const v = pl.from + (pl.to - pl.from) * p;
        segs[i].style.flexBasis = `${v}%`;
        nums[i].textContent = `${Math.round(v)}٪`;
      });
      when[0].style.opacity = String(1 - p);
      when[1].style.opacity = String(p);
    };
    if (reduced()) { apply(1); return; }
    const s = { p: 0 };
    apply(0);
    gsap.to(s, { p: 1, ease: "none", onUpdate: () => apply(s.p), scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 35%", scrub: 0.8 } });
  }, { scope: ref });

  return (
    <div ref={ref} className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-[0.875rem] text-ink-soft">توزيع ميزانية متجر، مثال</span>
        <span className="relative h-7 w-28 text-left font-hand text-[1.3rem] text-green">
          <span data-when className="absolute inset-0">أول يوم</span>
          <span data-when className="absolute inset-0 opacity-0">بعد أسبوعين</span>
        </span>
      </div>
      <div className="flex h-14 w-full gap-1 overflow-hidden rounded-[10px]">
        {PLATFORMS.map(({ name, L, tone }) => (
          <div key={name} data-seg className="flex min-w-0 items-center justify-center gap-2 rounded-[6px] px-2" style={{ flexBasis: "25%", background: tone === "#2a2a28" ? "#2a2a28" : `${tone}33` }}>
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white"><L className="size-4" /></span>
            <span data-num className={`font-display text-[0.9375rem] font-bold tabular-nums ${tone === "#2a2a28" ? "text-white" : "text-ink"}`}>25٪</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Campaigns() {
  return (
    <Section id="campaigns" theme="light">
      <div className="mx-auto max-w-[80rem] px-5 py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-[36rem]">
            <H2>
              حملات تنطلق لحالها، وميزانية تروح <Mark tone="light">للي يبيع</Mark>.
            </H2>
            <p className="mt-5 text-[1.0625rem] leading-[1.9] text-ink-soft">
              نجهّز الإعلان والجمهور والميزانية لكل منصة، ونطلق. وبعدها نراجع النتائج كل ١٥ دقيقة، على مدار الساعة:
            </p>
            <ul className="mt-6 grid gap-3.5">
              {DAILY.map((d, i) => (
                <li key={d} className="flex items-center gap-3 text-[1.0625rem]">
                  <Hand shape="check" className="size-6 shrink-0 text-green" width={2.4} delay={0.15 + i * 0.15} />
                  {d}
                </li>
              ))}
            </ul>
            <BudgetBar />
          </div>
          <div className="hl-snow relative">
            <HairlineFigure engine={coins.mount} value={coins.range[1]} label="أربع كومات عملات، لكل منصة كومة، والكومة اللي تبيع تاخذ من الباقي" stops={coins.stops} play className="mx-auto w-full max-w-[34rem]" />
            <p className="absolute bottom-2 right-4 flex items-center gap-2 font-hand text-[1.3rem] text-ink-soft">
              <Hand shape="arrowUp" className="size-10 -scale-x-100 text-ink-soft" width={1.8} />
              الميزانية تنتقل، ما تزيد
            </p>
          </div>
        </div>

        <ul className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORMS.map(({ name, L, text }, i) => (
            <li key={name} className={`relative rounded-[6px] bg-white px-5 pb-6 pt-9 ${paperShadow}`} style={{ transform: `rotate(${[1.2, -1, 1.5, -1.4][i]}deg)` }}>
              <Pin className="left-1/2 top-3" size={28} />
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-[10px] bg-snow ring-1 ring-ink/8"><L className="size-6" /></span>
                <h3 className="font-display text-[1.125rem] font-bold">{name}</h3>
              </div>
              <p className="mt-3 text-[0.9375rem] leading-[1.75] text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
