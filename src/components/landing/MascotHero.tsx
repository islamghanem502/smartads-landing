"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { gsap, reduced, useGSAP } from "@/lib/gsap";
import { SIGNUP_URL } from "@/lib/links";
import { Google, Instagram, Meta, Salla, Snapchat, TikTok, WhatsApp, Website, ZidMark } from "@/components/brand/logos";

type Svg = React.SVGProps<SVGSVGElement>;
type Logo = (p: Svg) => React.ReactElement;

const STORES: { L: Logo; n: string }[] = [
  { L: Salla, n: "سلة" },
  { L: ZidMark, n: "زد" },
  { L: Website, n: "موقعك الخاص" },
];

/* يوم شغل الشخصية: كل سطر خدمة من خدماتنا، بالمنصة اللي تمت عليها والنتيجة. أمثلة لمتجر عطور. */
const DAY: { t: string; L: Logo; n: string; did: string; got: string }[] = [
  { t: "٩:٠٢ ص", L: Snapchat, n: "سناب شات", did: "أطلقت حملة جديدة في سناب", got: "١٥٠ ريال باليوم" },
  { t: "١٠:٣٠ ص", L: Instagram, n: "انستقرام", did: "نشرت ريلز في حسابك", got: "٢٬٤٠٠ مشاهدة" },
  { t: "١٢:١٥ م", L: Google, n: "قوقل", did: "رفعت «عطر العود» في نتائج قوقل", got: "صار الثالث" },
  { t: "٢:٤٠ م", L: Meta, n: "ميتا", did: "نقلت ٢٠٪ من الميزانية لميتا", got: "لأنه يبيع أكثر" },
  { t: "٤:٠٥ م", L: TikTok, n: "تيك توك", did: "صمّمت فيديو إعلاني لتيك توك", got: "ينتظر موافقتك" },
  { t: "٦:٠٠ م", L: Salla, n: "سلة", did: "جاك ١٤ طلب من الإعلانات", got: "٣٬٢٠٠ ريال" },
  { t: "٩:٠٠ م", L: WhatsApp, n: "واتساب", did: "أرسلت لك تقرير اليوم", got: "على الواتساب" },
];
const SHOWN = 4;

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

/** «شغلي اليوم»: سجل حي، كل كم ثانية ينزل سطر جديد من فوق. */
function WorkFeed() {
  const [head, setHead] = useState(SHOWN - 1);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced()) return;
    let on = false;
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; });
    io.observe(box.current!);
    const t = window.setInterval(() => { if (on && !document.hidden) setHead((h) => h + 1); }, 2800);
    return () => { clearInterval(t); io.disconnect(); };
  }, []);

  // الأحدث فوق
  const rows = Array.from({ length: SHOWN }, (_, i) => {
    const k = head - i;
    return { k, ...DAY[((k % DAY.length) + DAY.length) % DAY.length] };
  });

  return (
    <div ref={box} data-a="feed" className="mh-feed rounded-[26px] bg-[var(--night-2)] p-4 ring-1 ring-[var(--line)] sm:p-5">
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-[1.0625rem] font-bold text-white">شغلي اليوم</p>
        <span className="flex items-center gap-2 text-[0.8125rem] text-[#cfd3db]">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e] opacity-60" />
            <span className="relative size-2 rounded-full bg-[#22c55e]" />
          </span>
          يشتغل الحين
        </span>
      </div>
      <ul className="mt-3 grid gap-2" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((r) => (
            <motion.li
              key={r.k}
              layout
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="flex items-center gap-3 rounded-[16px] bg-[var(--night)] p-2.5 pe-3"
            >
              <span title={r.n} className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-white">
                <r.L className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.9375rem] font-semibold leading-snug text-white">{r.did}</span>
                <span className="mt-0.5 block text-[0.8125rem] text-[#c9cdd6]">{r.got}</span>
              </span>
              <span className="shrink-0 self-start pt-0.5 text-[0.75rem] tabular-nums text-[#8e94a1]">{r.t}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-3 px-1 text-[0.75rem] text-[#8e94a1]">مثال من يوم شغل في متجر عطور</p>
    </div>
  );
}

/* الوجه مرسوم فوق الصورة (والصورة نفسها بدون عيون ولا فم)، فيقدر يرمش ويلحق المؤشر ويبتسم.
   الأرقام بإحداثيات الصورة الأصلية 1920×1920، والفم منحنى مطابق لفمها الأصلي. */
const SMILE = "M672 609.5 C702 632.1 745.3 655.7 782 630";
const BIG_SMILE = "M664 603 C698 640 749 676 790 622";

function Face() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el || reduced()) return;
    const face = el.querySelector<SVGGElement>("[data-face]")!;
    const eyes = el.querySelector<SVGGElement>("[data-eyes]")!;
    const mouth = el.querySelector<SVGPathElement>("[data-mouth]")!;
    const lids = el.querySelectorAll<SVGGElement>("[data-eye]");
    // الوجه كله يتحرك مع النظرة، والعيون تتحرك شوي زيادة: كذا يبان إنه يلف راسه مو بس عيونه
    const fx = gsap.quickTo(face, "x", { duration: 0.5, ease: "power3" });
    const fy = gsap.quickTo(face, "y", { duration: 0.5, ease: "power3" });
    const ex = gsap.quickTo(eyes, "x", { duration: 0.4, ease: "power3" });
    const ey = gsap.quickTo(eyes, "y", { duration: 0.4, ease: "power3" });

    const look = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const dx = e.clientX - (r.left + r.width * 0.39), dy = e.clientY - (r.top + r.height * 0.3);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 320), ux = dx / d, uy = dy / d;
      fx(ux * 16 * k); fy(uy * 10 * k);
      ex(ux * 7 * k); ey(uy * 5 * k);
    };
    // يبتسم أكثر لما المؤشر على زر الربط
    const smile = (e: Event) => {
      if (!(e.target as Element).closest?.("[data-smile]")) return;
      gsap.to(mouth, { attr: { d: e.type === "pointerover" ? BIG_SMILE : SMILE }, duration: 0.35, ease: "power3.out" });
    };
    // يرمش كل كم ثانية، ومرات رمشتين ورا بعض
    let blinkT = 0;
    const blink = () => {
      gsap.to(lids, { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: Math.random() < 0.2 ? 3 : 1, transformOrigin: "50% 50%", ease: "power1.inOut" });
      blinkT = window.setTimeout(blink, 2600 + Math.random() * 3200);
    };
    blinkT = window.setTimeout(blink, 1800);

    addEventListener("pointermove", look, { passive: true });
    document.addEventListener("pointerover", smile);
    document.addEventListener("pointerout", smile);
    return () => {
      removeEventListener("pointermove", look);
      document.removeEventListener("pointerover", smile);
      document.removeEventListener("pointerout", smile);
      clearTimeout(blinkT);
    };
  }, []);

  return (
    <svg ref={svg} viewBox="0 0 1920 1920" aria-hidden className="pointer-events-none absolute inset-0 size-full">
      <g data-face>
        <g data-eyes>
          <g data-eye>
            <ellipse cx="655.5" cy="535.5" rx="31" ry="31" fill="#151618" />
            <ellipse cx="646" cy="524" rx="8" ry="6" fill="#ffffff" fillOpacity="0.35" />
          </g>
          <g data-eye>
            <ellipse cx="839.5" cy="581" rx="30" ry="30.5" fill="#151618" />
            <ellipse cx="830" cy="570" rx="7.5" ry="5.5" fill="#ffffff" fillOpacity="0.35" />
          </g>
        </g>
        <path data-mouth d={SMILE} fill="none" stroke="#151618" strokeWidth="18" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** الشخصية: خط القص في صورتها يركب على حافة الشاشة اليسار، فجسمها برا الشاشة وتطلّ لداخل. */
function Mascot({ className = "" }: { className?: string }) {
  const [line, setLine] = useState("هلا والله!");
  useEffect(() => {
    // بعد السلام، تأشّر على شغلها
    const t = window.setTimeout(() => setLine("هذا شغلي اليوم"), 3600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div data-a="mascot" data-reveal className={`mh-mascot relative ${className}`}>
      <Image
        src="/landing/mascot-faceless.webp"
        alt="شخصية مسوّقك الذكي: روبوت أبيض لابس غترة وعقال، يطلّ من طرف الشاشة ويسلّم"
        width={1200}
        height={1200}
        priority
        sizes="(min-width: 1280px) 34vw, 78vw"
        className="h-auto w-full select-none"
        draggable={false}
      />
      <Face />
      <p
        data-a="hello"
        data-reveal
        dir="rtl"
        className="mh-hello absolute whitespace-nowrap rounded-[16px] rounded-bl-[4px] bg-white px-4 py-2 text-[0.9375rem] font-semibold text-[var(--night)] sm:text-[1.0625rem]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={line}
            className="block"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {line}
          </motion.span>
        </AnimatePresence>
      </p>
    </div>
  );
}

export function MascotHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const all = gsap.utils.toArray<HTMLElement>("[data-a]", ref.current);
    if (reduced()) { gsap.set(all, { opacity: 1 }); return; }
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo("[data-a=line]", { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12 }, 0.1)
      .fromTo("[data-a=fade]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.4)
      .fromTo("[data-a=feed]", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.5)
      // تطلع من حافة الشاشة وتثبت
      .fromTo("[data-a=mascot]", { xPercent: -45, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.1, ease: "back.out(1.3)" }, 0.7)
      .fromTo("[data-a=hello]", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.2)" }, 1.6);
  }, { scope: ref });

  return (
    <section ref={ref} className="mh relative overflow-x-clip pt-24 xl:pt-28">
      <div className="mx-auto grid min-h-[calc(100svh-9rem)] max-w-[78rem] items-center gap-x-12 px-4 pb-12 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_auto]">
        {/* الكلام: يمين */}
        <div className="max-w-[35rem]">
          <h1 className="mh-h1 font-bold leading-[1.3]">
            <span data-reveal data-a="line" className="block">
              <Ink text="وكالة تسويق" />{" "}
              <span className="mh-chip">كاملة</span>،
            </span>
            <span data-reveal data-a="line" className="block">
              <Ink text="بدون ما توظّف أحد." />
            </span>
          </h1>
          <p data-reveal data-a="fade" className="mt-4 text-[1.0625rem] font-semibold leading-[1.7] text-white xl:text-[1.125rem]">
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

        {/* الجوال والتابلت: الشخصية تطلّ من حافة الشاشة فوق شغلها */}
        <div className="mh-bleed mt-12 xl:hidden">
          <Mascot />
        </div>

        {/* شغل اليوم: يسار، جنب يد الشخصية، ويبعد عنها بقدر ما تاخذ من الشاشة */}
        <div className="mh-col">
          <WorkFeed />
        </div>
      </div>

      {/* الشاشة العريضة: الشخصية لاصقة في حافة الشاشة اليسار، في نص الهيرو */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center pt-20 xl:flex">
        <Mascot />
      </div>
    </section>
  );
}
