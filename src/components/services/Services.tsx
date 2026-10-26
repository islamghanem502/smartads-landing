import { useRef, type ComponentType } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { Ink } from "../Ink";
import { Container } from "../layout";
import { AdsScene, ArrowUp, Bars, Heart, Megaphone, ReportsScene, SeoScene, SocialScene, Tile } from "./scenes";

/*
 * أربع كروت تبان كلها مرة وحدة: أيقونة وعنوان قصير، تحته واجهة من المنتج، وتحتها الشخصية تتفاعل معها
 * وطالعة من حافة الكرت. الكروت غامقة (نفس هوية الهيرو) على القسم الفاتح، وكل كرت مايل بزاوية خفيفة.
 */
type Card = { title: string; tile: string; Icon: ComponentType; Scene: ComponentType; art: string; tilt: string };

const CARDS: Card[] = [
  { title: "إعلانات تبيع.", tile: "#7c5cff", Icon: Megaphone, Scene: AdsScene, art: "/services/ads.webp", tilt: "lg:[--r:-3deg] lg:[--y:10px]" },
  { title: "حسابات تكبر.", tile: "#ffe1ea", Icon: Heart, Scene: SocialScene, art: "/services/social.webp", tilt: "lg:[--r:2deg] lg:[--y:0px]" },
  { title: "سيو يتصدّر.", tile: "#fde047", Icon: ArrowUp, Scene: SeoScene, art: "/services/seo.webp", tilt: "lg:[--r:-2deg] lg:[--y:16px]" },
  { title: "تقارير توصلك.", tile: "#25d366", Icon: Bars, Scene: ReportsScene, art: "/services/reports.webp", tilt: "lg:[--r:3deg] lg:[--y:4px]" },
];

export function Services() {
  const ref = useRef<HTMLElement>(null);

  // الكروت تطلع ورا بعض لما توصل القسم
  useGSAP(() => {
    if (reduced()) return;
    gsap.set("[data-card]", { opacity: 0, yPercent: 8 });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      gsap.to("[data-card]", { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.09, ease: "power3.out" });
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

      {/* في الجوال والتابلت تتسحب بالإصبع، ومن 1024 الأربعة جنب بعض.
          الميلان من --r و--y عشان التحويم يقدر يعدّله، وGSAP يحرّك yPercent بس فما يلمسه */}
      <ul className="svc-track mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--edge) pb-6 pt-3 scroll-px-(--edge) [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        {CARDS.map(({ title, tile, Icon, Scene, art, tilt }) => (
          <li key={title} data-card className={`shrink-0 snap-center [--r:0deg] [--y:0px] ${tilt}`}>
            <div className="relative aspect-[5/8] w-[72vw] max-w-[20rem] overflow-hidden rounded-[28px] bg-night ring-1 ring-white/5 [transform:translateY(var(--y))_rotate(var(--r))] shadow-[0_24px_48px_-24px_rgb(17_19_24/0.55)] transition-transform duration-500 ease-lift hover:[transform:translateY(-6px)_rotate(0deg)] sm:w-[44vw] lg:w-auto lg:max-w-none">
              <div className="flex flex-col items-center px-5 pt-6 text-center">
                <Tile bg={tile}><Icon /></Tile>
                <h3 className="mt-4 text-[1.375rem] font-bold text-white">{title}</h3>
              </div>
              <div className="mt-4">
                <Scene />
              </div>
              <img src={art} width={760} height={716} alt="" loading="lazy" decoding="async" draggable={false} className="pointer-events-none absolute bottom-0 left-1/2 w-[86%] max-w-none -translate-x-1/2 select-none" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
