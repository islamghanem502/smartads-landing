import { useRef, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { Ink } from "../Ink";
import { Container } from "../layout";
import { BudgetScene, ReportsScene, SeoScene, SocialScene } from "./scenes";

/*
 * كل خدمة: العنوان ووصف بسطر، وتحتهم كرت غامق قصير. الواجهة والشخصية بحجمهم الكامل فوق الكرت،
 * فيطلعون من حافته العليا على الخلفية الفاتحة، والشخصية مقصوصة عند الخصر على حافته السفلى.
 * الكلمة المهمة في الوصف عليها قلم تظليل بلون الخدمة (.hl)، ونفس اللون يتوهّج خفيف داخل الكرت.
 */
type Service = {
  title: string;
  text: ReactNode;
  accent: string; // لون الواجهة
  hl: string; // لون قلم التظليل
  glow: string; // التوهّج تحت الشخصية
  Scene: ComponentType<{ accent: string }>;
  art: string;
};

const SERVICES: Service[] = [
  {
    title: "الإعلانات الممولة",
    text: <>نطلقها ونحسّنها <mark className="hl">كل ربع ساعة</mark>.</>,
    accent: "#8b6cff",
    hl: "#dcd2ff",
    glow: "rgb(124 92 255 / 0.38)",
    Scene: BudgetScene,
    art: "/services/ads.webp",
  },
  {
    title: "محتوى حساباتك",
    text: <>نصمّمه وننشره <mark className="hl">بجدول ثابت</mark>.</>,
    accent: "#e85aa6",
    hl: "#ffd3e8",
    glow: "rgb(232 90 166 / 0.32)",
    Scene: SocialScene,
    art: "/services/social.webp",
  },
  {
    title: "السيو",
    text: <>متجرك <mark className="hl">أول</mark> في قوقل والذكاء الاصطناعي.</>,
    accent: "#ffa94d",
    hl: "#ffe0bf",
    glow: "rgb(255 169 77 / 0.3)",
    Scene: SeoScene,
    art: "/services/seo.webp",
  },
  {
    title: "التقارير والمستشار",
    text: <>تقريرك ومستشارك على <mark className="hl">واتساب</mark>.</>,
    accent: "#3b8fe6",
    hl: "#cfe2ff",
    glow: "rgb(59 143 230 / 0.32)",
    Scene: ReportsScene,
    art: "/services/reports.webp",
  },
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
        {SERVICES.map(({ title, text, accent, hl, glow, Scene, art }) => (
          <li key={title} data-card className="group w-[72vw] max-w-[20rem] shrink-0 snap-center sm:w-[44vw] lg:w-auto lg:max-w-none" style={{ "--hl": hl } as CSSProperties}>
            <h3 className="text-[1.125rem] font-bold">{title}</h3>
            <p className="mt-1 text-[0.9375rem] text-ink-soft">{text}</p>
            {/* المسرح بحجم الرسمة كاملة، والكرت الغامق نصّه السفلي بس. كل واجهة قاعدة على حافة الكرت العليا مهما كان طولها */}
            <div className="relative mt-5 aspect-[6/7]">
              <div className="absolute inset-x-0 bottom-0 h-[52%] overflow-hidden rounded-[24px] bg-night shadow-[0_22px_44px_-26px_rgb(17_19_24/0.6)]">
                <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(80% 90% at 50% 100%, ${glow}, transparent)` }} />
              </div>
              <div className="absolute inset-x-0 bottom-[51%] transition-transform duration-500 ease-lift group-hover:-translate-y-1">
                <Scene accent={accent} />
              </div>
              {/* الشخصية تطلّ أكثر لما تمرّ على الكرت */}
              <img src={art} width={760} height={716} alt="" loading="lazy" decoding="async" draggable={false} className="pointer-events-none absolute bottom-0 left-1/2 w-[70%] max-w-none -translate-x-1/2 select-none transition-transform duration-500 ease-lift group-hover:-translate-y-2" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
