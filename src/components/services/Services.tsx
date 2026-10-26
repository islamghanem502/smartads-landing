import { useRef } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { Section } from "../layout";

/*
 * ثلاث كروت، كل كرت دور في الفريق: الدور، ووعد في سطر، وتحتهم رسمة تشرح الباقي
 * (الشخصية وورا منها جوال فيه شغلها). الرسمة مقصوصة من الخصر، فنلصقها بحافة الكرت من تحت.
 */
const SERVICES = [
  { role: "مدير حملاتك", promise: "إعلاناتك شغّالة وتتحسّن كل ربع ساعة", tint: "bg-violet-tint", art: "/services/campaigns.webp" },
  { role: "صانع محتواك", promise: "صور وفيديوهات تنشر في حساباتك", tint: "bg-pink-tint", art: "/services/content.webp" },
  { role: "خبير السيو", promise: "متجرك أول ما يبحثون عنه", tint: "bg-amber-tint", art: "/services/seo.webp" },
];

/** «وش نسوي لمتجرك؟»: قسم أبيض بعد الهيرو الغامق. */
export function Services() {
  const ref = useRef<HTMLElement>(null);

  // الكروت تطلع ورا بعض لما توصل القسم، وبس
  useGSAP(() => {
    if (reduced()) return;
    gsap.set("[data-card]", { y: 32, opacity: 0 });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      gsap.to("[data-card]", { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" });
    }, { threshold: 0.15 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, { scope: ref });

  return (
    <Section ref={ref} id="services" className="bg-white text-night">
      <div className="max-w-[40rem]">
        <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.2]">وش نسوي لمتجرك؟</h2>
        <p className="mt-4 text-[1.125rem] leading-relaxed text-ink-soft">فريق تسويق كامل يشتغل لك، من أول إعلان لين آخر تقرير.</p>
      </div>

      <ul className="mt-14 grid gap-6 md:grid-cols-3 md:gap-4 lg:gap-6">
        {SERVICES.map((s) => (
          <li key={s.role} data-card className={`flex flex-col overflow-hidden rounded-[28px] transition-transform duration-300 ease-lift hover:-translate-y-1.5 ${s.tint}`}>
            <div className="px-8 pt-8">
              <h3 className="text-[1.5rem] font-bold leading-tight">{s.role}</h3>
              <p className="mt-2 text-[1.0625rem] text-ink-soft">{s.promise}</p>
            </div>
            <img src={s.art} alt="" loading="lazy" decoding="async" draggable={false} width={820} height={977} className="mt-auto w-full select-none" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
