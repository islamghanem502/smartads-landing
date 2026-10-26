import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { Ink } from "../Ink";
import { Container } from "../layout";
import { BudgetScene, ChatScene, SearchScene, StudioScene, type SceneProps } from "./scenes";

/*
 * كل خدمة كرت غامق واحد: العنوان ووصف بسطر يمين فوق، مشهد من منتجنا في النص، والشخصية تحت مقصوصة
 * عند الخصر على حافة الكرت. الكلمة المهمة في الوصف عليها قلم تظليل بلون الخدمة (.hl).
 *   backdrop: المشهد ورا الشخصية ويملا الكرت (الرينق لايت)، بدل ما يكون لوحة في النص
 */
type Service = {
  title: string;
  text: ReactNode;
  hl: string;
  Scene: ComponentType<SceneProps>;
  backdrop?: boolean;
  art: string;
};

const SERVICES: Service[] = [
  { title: "الإعلانات الممولة", text: <>نطلقها ونحسّنها <mark className="hl">كل ربع ساعة</mark>.</>, hl: "rgb(124 92 255 / 0.55)", Scene: BudgetScene, art: "/services/ads.webp" },
  { title: "محتوى حساباتك", text: <>نصمّمه وننشره <mark className="hl">بجدول ثابت</mark>.</>, hl: "rgb(232 90 166 / 0.5)", Scene: StudioScene, backdrop: true, art: "/services/content.webp" },
  { title: "السيو", text: <>متجرك <mark className="hl">أول</mark> في قوقل والذكاء الاصطناعي.</>, hl: "rgb(255 169 77 / 0.5)", Scene: SearchScene, art: "/services/seo.webp" },
  { title: "التقارير والمستشار", text: <>تقريرك ومستشارك على <mark className="hl">واتساب</mark>.</>, hl: "rgb(59 143 230 / 0.6)", Scene: ChatScene, art: "/services/reports.webp" },
];

export function Services() {
  const ref = useRef<HTMLElement>(null);

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

  return (
    <section ref={ref} id="services" className="overflow-x-clip bg-cloud py-(--section-y) text-night [--ink-base:var(--color-night)]">
      <Container>
        <h2 className="text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold leading-[1.3]">
          <Ink>وش نسوي</Ink> <span className="chip text-white">لمتجرك</span>؟
        </h2>
      </Container>

      {/* في الجوال والتابلت تتسحب بالإصبع، ومن 1024 الأربعة جنب بعض */}
      <ul className="svc-track mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--edge) pb-4 pt-2 scroll-px-(--edge) [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        {SERVICES.map((s) => <ServiceCard key={s.title} {...s} />)}
      </ul>
    </section>
  );
}

function ServiceCard({ title, text, hl, Scene, backdrop, art }: Service) {
  const ref = useRef<HTMLLIElement>(null);
  const [play, setPlay] = useState(0);

  // القصة تشتغل لما يبان الكرت كله تقريباً (في الجوال: لما توصله بالسحب)، وتعيد مع كل تحويم
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setPlay((p) => p + 1);
    }, { threshold: 0.6 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      data-card
      onPointerEnter={() => setPlay((p) => p + 1)}
      className="group w-[72vw] max-w-[20rem] shrink-0 snap-center sm:w-[44vw] lg:w-auto lg:max-w-none"
      style={{ "--hl": hl, "--hl-ink": "#fff" } as CSSProperties}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-night shadow-[0_24px_48px_-26px_rgb(17_19_24/0.6)] transition-transform duration-500 ease-lift group-hover:-translate-y-1">
        {backdrop && <Scene play={play} />}
        <div className="relative px-6 pt-6">
          <h3 className="text-[1.125rem] font-bold text-white">{title}</h3>
          <p className="mt-1 text-[0.875rem] text-mist">{text}</p>
        </div>
        {!backdrop && (
          <div className="relative mt-3">
            <Scene play={play} />
          </div>
        )}
        {/* الشخصية تطلّ شوي لما تمرّ على الكرت */}
        <img src={art} width={760} height={716} alt="" loading="lazy" decoding="async" draggable={false} className="pointer-events-none absolute bottom-0 left-1/2 w-[58%] max-w-none -translate-x-1/2 select-none transition-transform duration-500 ease-lift group-hover:-translate-y-2" />
      </div>
    </li>
  );
}
