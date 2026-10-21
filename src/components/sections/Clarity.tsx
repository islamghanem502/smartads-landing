"use client";

import { useRef } from "react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";
import { WhatsApp } from "@/components/brand/logos";
import { Hand } from "@/components/ui/Hand";
import { Mark } from "@/components/ui/Mark";
import { Pin } from "@/components/ui/Pin";
import { H2, Section, paperShadow } from "@/components/ui/Section";

const FACTS = [
  { title: "تقرير كل صباح", text: "على الواتساب، بالأرقام اللي تهمك: صرف، طلبات، مبيعات." },
  { title: "سبب مع كل قرار", text: "أي تغيير على حملاتك يوصلك معه ليش سويناه." },
  { title: "تسأل أي وقت", text: "تكلم مسوّقك الذكي ٢٤ ساعة، ويرد عليك من بيانات متجرك." },
];

function Bubble({ me, time, children }: { me?: boolean; time: string; children: React.ReactNode }) {
  return (
    <div data-bubble className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div className={`relative max-w-[86%] rounded-[12px] px-3.5 pb-2 pt-2.5 text-[0.9375rem] leading-[1.7] shadow-[0_1px_1px_rgba(0,0,0,.08)] ${me ? "bg-[#d9fdd3]" : "bg-white"}`}>
        {children}
        <span className="mt-0.5 block text-left text-[0.6875rem] text-ink-faint">{time}</span>
      </div>
    </div>
  );
}

export function Clarity() {
  const chat = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    const items = gsap.utils.toArray<HTMLElement>("[data-bubble]", chat.current);
    gsap.fromTo(items, { opacity: 0, y: 14 }, {
      opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.55,
      scrollTrigger: { trigger: chat.current, start: "top 70%", once: true },
    });
  }, { scope: chat });

  return (
    <Section id="clarity" theme="light">
      <div className="mx-auto grid max-w-[80rem] items-center gap-16 px-5 py-28 lg:grid-cols-2 lg:px-8 lg:py-36">
        <div className="max-w-[36rem]">
          <H2>
            كل قرار تشوفه قدامك، <Mark tone="light">بالعربي</Mark>.
          </H2>
          <p className="mt-5 text-[1.0625rem] leading-[1.9] text-ink-soft">
            ما في صندوق أسود. كل صباح يوصلك تقرير على الواتساب: كم صرفنا، كم بعنا، ووش غيّرنا وليش. وتقدر توافق أو ترفض أي خطوة برد واحد.
          </p>
          <ul className="mt-10 grid gap-6">
            {FACTS.map((f) => (
              <li key={f.title} className="grid grid-cols-[auto_1fr] gap-x-4">
                <Hand shape="check" className="mt-1 size-6 text-green" width={2.4} />
                <div>
                  <h3 className="font-display text-[1.0625rem] font-bold">{f.title}</h3>
                  <p className="mt-1 text-[0.9375rem] leading-[1.75] text-ink-soft">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[28rem]" style={{ transform: "rotate(-1.5deg)" }}>
          <Pin className="left-1/2 top-2 z-10" size={34} />
          <div className={`overflow-hidden rounded-[14px] bg-[#efeae2] ${paperShadow}`}>
            <div className="flex items-center gap-3 bg-white px-4 pb-3 pt-6">
              <span className="grid size-10 place-items-center rounded-full bg-board">
                <svg viewBox="0 0 40 40" className="size-7" aria-hidden><use href="#pushpin" /></svg>
              </span>
              <div className="leading-tight">
                <p className="font-display text-[0.9375rem] font-bold">مسوّقك الذكي</p>
                <p className="text-[0.75rem] text-green">متصل</p>
              </div>
              <WhatsApp className="ms-auto size-6" />
            </div>
            <div ref={chat} className="grid gap-2.5 px-3.5 py-4">
              <Bubble time="٩:٠٢ ص">
                صباح الخير، تقرير أمس: صرفنا <b>٤٨٠ ريال</b>، وجاك <b>١٤ طلب</b> بـ <b>٣٬٢٠٠ ريال</b>.
              </Bubble>
              <Bubble time="٩:٠٢ ص">
                أوقفنا إعلان الفستان الأحمر في تيك توك،{" "}
                <span className="relative inline-block">
                  لأنه صرف ١٢٠ ريال وما جاب طلب
                  <Hand shape="circle" stretch className="absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] text-pin" width={1.8} delay={1.6} />
                </span>
                . ونقلنا ميزانيته لسناب.
              </Bubble>
              <Bubble me time="٩:١٥ ص">تمام. وش عندكم لليوم الوطني؟</Bubble>
              <Bubble time="٩:١٦ ص">
                جهّزنا حملة بخصم ١٥٪ تبدأ قبله بأسبوع، ومعها ٤ منشورات. توافق؟
                <span className="mt-2 grid grid-cols-2 gap-2">
                  <span className="rounded-[8px] bg-snow py-1.5 text-center font-display text-[0.8125rem] font-semibold text-green">موافق</span>
                  <span className="rounded-[8px] bg-snow py-1.5 text-center font-display text-[0.8125rem] font-semibold text-ink-soft">عدّل</span>
                </span>
              </Bubble>
            </div>
          </div>
          <p className="mt-4 text-center text-[0.8125rem] text-ink-faint">مثال لتقرير الصباح</p>
        </div>
      </div>
    </Section>
  );
}
