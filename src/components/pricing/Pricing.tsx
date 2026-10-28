import { SIGNUP_URL } from "../../lib/links";
import { Ink } from "../Ink";
import { Container } from "../layout";

/*
 * الأسعار: الباقات الثلاث فيها نفس الخدمات بالضبط، والفرق بس في سقف ميزانيتك الإعلانية الشهرية.
 * فكل كرت فيه السعر ومقياس صغير للميزانية، والخدمات مكتوبة مرة وحدة تحت («في كل الباقات»).
 * الأسعار والسقوف من lib/subscription-plans في المنصة. لو تغيّرت هناك غيّرها هنا.
 */
const PLANS = [
  { name: "المبتدئ", price: 799, budget: "لين 20 ألف ريال", fill: "33%" },
  { name: "النمو", price: 999, budget: "من 20 لين 50 ألف ريال", fill: "66%", popular: true },
  { name: "المحترف", price: 1499, budget: "بدون سقف", fill: "100%" },
];

const INCLUDED = [
  "كل المنصات: ميتا، قوقل، تيك توك، سناب",
  "حملات بدون حد",
  "نحسّن حملاتك كل 15 دقيقة، 24 ساعة",
  "كل قرار نشرحه لك بالعربي",
  "محتوى يومي بهوية متجرك",
  "سيو لمنتجاتك ومقالات لمدونتك",
  "تقارير يومية واضحة",
  "مستشارك على واتساب 24 ساعة",
  "تنبيهات قبل كل موسم",
  "دعم فني بالعربي",
  "تلغي بضغطة، بدون التزام",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-(--section-y)">
      <Container>
        <div className="text-center">
          <h2 className="text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.3]">
            <Ink>كل الخدمات،</Ink> <span className="chip">في كل باقة</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[34rem] text-balance text-[1.125rem] leading-[1.8] text-mist">
            الفرق بين الباقات بس في حجم ميزانيتك الإعلانية. وأول أسبوع على حسابنا.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {PLANS.map((plan) => (
            <li key={plan.name} className={`rounded-[30px] p-px ${plan.popular ? "bg-(image:--gradient)" : "bg-line"}`}>
              <div className="flex h-full flex-col rounded-[29px] bg-night-2 p-6 sm:p-8">
                {/* في الجوال الاسم والسعر في سطر واحد عشان الكرت يقصر */}
                <div className="flex items-center justify-between gap-4 sm:block">
                  <div className="flex items-center gap-2.5 sm:justify-between">
                    <h3 className="text-[1.125rem] font-semibold text-mist">{plan.name}</h3>
                    {plan.popular && <span className="rounded-full bg-(image:--gradient) px-3 py-1 text-[0.8125rem] font-semibold">الأكثر طلباً</span>}
                  </div>
                  <p className="flex items-baseline gap-2 sm:mt-5">
                    <span className="text-[2.5rem] font-bold leading-none tabular-nums sm:text-[3.25rem]">{plan.price.toLocaleString("en-US")}</span>
                    <span className="text-[0.9375rem] text-mist sm:text-[1rem]">ريال/شهر</span>
                  </p>
                </div>

                {/* ميزانيتك الإعلانية: الفرق الوحيد بين الباقات */}
                <div className="mt-5 sm:mt-7">
                  <div className="flex items-baseline justify-between gap-3 text-[0.9375rem]">
                    <span className="text-mist">ميزانيتك الإعلانية</span>
                    <span className="font-semibold">{plan.budget}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                    <div className="h-full rounded-full bg-(image:--gradient)" style={{ width: plan.fill }} />
                  </div>
                </div>

                <a
                  href={SIGNUP_URL}
                  className={`mt-6 inline-flex h-12 items-center justify-center rounded-[14px] text-[1rem] font-semibold transition-[background-color,scale] active:scale-[0.97] sm:mt-8 sm:h-13 ${
                    plan.popular ? "bg-white text-night hover:bg-[#e9eaee]" : "bg-white/[0.08] text-white hover:bg-white/[0.14]"
                  }`}
                >
                  ابدأ أسبوعك المجاني
                </a>
              </div>
            </li>
          ))}
        </ul>

        {/* الخدمات: نفسها في الثلاث */}
        <div className="mt-4 rounded-[30px] bg-night-2 p-6 ring-1 ring-line sm:p-8 lg:mt-6 lg:p-10">
          <h3 className="text-[1.25rem] font-bold">في كل الباقات</h3>
          <ul className="mt-5 grid gap-x-8 gap-y-3.5 sm:mt-6 sm:grid-cols-2 sm:gap-y-4 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[1rem] leading-[1.6] text-mist">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-(image:--gradient) text-white">
                  <svg viewBox="0 0 16 16" aria-hidden className="size-3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-line pt-6 text-[0.9375rem] text-fog">ميزانية إعلاناتك منفصلة عن سعر الباقة.</p>
        </div>
      </Container>
    </section>
  );
}
