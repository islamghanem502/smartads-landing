import { useRef, type ComponentType } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { Section } from "../layout";
import { Facebook, Google, Instagram, Meta, Snapchat, TikTok, type Logo } from "../logos";
import { CampaignsPeek } from "./peeks";

/* كل خدمة لها لون من التدرّج: لوح الرسمة وعلامات النقاط */
const TONES = {
  violet: { panel: "bg-violet-soft", mark: "text-violet" },
  pink: { panel: "bg-pink-soft", mark: "text-pink" },
  amber: { panel: "bg-amber-soft", mark: "text-amber" },
};

/*
 * الكلام في الكرت على طبقتين: الدور والوعد (يفهمه في 5 ثواني)، بعدها الإثبات:
 * لمحة من المنتج نفسه، ولو ما جهزت لمحته بعد، نقطتين بالكثير. ما نحط الاثنين لأنهم يقولون نفس الشي.
 * الرسمة واللمحة يشرحون الباقي، والتفاصيل في الأقسام اللي بعده.
 */
type Service = {
  role: string;
  promise: string;
  points?: string[];
  on: Logo[];
  tone: keyof typeof TONES;
  art?: { src: string; width: number; height: number };
  Peek?: ComponentType;
};

const SERVICES: Service[] = [
  {
    role: "مدير حملاتك",
    promise: "يطلق إعلاناتك ويحسّنها كل ربع ساعة",
    on: [Snapchat, TikTok, Meta, Google],
    tone: "violet",
    art: { src: "/services/campaigns.webp", width: 1019, height: 900 },
    Peek: CampaignsPeek,
  },
  {
    role: "صانع محتواك",
    promise: "يصمّم صورك وفيديوهاتك وينشرها",
    points: ["صور وفيديوهات لمنتجاتك", "نشر بجدول في حساباتك"],
    on: [Instagram, TikTok, Facebook],
    tone: "pink",
  },
  {
    role: "خبير السيو",
    promise: "يخلّي قوقل والذكاء الاصطناعي يلقون متجرك",
    points: ["وصف ومقالات بكلمات البحث", "منتجاتك تطلع بالسعر والتقييم"],
    on: [Google],
    tone: "amber",
  },
];

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={`size-5 shrink-0 ${className}`}>
      <circle cx="10" cy="10" r="10" fill="currentColor" fillOpacity=".14" />
      <path d="m6 10.5 2.6 2.5L14 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServiceCard({ s }: { s: Service }) {
  const tone = TONES[s.tone];
  return (
    <article data-card className="overflow-hidden rounded-[28px] bg-white ring-1 ring-night/5 transition-transform duration-300 ease-lift hover:-translate-y-1">
      <div className={`relative aspect-[5/4] overflow-hidden ${tone.panel}`}>
        {s.art && (
          <img data-art src={s.art.src} width={s.art.width} height={s.art.height} alt="" loading="lazy" decoding="async" draggable={false} className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 select-none" />
        )}
      </div>
      <div className="p-6 lg:p-7">
        <h3 className="text-[1.375rem] font-bold leading-tight">{s.role}</h3>
        <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-soft">{s.promise}</p>
        {s.Peek ? (
          <div className="mt-5"><s.Peek /></div>
        ) : (
          <ul className="mt-5 grid gap-2.5">
            {s.points?.map((p) => (
              <li key={p} className="flex items-center gap-2.5 font-medium">
                <Check className={tone.mark} />
                {p}
              </li>
            ))}
          </ul>
        )}
        <ul aria-label="المنصات" className="mt-6 flex gap-2">
          {s.on.map((L, i) => (
            <li key={i} className="grid size-10 place-items-center rounded-xl bg-paper">
              <L className="size-5" />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** «وش نسوي لك؟»: الفريق اللي ما تحتاج توظّفه. القسم فاتح، فيكسر الغامق اللي قبله. */
export function Services() {
  const ref = useRef<HTMLElement>(null);

  // الكروت تطلع لما توصلها، والشخصية تطلع من تحت لوحها، واللمحة بعدها
  useGSAP(() => {
    if (reduced()) return;
    gsap.set("[data-card]", { y: 28, opacity: 0 });
    gsap.set("[data-art]", { yPercent: 16, opacity: 0 });
    gsap.set("[data-peek]", { y: 10, opacity: 0 });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .to("[data-card]", { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 })
        .to("[data-art]", { yPercent: 0, opacity: 1, duration: 0.8, ease: "back.out(1.4)", stagger: 0.12 }, 0.25)
        .to("[data-peek]", { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, 0.6);
    }, { threshold: 0.2 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, { scope: ref });

  return (
    <Section ref={ref} id="services" className="bg-paper text-night">
      <div className="max-w-[40rem]">
        <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.2]">وش نسوي لك؟</h2>
        <p className="mt-4 text-[1.125rem] leading-relaxed text-ink-soft">ثلاثة يشتغلون عنك كل يوم، وأنت فاضي لمتجرك.</p>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6">
        {SERVICES.map((s) => (
          <ServiceCard key={s.role} s={s} />
        ))}
      </div>
    </Section>
  );
}
