import { SIGNUP_URL } from "@/lib/links";
import { Hand } from "@/components/ui/Hand";
import { Mark } from "@/components/ui/Mark";
import { Pin } from "@/components/ui/Pin";
import { H2, Section, paperShadowDark } from "@/components/ui/Section";

/* من باقات المنصة نفسها: نفس المميزات، والفرق في سقف الميزانية الإعلانية الشهرية */
const PLANS = [
  { name: "المبتدئ", price: "٧٩٩", cap: "ميزانية إعلانية لين ٢٠ ألف ريال بالشهر", rot: 1.5 },
  { name: "النمو", price: "٩٩٩", cap: "ميزانية إعلانية لين ٥٠ ألف ريال بالشهر", rot: -1, popular: true },
  { name: "المحترف", price: "١٬٤٩٩", cap: "ميزانية إعلانية بدون سقف", rot: 2 },
];

const ALL = [
  "كل المنصات: سناب وتيك توك وميتا وقوقل",
  "حملات بدون حد",
  "تحسين آلي كل ١٥ دقيقة، على مدار الساعة",
  "كل قرار مشروح لك بالعربي",
  "تكلم مسوّقك الذكي أي وقت",
  "محتوى تسويقي يومي بهوية متجرك",
  "تحسين ظهورك في قوقل",
  "تقارير يومية، وتنبيه قبل كل موسم",
  "دعم فني بالعربي",
  "تلغي بضغطة، بدون التزام",
];

export function Pricing() {
  return (
    <Section id="pricing" theme="dark">
      <div className="mx-auto max-w-[80rem] px-5 py-28 lg:px-8 lg:py-36">
        <div className="max-w-[40rem]">
          <H2>
            كل الباقات فيها كل شي. تختار بس <Mark>سقف ميزانيتك</Mark>.
          </H2>
          <p className="mt-5 text-[1.0625rem] leading-[1.9] text-chalk-soft">نفس المميزات ونفس المنصات في كل باقة. الفرق في أعلى ميزانية إعلانية نديرها لك بالشهر.</p>
        </div>

        <ul className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {PLANS.map((p) => (
            <li key={p.name} className="relative" style={{ transform: `rotate(${p.rot}deg)` }}>
              {p.popular && (
                <p className="absolute -top-14 left-4 flex items-end gap-1 font-hand text-[1.35rem] text-chalk">
                  الأكثر اختيار
                  <Hand shape="arrow" className="mb-[-1.6rem] h-10 w-16 -scale-x-100 text-chalk" width={1.8} />
                </p>
              )}
              <div className={`relative rounded-[6px] bg-paper px-6 pb-7 pt-10 text-ink ${paperShadowDark} ${p.popular ? "ring-2 ring-green" : ""}`}>
                <Pin className="left-1/2 top-3" size={32} />
                <h3 className="font-display text-[1.25rem] font-bold">{p.name}</h3>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-[2.75rem] font-extrabold leading-none tabular-nums">{p.price}</span>
                  <span className="text-[0.9375rem] text-ink-soft">ريال بالشهر</span>
                </p>
                <p className="mt-4 border-t border-dashed border-ink/20 pt-4 text-[0.9375rem] font-medium">{p.cap}</p>
                <a
                  href={SIGNUP_URL}
                  className={`mt-6 flex h-11 items-center justify-center rounded-[10px] font-display text-[0.9375rem] font-semibold transition-colors ${p.popular ? "bg-green text-white hover:bg-green-deep" : "bg-ink text-white hover:bg-black"}`}
                >
                  ابدأ بـ{p.name}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-10 border-t border-white/12 pt-12 lg:grid-cols-[0.7fr_1.3fr]">
          <h3 className="font-display text-[1.25rem] font-bold">في كل باقة</h3>
          <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
            {ALL.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[1rem] text-chalk">
                <svg viewBox="0 0 24 24" className="mt-1 size-5 shrink-0 text-green-on-dark" aria-hidden>
                  <path d="M3.5 12.8c2 1.8 4 4 5.6 6.2 3.2-5.6 7-10.4 11.6-14.6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-[0.875rem] leading-[1.8] text-chalk-soft">
          ميزانية الإعلانات نفسها منفصلة عن الاشتراك. وتصميم الفيديو والصور الإعلانية يُحسب من محفظتك على قد استخدامك.
        </p>
      </div>
    </Section>
  );
}
