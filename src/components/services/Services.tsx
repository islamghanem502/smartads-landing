import { useRef } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { Section } from "../layout";

/*
 * الكروت للشرح بس: اسم الخدمة، سطرين يشرحونها، وتحت سطر خفيف بالمنصات أو اللي تشمله.
 * بدون أيقونات ولا شارات: الكلام هو المحتوى.
 */
const SERVICES = [
  {
    title: "الإعلانات الممولة",
    text: "نطلق حملاتك ونتابعها كل 15 دقيقة: نوقف الإعلان اللي ما يبيع، ونزيد ميزانية الإعلان اللي يجيب طلبات.",
    meta: ["سناب شات", "تيك توك", "ميتا", "قوقل"],
  },
  {
    title: "تتبّع المبيعات",
    text: "نربط متجرك بالمنصات الإعلانية، فكل زيارة وإضافة للسلة وطلب توصل لها. كذا إعلاناتك تعرف مين يشتري فعلاً، وتوصل لناس يشبهونه.",
    meta: ["سلة", "زد", "موقعك الخاص"],
  },
  {
    title: "تصميم الإعلانات",
    text: "نصمّم صور إعلانية وفيديوهات قصيرة لمنتجاتك، بمقاس كل منصة، وجاهزة للإعلان أو النشر على طول.",
    meta: ["صور إعلانية", "فيديوهات قصيرة"],
  },
  {
    title: "إدارة حساباتك",
    text: "ننشر في حساباتك بجدول ثابت عشان تبقى نشطة، وكل منشور يناسب هوية متجرك. والرد على التعليقات قريباً.",
    meta: ["انستقرام", "تيك توك", "فيسبوك"],
  },
  {
    title: "السيو",
    text: "نكتب وصف منتجاتك ومقالات مدونتك بالكلمات اللي يبحث عنها عملاؤك، ونجهّز متجرك عشان يظهر في قوقل وفي إجابات أدوات الذكاء الاصطناعي.",
    meta: ["قوقل", "أدوات الذكاء الاصطناعي"],
  },
  {
    title: "الخطة والتقارير",
    text: "خطة تسويق لكل شهر، وتقرير أسبوعي وشهري يوصلك على واتساب، ومستشار تسأله عن متجرك متى ما تبي.",
    meta: ["واتساب"],
  },
];

/** «وش نسوي لمتجرك؟»: نفس غامق الهيرو، والكروت أفتح منه بدرجة. */
export function Services() {
  const ref = useRef<HTMLElement>(null);

  // الكروت تطلع ورا بعض لما توصل القسم، وبعدها الشخصية تنط وتقعد على حافتها
  useGSAP(() => {
    if (reduced()) return;
    gsap.set("[data-card]", { y: 24, opacity: 0 });
    gsap.set("[data-sitter]", { y: -28, opacity: 0 });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      gsap.timeline()
        .to("[data-card]", { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" })
        .to("[data-sitter]", { y: 0, opacity: 1, duration: 0.6, ease: "back.out(2.2)" }, 0.45);
    }, { threshold: 0.15 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, { scope: ref });

  return (
    <Section ref={ref} id="services">
      <div className="max-w-[40rem]">
        <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.2]">وش نسوي لمتجرك؟</h2>
        <p className="mt-4 text-[1.125rem] leading-relaxed text-mist">فريق تسويق كامل يشتغل لك، من أول إعلان لين آخر تقرير.</p>
      </div>

      {/* الشخصية قاعدة على حافة أول كرت من اليسار: يدينها على الحافة (78.7٪ من طول الصورة) ورجولها متدلية على الكرت.
          --mw عرضها، ومنه نحسب كم تطلع فوق الكروت، فنبعد الكروت عن الكلام بنفس القدر لما يكون الكلام بعرض الشاشة */}
      <div className="relative mt-[calc(var(--mw)*0.82+1rem)] [--mw:clamp(7rem,11vw,10rem)] lg:mt-14">
        <img
          data-sitter
          src="/mascot-sitting.webp"
          width={621}
          height={640}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="pointer-events-none absolute left-6 top-[calc(var(--mw)*-0.811)] z-10 w-(--mw) select-none"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.title} data-card className="flex flex-col rounded-[20px] bg-night-2 p-7 ring-1 ring-line transition-shadow duration-300 hover:ring-white/15">
              <h3 className="text-[1.25rem] font-semibold">{s.title}</h3>
              <p className="mt-3 flex-1 leading-[1.85] text-mist">{s.text}</p>
              <p className="mt-6 border-t border-line pt-4 text-[0.875rem] text-fog">{s.meta.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
