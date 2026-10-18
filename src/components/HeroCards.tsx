import { SiWhatsapp } from "react-icons/si";
import { PLATFORMS, PlatformMark, type Platform } from "./PlatformMark";

// أجزاء حقيقية من المنصة بدل رسمة: حدث وصل، حملة تنتظر موافقة، قرار اتخذناه.
// التوقيتات هي لحظة الدخول الوحيدة في الصفحة.
const T = { event: 150, approval: 450, decision: 750, reach: 1100, sketch: 1700 };

const REACH: Platform[] = ["meta", "google", "tiktok", "snap"];

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="reach-check size-4 text-green" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EventCard() {
  return (
    <div className="ui-card rise w-full max-w-[350px] p-5" style={{ animationDelay: `${T.event}ms` }}>
      <div className="flex items-center justify-between text-[0.85rem] text-ink-soft">
        <span className="flex items-center gap-2">
          <span className="live-dot relative size-2 rounded-full bg-green" aria-hidden />
          وصل حدث من موقعك
        </span>
        <span>الحين</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-[12px] bg-[#E7F8EE] text-[#1FA855]" aria-hidden>
          <SiWhatsapp size={21} />
        </span>
        <p className="font-display text-[1.1rem] font-semibold">عميل تواصل معك عبر واتساب</p>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2" aria-label="وصل لمنصاتك">
        {REACH.map((p, i) => (
          <li
            key={p}
            className="reach flex items-center gap-2 rounded-[12px] border-2 border-line bg-mist px-2.5 py-1.5 text-[0.9rem]"
            style={{ animationDelay: `${T.reach + i * 160}ms` }}
          >
            <PlatformMark platform={p} size={24} />
            <span className="flex-1">{PLATFORMS[p].name}</span>
            <Check />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApprovalCard() {
  return (
    <div className="relative w-full max-w-[370px]">
      <div className="ui-card rise p-5" style={{ animationDelay: `${T.approval}ms` }}>
        <span className="inline-block rounded-full bg-saffron-soft px-3 py-0.5 text-[0.8rem] font-medium text-[#8a5a00]">
          تنتظر موافقتك
        </span>
        <p className="mt-2.5 font-display text-[1.2rem] font-semibold">حملة عروض نهاية الأسبوع</p>
        <dl className="mt-3 space-y-2 text-[0.93rem]">
          <div className="flex items-center justify-between">
            <dt className="text-ink-soft">وين</dt>
            <dd className="flex gap-1.5">
              <PlatformMark platform="snap" size={26} />
              <PlatformMark platform="tiktok" size={26} />
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-ink-soft">الميزانية</dt>
            <dd className="font-medium">150 ر.س باليوم</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-ink-soft">لمين</dt>
            <dd className="font-medium">الرياض وجدة</dd>
          </div>
        </dl>
        <div className="mt-4 flex gap-2.5">
          <span className="btn btn-primary btn-sm flex-1">اعتمد</span>
          <span className="btn btn-quiet btn-sm">عدّل</span>
        </div>
      </div>
      <HandNote />
    </div>
  );
}

/** اللمسة اليدوية: سهم وكلمة بخط الرقعة يشاوروا على «اعتمد». */
function HandNote() {
  return (
    <div className="pointer-events-none absolute hidden w-[150px] lg:block" style={{ right: -152, bottom: 24 }} aria-hidden>
      <span
        className="sketch-note block pe-2 text-center font-hand text-[1.55rem] leading-none text-ink"
        style={{ animationDelay: `${T.sketch + 500}ms` }}
      >
        القرار لك
      </span>
      <svg viewBox="0 0 150 70" className="mt-1 w-[150px] text-ink" fill="none">
        <path
          className="sketch-path"
          pathLength={1}
          d="M112 6 C 104 34, 74 52, 22 50"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ animationDelay: `${T.sketch}ms` }}
        />
        <path
          className="sketch-path"
          pathLength={1}
          d="M34 39 L 20 50 L 35 60"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animationDelay: `${T.sketch + 550}ms` }}
        />
      </svg>
    </div>
  );
}

function DecisionCard() {
  return (
    <div className="ui-card rise w-full max-w-[340px] p-5" style={{ animationDelay: `${T.decision}ms` }}>
      <p className="text-[0.85rem] text-ink-soft">قرار اليوم</p>
      <p className="mt-1.5 text-[1rem] leading-relaxed">
        وقفنا إعلان ما جاب تواصل من 3 أيام، ونقلنا ميزانيته للإعلان اللي شغال.
      </p>
      <div className="mt-3.5 flex items-center justify-between text-[0.85rem]">
        <span className="flex items-center gap-2 text-ink-soft">
          <PlatformMark platform="snap" size={22} />
          قبل ساعتين
        </span>
        <span className="font-medium text-ink underline decoration-line-strong decoration-2 underline-offset-4">ليش؟</span>
      </div>
    </div>
  );
}

export function HeroCards() {
  return (
    <div className="flex flex-col items-center gap-5 lg:items-stretch lg:gap-0" role="img" aria-label="مثال من المنصة: حدث وصل لكل المنصات، حملة تنتظر موافقتك، وقرار اتخذناه في حملة">
      <div className="lg:self-start lg:me-6">
        <EventCard />
      </div>
      <div className="lg:-mt-6 lg:self-end">
        <ApprovalCard />
      </div>
      <div className="lg:mt-3 lg:self-start lg:ms-14">
        <DecisionCard />
      </div>
    </div>
  );
}
