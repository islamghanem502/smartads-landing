import { SIGNUP_URL } from "../../lib/links";
import { Ink } from "../Ink";
import { Container } from "../layout";
import { Compare } from "./Compare";

/*
 * «ليش مسوّقك الذكي»: ثلاث لحظات ورا بعض.
 *  1. الشخصية تمدّ لك فنجال قهوة طالع من الشاشة: إنت تقهوى، وإحنا نسوّق.
 *  2. المقارنة: فريق تسويق من المستقلين، ولا مسوّقك الذكي.
 *  3. العرض: أول أسبوع على حسابنا (تجربة، ومحتوى أسبوع، وتحليل حساباتك) قبل ما يدفع ريال.
 */
export function Why() {
  return (
    <section id="why" className="overflow-x-clip bg-cloud py-(--section-y) text-night [--ink-base:var(--color-night)]">
      <Container>
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.3]">
              <Ink>إنت تقهوى،</Ink> <span className="chip text-white">وإحنا نسوّق</span>
            </h2>
            <p className="mt-6 max-w-[34rem] text-[1.125rem] leading-[1.9] text-ink-soft">
              بنينا مسوّقك الذكي على خبرة تسويق كبيرة، وهدفنا مو بس ندير حملاتك. هدفنا نكون فريقك التسويقي الكامل: نطلق لك
              <strong className="font-semibold text-night"> حملات قوية تجيب مبيعات</strong>، ونبني لعلامتك
              <strong className="font-semibold text-night"> جمهور يعرفها ويرجع لها</strong>، ونتابع 24 ساعة… حتى وإنت نايم.
            </p>
            <p className="mt-5 text-[1.375rem] font-bold leading-[1.6]">
              وهمّنا الأول؟ <mark className="hl [--hl:#ddd2ff]">مبيعاتك</mark>، وجمهورك، وهويتك.
            </p>
          </div>
          <Coffee />
        </div>

        <Compare />
        <Offer />
      </Container>
    </section>
  );
}

/*
 * الشخصية طالعة من «شاشة» غامقة: نص جسمها اللي تحت داخلها، وراسها والفنجال طالعين فوقها على الصفحة.
 * الفنجال باليمين (القهوة تنقدّم باليمين)، فالصورة معكوسة: الفنجال يسار الصورة والدلّة يمينها.
 * المواضع من الصورة نفسها (1000×893): الجسم من 19٪ لين 77٪ بالعرض، وحافة الفنجال عند 22٪ بالعرض و36٪ بالطول.
 * لما تنزل للقسم الشخصية تكبر شوي كأنها تقرّب منك (popout في index.css)، والبخار يطلع من الفنجال.
 * في اللابتوب حافة الشاشة الغامقة على حافة المحتوى اليسار (مقابل الكلام اللي على اليمين)، فنزيحها 2٪ قد هامش الشاشة داخل الصورة.
 */
function Coffee() {
  return (
    <div className="relative mx-auto aspect-[1000/893] w-full max-w-[24rem] lg:me-0 lg:max-w-[27rem] lg:-translate-x-[2%]">
      <div aria-hidden className="absolute inset-x-[2%] bottom-0 top-[52%] overflow-hidden rounded-[32px] bg-night ring-1 ring-white/10">
        <span className="absolute inset-x-[15%] -bottom-1/2 h-full rounded-full bg-[#7c5cff]/50 blur-3xl" />
      </div>
      <div className="popout absolute inset-0">
        <img
          src="/why/coffee.webp"
          alt="مسوّقك الذكي يمدّ لك فنجال قهوة"
          width={1000}
          height={893}
          loading="lazy"
          decoding="async"
          className="relative size-full drop-shadow-[0_28px_36px_rgb(17_19_24/0.22)]"
        />
        <svg aria-hidden viewBox="0 0 40 60" className="steam absolute left-[22%] top-[15%] w-[11%] -translate-x-1/2" fill="none" stroke="#9298a6" strokeWidth="2.6" strokeLinecap="round">
          <path d="M11 58c-5-8 5-13 0-23s5-15 1-25" />
          <path d="M20 58c-5-8 5-13 0-23s5-15 1-25" />
          <path d="M29 58c-5-8 5-13 0-23s5-15 1-25" />
        </svg>
      </div>
    </div>
  );
}

/* العرض: فاتورة أول أسبوع، وكل بنودها علينا، والمجموع اللي تدفعه اليوم صفر */
const BILL = [
  { item: "7 أيام تجربة كاملة", value: "مجاناً" },
  { item: "صور وفيديوهات لمتجرك تكفيك أسبوع", value: "هدية" },
  { item: "تحليل حساباتك أول ما تسجّل، ونوريك وش اللي ضايع عليك", value: "هدية" },
];

function Offer() {
  return (
    // في الجوال الزر بعد الفاتورة (بعد ما يشوف «0 ريال»)، وفي اللابتوب تحت العنوان والفاتورة جنبهم
    <div className="mt-16 grid gap-8 rounded-[32px] bg-night p-7 text-white sm:p-10 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-x-16 lg:p-14">
      <div className="lg:self-end">
        <p className="text-[clamp(1.875rem,3.6vw,3rem)] font-bold leading-[1.25]">
          أول أسبوع… <span className="whitespace-nowrap bg-(image:--gradient) bg-clip-text text-transparent">على حسابنا</span>
        </p>
        <p className="mt-4 max-w-[30rem] text-balance text-[1.0625rem] leading-[1.8] text-mist">جرّب فريقك التسويقي كامل، وشوف شغلنا بعينك قبل ما تدفع ريال واحد.</p>
      </div>

      {/* الفاتورة: قصّتين على جنب الخط المنقّط مثل التذكرة */}
      <div className="rounded-[24px] bg-white/[0.05] p-(--pad) ring-1 ring-white/10 [--pad:1.5rem] sm:[--pad:1.75rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
        <ul className="grid gap-4">
          {BILL.map(({ item, value }) => (
            <li key={item} className="flex items-start justify-between gap-6 text-[1rem] leading-[1.6]">
              <span className="text-mist">{item}</span>
              <span className="shrink-0 rounded-full bg-white/[0.08] px-3 py-0.5 text-[0.875rem] font-semibold">{value}</span>
            </li>
          ))}
        </ul>
        <div className="relative mt-6 flex items-end justify-between border-t border-dashed border-white/20 pt-6">
          <span aria-hidden className="absolute -right-[calc(var(--pad)+0.75rem)] -top-3 size-6 rounded-full bg-night" />
          <span aria-hidden className="absolute -left-[calc(var(--pad)+0.75rem)] -top-3 size-6 rounded-full bg-night" />
          <span className="text-[1.0625rem] font-semibold">تدفع اليوم</span>
          <strong className="bg-(image:--gradient) bg-clip-text text-[clamp(2.25rem,4vw,3rem)] pb-[0.2em] leading-none text-transparent">0 ريال</strong>
        </div>
      </div>

      <a
        href={SIGNUP_URL}
        className="inline-flex h-14 items-center justify-center rounded-[16px] bg-white px-8 text-[1.0625rem] font-bold text-night transition-[background-color,scale] hover:bg-[#e9eaee] active:scale-[0.97] lg:col-start-1 lg:row-start-2 lg:justify-self-start lg:self-start"
      >
        ابدأ تجربتك المجانية
      </a>
    </div>
  );
}
