import { useState } from "react";
import { SIGNUP_URL } from "../../lib/links";
import { Ink } from "../Ink";
import { Container } from "../layout";

/*
 * الأسعار: الباقات الثلاث فيها نفس الخدمات بالضبط، والفرق بس في سقف ميزانيتك الإعلانية الشهرية.
 * في اللابتوب كل باقة كرت فيه السعر ومقياس صغير للميزانية، والخدمات مكتوبة مرة وحدة تحت («في كل الباقات»).
 * في الجوال والتابلت ما يحتاج يقارن ثلاث كروت فوق بعض: كرت واحد يسأله «كم ميزانيتك الإعلانية بالشهر؟»،
 * يختار، ونوريه باقته (يبدأ على النمو، الأكثر طلباً). والخدمات أهمها بس، والباقي بزر «شوف كل الخدمات».
 * الأسعار والسقوف من lib/subscription-plans في المنصة. لو تغيّرت هناك غيّرها هنا.
 */
const PLANS = [
  { name: "المبتدئ", price: 799, budget: "لين 20 ألف ريال", pick: "لين 20 ألف", fill: "33%" },
  { name: "النمو", price: 999, budget: "من 20 لين 50 ألف ريال", pick: "لين 50 ألف", fill: "66%", popular: true },
  { name: "المحترف", price: 1499, budget: "بدون سقف", pick: "فوق 50 ألف", fill: "100%" },
];
type Plan = (typeof PLANS)[number];

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
/** اللي تبان في الجوال قبل «شوف كل الخدمات»: المنصات، والتحسين، والمحتوى، والسيو */
const TOP = new Set([0, 2, 4, 5]);

export function Pricing() {
  const [all, setAll] = useState(false);
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

        <Picker />

        <ul className="mt-12 hidden gap-5 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-6">
          {PLANS.map((plan) => (
            <li key={plan.name} className={`rounded-[30px] p-px ${plan.popular ? "bg-(image:--gradient)" : "bg-line"}`}>
              <div className="flex h-full flex-col rounded-[29px] bg-night-2 p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-[1.125rem] font-semibold text-mist">{plan.name}</h3>
                  {plan.popular && <Popular />}
                </div>
                <Price plan={plan} />
                <Budget plan={plan} />
                <a
                  href={SIGNUP_URL}
                  className={`mt-8 inline-flex h-13 items-center justify-center rounded-[14px] text-[1rem] font-semibold transition-[background-color,scale] active:scale-[0.97] ${
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
        <div className="mt-5 rounded-[30px] bg-night-2 p-7 ring-1 ring-line sm:p-8 lg:mt-6 lg:p-10">
          <h3 className="text-[1.25rem] font-bold">في كل الباقات</h3>
          <ul id="included" className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item, i) => (
              <li key={item} className={`flex items-start gap-3 text-[1rem] leading-[1.6] text-mist ${TOP.has(i) || all ? "" : "max-lg:hidden"}`}>
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-(image:--gradient) text-white">
                  <svg viewBox="0 0 16 16" aria-hidden className="size-3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          {!all && (
            <button
              type="button"
              aria-expanded={false}
              aria-controls="included"
              onClick={() => setAll(true)}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white/[0.06] px-5 text-[0.9375rem] font-semibold ring-1 ring-white/10 transition-colors hover:bg-white/[0.1] lg:hidden"
            >
              شوف كل الخدمات ({INCLUDED.length})
              <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )}
          <p className="mt-8 border-t border-line pt-6 text-[0.9375rem] text-fog">ميزانية إعلاناتك منفصلة عن سعر الباقة.</p>
        </div>
      </Container>
    </section>
  );
}

/*
 * الجوال والتابلت: «كم ميزانيتك الإعلانية بالشهر؟» وثلاث اختيارات، والكرت يوريه باقته.
 * المؤشر الأبيض ينزلق للاختيار (نفس اختيار «وش نمسك لك» في «كيف نشتغل»)، والباقة تتبدّل بحركة خفيفة (swap في index.css).
 */
function Picker() {
  const [at, setAt] = useState(1);
  const plan = PLANS[at];
  return (
    <div className={`mt-10 rounded-[30px] p-px transition-[background] lg:hidden ${plan.popular ? "bg-(image:--gradient)" : "bg-line"}`}>
      <div className="rounded-[29px] bg-night-2 p-6 sm:p-8">
        <p id="budget-q" className="text-[1.0625rem] font-semibold">كم ميزانيتك الإعلانية بالشهر؟</p>
        <div role="radiogroup" aria-labelledby="budget-q" className="relative mt-4 grid grid-cols-3 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10">
          <span
            aria-hidden
            className="absolute inset-y-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-white transition-[right] duration-300 ease-lift"
            style={{ right: `calc(0.25rem + ${at} * (100% - 0.5rem) / 3)` }}
          />
          {PLANS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              role="radio"
              aria-checked={at === i}
              onClick={() => setAt(i)}
              className={`relative h-11 whitespace-nowrap rounded-full px-1 text-[0.8125rem] font-semibold transition-colors duration-300 min-[380px]:text-[0.875rem] ${at === i ? "text-night" : "text-white/70"}`}
            >
              {p.pick}
            </button>
          ))}
        </div>

        {/* key: كل ما تتغيّر الباقة تعيد حركة الدخول */}
        <div key={plan.name} className="swap mt-7">
          <div className="flex items-center justify-between">
            <h3 className="text-[1.125rem] font-semibold text-mist">باقة {plan.name}</h3>
            {plan.popular && <Popular />}
          </div>
          <Price plan={plan} />
          <Budget plan={plan} />
        </div>

        <a
          href={SIGNUP_URL}
          className="mt-7 inline-flex h-13 w-full items-center justify-center rounded-[14px] bg-white text-[1rem] font-semibold text-night transition-[background-color,scale] hover:bg-[#e9eaee] active:scale-[0.97]"
        >
          ابدأ أسبوعك المجاني
        </a>
      </div>
    </div>
  );
}

function Popular() {
  return <span className="rounded-full bg-(image:--gradient) px-3 py-1 text-[0.8125rem] font-semibold">الأكثر طلباً</span>;
}

function Price({ plan }: { plan: Plan }) {
  return (
    <p className="mt-5 flex items-baseline gap-2">
      <span className="text-[3.25rem] font-bold leading-none tabular-nums">{plan.price.toLocaleString("en-US")}</span>
      <span className="text-[1rem] text-mist">ريال/شهر</span>
    </p>
  );
}

/** ميزانيتك الإعلانية: الفرق الوحيد بين الباقات */
function Budget({ plan }: { plan: Plan }) {
  return (
    <div className="mt-7">
      <div className="flex items-baseline justify-between gap-3 text-[0.9375rem]">
        <span className="text-mist">ميزانيتك الإعلانية</span>
        <span className="font-semibold">{plan.budget}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
        <div className="h-full rounded-full bg-(image:--gradient) transition-[width] duration-500 ease-lift" style={{ width: plan.fill }} />
      </div>
    </div>
  );
}
