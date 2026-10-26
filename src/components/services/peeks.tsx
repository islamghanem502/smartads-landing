/* لمحات صغيرة من المنتج نفسه في كل كرت: تبيّن وش يستلم التاجر بدل ما نشرحه بالكلام */

const Pause = () => (
  <svg viewBox="0 0 12 12" aria-hidden className="size-3"><path d="M4 3v6M8 3v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
);
const Up = () => (
  <svg viewBox="0 0 12 12" aria-hidden className="size-3"><path d="M6 9.5v-7M3 5.2 6 2.5l3 2.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/** مدير الحملات: آخر شغله على حملاتك، والأداء طالع. */
export function CampaignsPeek() {
  return (
    <div data-peek className="rounded-2xl bg-paper p-4 text-[0.875rem]">
      <div className="flex items-center justify-between font-semibold">
        <span>تحسين تلقائي</span>
        <span className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-[#15803d]">
          <span className="size-1.5 animate-pulse rounded-full bg-current" />
          شغّال
        </span>
      </div>
      <ul className="mt-3 grid gap-2 font-medium">
        <li className="flex items-center gap-2.5">
          <span className="grid size-6 place-items-center rounded-lg bg-[#fee2e2] text-[#dc2626]"><Pause /></span>
          أوقفنا إعلان يخسر
        </li>
        <li className="flex items-center gap-2.5">
          <span className="grid size-6 place-items-center rounded-lg bg-[#dcfce7] text-[#15803d]"><Up /></span>
          زدنا ميزانية الرابح
        </li>
      </ul>
      <svg viewBox="0 0 160 40" preserveAspectRatio="none" aria-hidden className="mt-3 h-10 w-full">
        <path d="M0 35C18 33 26 27 40 28S64 20 80 22 108 11 122 12 148 5 160 3V40H0Z" fill="#7c5cff" fillOpacity=".12" />
        <path d="M0 35C18 33 26 27 40 28S64 20 80 22 108 11 122 12 148 5 160 3" fill="none" stroke="#7c5cff" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <p className="mt-2 text-[0.75rem] text-ink-soft">آخر تحسين قبل 12 دقيقة</p>
    </div>
  );
}
