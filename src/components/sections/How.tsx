"use client";

import { useRef } from "react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";
import { HairlineFigure } from "@/lib/hairline/Figure";
import * as planner from "@/lib/hairline/figures/planner";
import { Salla, Website, Zid } from "@/components/brand/logos";
import { Mark } from "@/components/ui/Mark";
import { Pin } from "@/components/ui/Pin";
import { H2, Section, paperShadow } from "@/components/ui/Section";

const STEPS = [
  {
    n: "١",
    title: "تربط متجرك",
    text: "من سلة أو زد بضغطة، أو سطر واحد تحطه في موقعك. وتربط حساباتك الإعلانية وحسابات النشر.",
    rot: 2,
  },
  {
    n: "٢",
    title: "نشخّص ونبني خطتك",
    text: "نقرأ منتجاتك وأسعارك وجمهورك، ونسألك عن ميزانيتك. بعدها توصلك خطة الشهر، تعتمدها أو تعدّل عليها.",
    rot: -1.5,
  },
  {
    n: "٣",
    title: "نشتغل كل يوم",
    text: "نطلق الحملات وننشر المحتوى، ونراجع النتائج كل ١٥ دقيقة على مدار الساعة. وكل صباح يوصلك تقرير.",
    rot: 2.5,
  },
];

function Visual({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="flex h-full items-center justify-center gap-4">
        {[<Salla key="s" className="h-8" />, <Zid key="z" className="h-6" />, <Website key="w" className="h-9" />].map((l, k) => (
          <span key={k} className="grid size-[4.25rem] place-items-center rounded-full bg-white ring-1 ring-ink/10">{l}</span>
        ))}
      </div>
    );
  if (i === 1)
    return (
      <div className="hl-paper relative h-full overflow-hidden">
        <HairlineFigure engine={planner.mount} value={planner.range[1]} label="تقويم خطة الشهر، والأيام اللي فيها منشور تطلع لك" stops={planner.stops} play style={{ position: "absolute", width: "112%", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }} />
      </div>
    );
  // خط نتائج يطلع، بنقطة كل مراجعة
  const pts = [[8, 92], [40, 84], [72, 88], [104, 70], [136, 74], [168, 52], [200, 56], [232, 34], [264, 22]];
  return (
    <div className="relative flex h-full items-center justify-center">
      <svg viewBox="0 0 272 110" className="w-full max-w-[16rem]" aria-hidden>
        <path d="M4 104c88-1 176-1 264 0" fill="none" stroke="#d3d3cc" strokeWidth="1.2" strokeLinecap="round" />
        <path data-chart d={`M${pts.map((p) => p.join(" ")).join(" L")}`} fill="none" stroke="#0f7a4d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r={k === pts.length - 1 ? 4.2 : 2.6} fill={k === pts.length - 1 ? "#0f7a4d" : "#fff"} stroke="#0f7a4d" strokeWidth="1.4" />)}
      </svg>
      <span className="absolute left-2 top-1 font-hand text-[1.1rem] text-green">كل ١٥ دقيقة</span>
    </div>
  );
}

export function How() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reduced()) return;
    const mm = gsap.matchMedia();
    // في الشاشة العريضة: القسم يثبت، والخط اليدوي ينرسم مع السكرول ويعلّق كل خطوة لما يوصلها
    mm.add("(min-width: 1024px)", () => {
      const line = ref.current!.querySelector<SVGPathElement>("[data-thread]")!;
      const len = line.getTotalLength();
      const cards = gsap.utils.toArray<HTMLElement>("[data-step]", ref.current);
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top top", end: "+=1500", pin: true, scrub: 0.6 },
      });
      // الخطوة الأولى معلّقة من البداية، والباقي تنتظر الخيط يوصل لها
      cards.slice(1).forEach((c, i) => {
        tl.fromTo(c, { opacity: 0.28, y: 46, rotate: i % 2 ? 7 : -7 }, { opacity: 1, y: 0, rotate: Number(c.dataset.rot), duration: 0.5, ease: "back.out(1.6)" }, 0.75 + i * 0.85);
      });
      tl.to(line, { strokeDashoffset: 0, duration: 2.2, ease: "none" }, 0.25);
    });
    // في الجوال: كل خطوة تتعلّق لما توصلها
    mm.add("(max-width: 1023px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-step]", ref.current).forEach((c) => {
        gsap.fromTo(c, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: c, start: "top 85%", once: true } });
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <Section id="how" theme="light">
      <div ref={ref} className="mx-auto flex min-h-screen max-w-[80rem] flex-col justify-center px-5 py-24 lg:px-8 lg:py-16">
        <div className="max-w-[42rem]">
          <H2>
            ثلاث خطوات، <Mark tone="light">والباقي علينا</Mark>.
          </H2>
          <p className="mt-4 text-[1.0625rem] leading-[1.85] text-ink-soft">ما تحتاج خبرة في الإعلانات ولا فريق. من أول يوم تشوف شغلنا قدامك.</p>
        </div>

        <div className="relative mt-16 lg:mt-20">
          {/* الخيط اليدوي اللي يربط الخطوات: يمشي من اليمين لليسار */}
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute inset-x-0 top-[38%] hidden h-[7.5rem] w-full lg:block">
            <path
              data-thread
              d="M1190 70c-60-40-150-52-240-30-60 14-90 40-160 44-70 4-110-34-190-38-80-4-120 40-190 42-70 2-110-30-170-34-50-3-120 20-170 42"
              fill="none"
              stroke="#c9281b"
              strokeWidth="1.8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <ol className="relative grid gap-14 lg:grid-cols-3 lg:gap-12">
            {STEPS.map((s, i) => (
              <li key={s.n} data-step data-rot={s.rot} className={`relative rounded-[6px] bg-paper px-6 pb-7 pt-9 ${paperShadow}`} style={{ transform: `rotate(${s.rot}deg)` }}>
                <Pin className="left-1/2 top-3" size={32} />
                <div className="flex items-baseline gap-3">
                  <span className="font-hand text-[2.6rem] leading-none text-pin">{s.n}</span>
                  <h3 className="font-display text-[1.3125rem] font-bold">{s.title}</h3>
                </div>
                <p className="mt-3 min-h-[5.4em] text-[1rem] leading-[1.8] text-ink-soft">{s.text}</p>
                <div className="mt-5 h-[9.5rem]">
                  <Visual i={i} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
