import { SIGNUP_URL } from "../../lib/links";
import { Ink } from "../Ink";
import { Container } from "../layout";
import { Compare } from "./Compare";

/*
 * «ليش مسوّقك الذكي»: ثلاث لحظات ورا بعض.
 *  1. الشخصية تمدّ لك فنجال قهوة طالع من الشاشة: إنت تقهوى، وإحنا نسوّق.
 *  2. المقارنة: فريق تسويق بالرواتب، ولا مسوّقك الذكي.
 *  3. العرض: 7 أيام مجاناً، وهدية محتوى أسبوع كامل، وتحليل حساباتك أول ما تسجّل.
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
              هدفنا مو بس ندير حملاتك. هدفنا نكون <strong className="font-semibold text-night">فريقك التسويقي الكامل</strong>: بخبرة تسويق حقيقية،
              نخطط، ونصمم، وننشر، ونتابع 24 ساعة… حتى وإنت نايم.
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
 * المواضع من الصورة نفسها (1000×893): الجسم من 23٪ لين 81٪ بالعرض، وحافة الفنجال عند 78٪ بالعرض و36٪ بالطول.
 * لما تنزل للقسم الشخصية تكبر شوي كأنها تقرّب منك (popout في index.css)، والبخار يطلع من الفنجال.
 */
function Coffee() {
  return (
    <div className="relative mx-auto aspect-[1000/893] w-full max-w-[34rem]">
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
        <svg aria-hidden viewBox="0 0 40 60" className="steam absolute left-[78%] top-[15%] w-[11%] -translate-x-1/2" fill="none" stroke="#9298a6" strokeWidth="2.6" strokeLinecap="round">
          <path d="M11 58c-5-8 5-13 0-23s5-15 1-25" />
          <path d="M20 58c-5-8 5-13 0-23s5-15 1-25" />
          <path d="M29 58c-5-8 5-13 0-23s5-15 1-25" />
        </svg>
      </div>
    </div>
  );
}

/* العرض: الختام بعد المقارنة، وفيه الزر */
const PERKS = [
  {
    text: "صور وفيديوهات لمتجرك تكفيك أسبوع كامل.",
    icon: <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1s3 1 5 1c2 0 5 1.5 5-1s-3.5-2-5 1" />,
  },
  {
    text: "وأول ما تسجّل، نحلّل حساباتك ونوريك وش اللي ضايع عليك.",
    icon: <path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20M7.5 12l2-2.5 2 1.5 2-3" />,
  },
];

function Offer() {
  return (
    <div className="mt-16 overflow-hidden rounded-[32px] bg-night p-7 text-white sm:p-10 lg:mt-24 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:p-14">
      <div>
        <p className="text-[clamp(1.625rem,3vw,2.5rem)] font-bold leading-[1.3]">
          جرّبنا 7 أيام مجاناً… <span className="whitespace-nowrap bg-(image:--gradient) bg-clip-text text-transparent">ومعها هدية</span>
        </p>
        <ul className="mt-6 grid gap-4">
          {PERKS.map(({ text, icon }) => (
            <li key={text} className="flex items-start gap-3.5 text-[1.0625rem] leading-[1.7] text-mist">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.08] text-white">
                <svg viewBox="0 0 24 24" aria-hidden className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
              </span>
              <span className="pt-1">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <a
        href={SIGNUP_URL}
        className="mt-8 inline-flex h-14 shrink-0 items-center rounded-[16px] bg-white px-8 text-[1.0625rem] font-bold text-night transition-[background-color,scale] hover:bg-[#e9eaee] active:scale-[0.97] lg:mt-0"
      >
        ابدأ تجربتك المجانية
      </a>
    </div>
  );
}
