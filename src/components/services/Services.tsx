import { useCallback, useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { SIGNUP_URL } from "../../lib/links";
import { Ink } from "../Ink";
import { Container } from "../layout";
import { ART, BudgetScene, ChatScene, SEO_AT, SearchScene, StudioScene, type SceneProps } from "./scenes";

/*
 * كل خدمة كرت غامق بنفس القالب: العنوان والوصف يمين فوق، منطقة المشهد في النص، والشخصية تحت
 * مقصوصة عند الخصر على حافة الكرت. الكلمة المهمة في الوصف عليها قلم تظليل بلون الخدمة (.hl).
 */
type Service = {
  title: string;
  text: ReactNode;
  hl: string;
  Scene: ComponentType<SceneProps>;
  art: string;
  artAt?: string; // نص الشخصية بالعرض من الكرت (الافتراضي في النص)
};

const SERVICES: Service[] = [
  { title: "الإعلانات الممولة", text: <>نطلقها ونحسّنها <mark className="hl">كل ربع ساعة</mark>.</>, hl: "#6d4ee8", Scene: BudgetScene, art: "/services/ads.webp" },
  {
    title: "محتوى حساباتك",
    text: <><span className="block">نصمّم صور وفيديوهات منتجك،</span><span className="block">وننزّلها في حساباتك <mark className="hl">بجدول ثابت</mark>.</span></>,
    hl: "#c23a86",
    Scene: StudioScene,
    art: "/services/content.webp",
    artAt: "64%",
  },
  { title: "السيو", text: <>متجرك <mark className="hl">أول</mark> في قوقل والذكاء الاصطناعي.</>, hl: "#d2741a", Scene: SearchScene, art: "/services/seo.webp", artAt: SEO_AT },
  { title: "التقارير والمستشار", text: <>تقريرك ومستشارك على <mark className="hl">واتساب</mark>.</>, hl: "#2f6fe0", Scene: ChatScene, art: "/services/reports.webp" },
];

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [plays, setPlays] = useState(() => SERVICES.map(() => 0));
  const replay = useCallback((i: number) => setPlays((p) => p.map((n, k) => (k === i ? n + 1 : n))), []);

  // القصص تشتغل لما يبان الكرت كله تقريباً، وتمشي ورا بعض بترتيب الكروت (كل وحدة بعد اللي قبلها بشوي)
  // عشان العين تتابعها وحدة وحدة. في الجوال كل كرت يشتغل لما توصله بالسحب
  useEffect(() => {
    let next = 0;
    const timers: number[] = [];
    const io = new IntersectionObserver((entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .map((e) => Number((e.target as HTMLElement).dataset.index))
        .sort((a, b) => a - b)
        .forEach((i) => {
          io.unobserve(track.current!.children[i]);
          const now = performance.now(), at = Math.max(now, next);
          next = at + 650;
          timers.push(window.setTimeout(() => replay(i), at - now));
        });
    }, { threshold: 0.6 });
    for (const li of track.current!.children) io.observe(li);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [replay]);

  // الكروت تطلع ورا بعض لما توصل القسم
  useGSAP(() => {
    if (reduced()) return;
    gsap.set("[data-card]", { opacity: 0, y: 32 });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      gsap.to("[data-card]", { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", clearProps: "transform" });
    }, { threshold: 0.2 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, { scope: ref });

  // في الجوال: أي كرت قدّامك (للنقاط تحت). في الصفحات العربية scrollLeft بالسالب
  useEffect(() => {
    const el = track.current!;
    const onScroll = () => {
      const card = el.querySelector("li")!;
      const step = card.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);
      setActive(Math.min(SERVICES.length - 1, Math.round(Math.abs(el.scrollLeft) / step)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} id="services" className="overflow-x-clip bg-cloud py-(--section-y) text-night [--ink-base:var(--color-night)]">
      <Container>
        <h2 className="text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold leading-[1.3]">
          <Ink>وش نسوي</Ink> <span className="chip text-white">لمتجرك</span>؟
        </h2>
      </Container>

      {/* في الجوال والتابلت تتسحب بالإصبع، ومن 1024 الأربعة جنب بعض */}
      <ul ref={track} className="svc-track mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--edge) pb-4 pt-2 scroll-px-(--edge) [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        {SERVICES.map((s, i) => <ServiceCard key={s.title} {...s} index={i} play={plays[i]} onHover={() => replay(i)} />)}
      </ul>

      <Container className="mt-4 lg:mt-8">
        <div aria-hidden className="mb-6 flex justify-center gap-1.5 lg:hidden">
          {SERVICES.map((s, i) => (
            <span key={s.title} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-5 bg-night" : "w-1.5 bg-night/20"}`} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:justify-start">
          <a
            data-smile
            href={SIGNUP_URL}
            className="inline-flex h-12 items-center rounded-[14px] bg-night px-7 font-semibold text-white transition-[background-color,scale] hover:bg-night-3 active:scale-[0.97]"
          >
            اربط متجرك
          </a>
          <p className="text-[0.9375rem] text-ink-soft">والباقي علينا.</p>
        </div>
      </Container>
    </section>
  );
}

function ServiceCard({ title, text, hl, Scene, art, artAt = "50%", index, play, onHover }: Service & { index: number; play: number; onHover: () => void }) {
  return (
    <li
      data-card
      data-index={index}
      onPointerEnter={onHover}
      className="group w-[72vw] max-w-[20rem] shrink-0 snap-center sm:w-[44vw] lg:w-auto lg:max-w-none"
      style={{ "--hl": hl, "--hl-ink": "#fff" } as CSSProperties}
    >
      <div className="@container relative flex aspect-[5/7] flex-col overflow-hidden rounded-[28px] bg-night shadow-[0_24px_48px_-26px_rgb(17_19_24/0.6)] transition-transform duration-500 ease-lift group-hover:-translate-y-1">
        <div className="relative z-10 px-6 pt-6">
          <h3 className="text-[1.125rem] font-bold text-white">{title}</h3>
          <p className="mt-1 text-[0.875rem] leading-[1.7] text-mist">{text}</p>
        </div>
        {/* منطقة المشهد: بين الكلام وراس الشخصية، ونفسها في الأربعة */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-3">
          <Scene play={play} />
        </div>
        <div aria-hidden className="h-[42%] shrink-0" />
        {/* الشخصية ثابتة على حافة الكرت حتى وقت التحويم */}
        <img
          src={art}
          width={760}
          height={716}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="pointer-events-none absolute bottom-0 max-w-none -translate-x-1/2 select-none"
          style={{ width: ART.width, left: artAt }}
        />
      </div>
    </li>
  );
}
