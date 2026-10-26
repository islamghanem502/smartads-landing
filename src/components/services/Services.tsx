import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { Container } from "../layout";

/*
 * نظرة سريعة على خدماتنا قبل ما نفصّلها: كرت لكل خدمة، اسمها وسطر واحد، وتحت الشخصية ماسكة أداة وحدة.
 * الكرت أبيض، ولونه الخاص يطلع خفيف من تحت ويختفي قبل الكلام.
 */
const SERVICES: { title: string; text: string; tint: string; art?: string }[] = [
  { title: "الإعلانات الممولة", text: "نطلق حملاتك ونتابعها كل ربع ساعة", tint: "#e7e0ff", art: "/services/ads.webp" },
  { title: "تتبّع المبيعات", text: "كل طلب يوصل للمنصات، وإعلاناتك تتعلّم منه", tint: "#d8ecff" },
  { title: "تصميم الإعلانات", text: "صور وفيديوهات لمنتجاتك، جاهزة للإعلان", tint: "#fbe0f1" },
  { title: "النشر في حساباتك", text: "منشورات منتظمة في حساباتك", tint: "#d5f3e6" },
  { title: "السيو", text: "متجرك يظهر في قوقل والذكاء الاصطناعي", tint: "#ffe5cf", art: "/services/seo.webp" },
  { title: "التقارير", text: "تقرير كل أسبوع على واتساب، ومستشار تسأله", tint: "#fdf0c4" },
];

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`size-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

/** «وش نسوي لمتجرك؟»: شريط كروت يتحرك بالسحب أو بالأسهم، بدون تشغيل تلقائي. */
export function Services() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  // نعرف إذا الشريط عند أوله أو آخره عشان نطفي السهم. في الصفحات العربية scrollLeft يبدأ من صفر وينزل بالسالب
  useEffect(() => {
    const el = track.current!;
    const update = () => {
      const pos = Math.abs(el.scrollLeft), max = el.scrollWidth - el.clientWidth;
      setEdge({ start: pos < 4, end: pos > max - 4 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);

  // كل ضغطة تمشي كرت واحد. التالي يمشي لليسار (بالسالب) لأن الصفحة من اليمين
  const step = (dir: 1 | -1) => {
    const el = track.current!;
    const card = el.querySelector("li")!;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: -dir * (card.offsetWidth + gap), behavior: reduced() ? "auto" : "smooth" });
  };

  // الكروت تطلع ورا بعض لما توصل القسم
  useGSAP(() => {
    if (reduced()) return;
    gsap.set("[data-card]", { y: 28, opacity: 0 });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      gsap.to("[data-card]", { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: "power3.out" });
    }, { threshold: 0.2 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, { scope: ref });

  const arrow = "grid size-12 place-items-center rounded-full bg-white text-night ring-1 ring-night/10 transition-colors hover:bg-night hover:text-white disabled:pointer-events-none disabled:opacity-35";

  return (
    <section ref={ref} id="services" className="overflow-x-clip bg-cloud py-(--section-y) text-night">
      <Container>
        <div className="max-w-[40rem]">
          <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.2]">وش نسوي لمتجرك؟</h2>
          <p className="mt-4 text-[1.125rem] leading-relaxed text-ink-soft">فريق تسويق كامل يشتغل لك، من أول إعلان لين آخر تقرير.</p>
        </div>
      </Container>

      <ul
        ref={track}
        tabIndex={0}
        aria-label="خدماتنا"
        className="svc-track mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-(--edge) py-4 scroll-px-(--edge) [scrollbar-width:none] focus-visible:outline-offset-[-2px] [&::-webkit-scrollbar]:hidden"
      >
        {SERVICES.map((s) => (
          <li
            key={s.title}
            data-card
            style={{ "--tint": s.tint } as CSSProperties}
            className="relative aspect-[3/4] w-[78vw] max-w-[22rem] shrink-0 snap-center overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgb(17_19_24/0.05),0_14px_34px_-18px_rgb(17_19_24/0.2)] sm:w-[clamp(16.5rem,25vw,21rem)] sm:snap-start"
          >
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,var(--tint),transparent_68%)]" />
            <div className="relative p-7">
              <h3 className="text-[1.375rem] font-bold leading-tight">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p>
            </div>
            {s.art && (
              <>
                {/* ظل خفيف تحت الرجلين عشان تبان واقفة على أرض الكرت */}
                <span aria-hidden className="absolute bottom-[4.2%] left-1/2 h-[3.5%] w-[40%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(17_19_24/0.14),transparent)]" />
                <img src={s.art} width={760} height={930} alt="" loading="lazy" decoding="async" draggable={false} className="absolute bottom-[5%] left-1/2 w-[70%] max-w-none -translate-x-1/2 select-none" />
              </>
            )}
          </li>
        ))}
      </ul>

      <Container className="mt-6 flex justify-end gap-3">
        <button type="button" aria-label="السابق" disabled={edge.start} onClick={() => step(-1)} className={arrow}>
          <Chevron className="-scale-x-100" />
        </button>
        <button type="button" aria-label="التالي" disabled={edge.end} onClick={() => step(1)} className={arrow}>
          <Chevron />
        </button>
      </Container>
    </section>
  );
}
