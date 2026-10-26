/*
 * الواجهات اللي فوق الشخصية في كل كرت: شكلها شكل المنتج الحقيقي (ألوان وأرقام)، بس صغيرة وبدون زحمة.
 * الأرقام أمثلة توضيحية. كلها على كرت غامق، فألوانها ألوان الوضع الليلي.
 */

/* أيقونات العناوين: مربع ملوّن ورمز بسيط */
export function Tile({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span className="grid size-12 place-items-center rounded-[14px] shadow-[inset_0_-3px_0_rgb(0_0_0/0.12)]" style={{ background: bg }}>
      <svg viewBox="0 0 24 24" aria-hidden className="size-6">{children}</svg>
    </span>
  );
}

export const Megaphone = () => (
  <path fill="#fff" d="M3 10.2v3.6c0 .7.5 1.2 1.2 1.2H6l1.6 4.3c.2.6.8.9 1.4.7l.6-.2c.6-.2.9-.9.7-1.5L9.1 15H10l7.3 3.9c.8.4 1.7-.2 1.7-1V6.1c0-.9-.9-1.4-1.7-1L10 9H4.2C3.5 9 3 9.5 3 10.2Zm17.5-.7a3 3 0 0 1 0 5" />
);
export const Heart = () => (
  <path fill="#ff4d7d" d="M12 20.3s-7.8-4.6-7.8-10.2A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.8 2.7c0 5.6-7.8 10.2-7.8 10.2Z" />
);
export const ArrowUp = () => (
  <path fill="none" stroke="#2563eb" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
);
export const Bars = () => (
  <g fill="#fff">
    <rect x="4" y="12" width="4" height="8" rx="1.5" />
    <rect x="10" y="8" width="4" height="12" rx="1.5" />
    <rect x="16" y="4" width="4" height="16" rx="1.5" />
  </g>
);

/** الإعلانات: جوال فيه مبيعات الإعلانات طالعة (الشخصية رافعة يدينها تحته) */
export function AdsScene() {
  const bars = [30, 38, 44, 66, 90];
  return (
    <div className="mx-auto w-[64%] rounded-[22px] border-[3px] border-[#2b2f3a] bg-[linear-gradient(180deg,#1f3d8f,#0d1f52)] px-3.5 pb-20 pt-3.5 text-white shadow-[0_18px_40px_-16px_rgb(0_0_0/0.7)]">
      <p className="text-[0.6875rem] text-white/70">مبيعات الإعلانات</p>
      <p className="mt-0.5 text-[1.25rem] font-bold leading-none">9.1 ألف <span className="text-[0.75rem] font-medium text-white/70">ر.س</span></p>
      <div className="mt-3 flex h-16 items-end gap-1.5">
        {bars.map((h, i) => (
          <span key={i} className={`flex-1 rounded-t-[5px] ${i === bars.length - 1 ? "bg-white" : "bg-white/25"}`} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

/** الحسابات: تقويم الأسبوع، وكل منشور في يومه */
export function SocialScene() {
  const days = [
    { d: "الأحد", posts: [{ c: "#93c5fd", t: "منشور", h: "h-12" }] },
    { d: "الإثنين", posts: [{ c: "#f9a8d4", t: "ريلز", h: "h-16" }] },
    { d: "الثلاثاء", posts: [{ c: "#fdba74", t: "ستوري", h: "h-9" }, { c: "#c4b5fd", t: "منشور", h: "h-9" }] },
    { d: "الأربعاء", posts: [{ c: "#86efac", t: "ريلز", h: "h-20" }] },
  ];
  return (
    <div className="mx-auto w-[82%] rounded-[16px] bg-[#1b1e25] p-3 text-white ring-1 ring-white/10 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.7)]">
      <p className="text-[0.75rem] font-semibold">تقويم المحتوى</p>
      <div className="mt-2 grid grid-cols-4 items-start gap-1.5">
        {days.map(({ d, posts }) => (
          <div key={d} className="grid gap-1.5">
            <span className="rounded-md bg-white/[0.07] py-0.5 text-center text-[0.5625rem] text-white/70">{d}</span>
            {posts.map((p, i) => (
              <span key={i} className={`rounded-[7px] p-1 ${p.h}`} style={{ background: p.c }}>
                <span className="block w-fit rounded-[4px] bg-black/20 px-1 text-[0.5rem] font-medium text-white">{p.t}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** السيو: ثلاث إشعارات فوق بعض، وآخرها إن متجرك صار الأول */
export function SeoScene() {
  const chip = "absolute inset-x-0 flex items-center gap-2.5 rounded-2xl bg-[#23262e] px-3 py-2 text-white ring-1 ring-white/10 shadow-[0_10px_28px_-10px_rgb(0_0_0/0.8)]";
  return (
    <div className="relative mx-auto h-[7.75rem] w-[86%]">
      <div className={`${chip} top-0 mx-5 opacity-55`}>
        <span className="size-5 shrink-0 rounded-full bg-[#fdba74]" />
        <span className="truncate text-[0.75rem]">«عبايات سوداء»</span>
      </div>
      <div className={`${chip} top-[1.7rem] mx-2.5 opacity-80`}>
        <span className="size-5 shrink-0 rounded-full bg-[#c4b5fd]" />
        <span className="truncate text-[0.75rem]">مقال قيد الكتابة…</span>
      </div>
      <div className={`${chip} top-[3.6rem] py-2.5`}>
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#ffa94d] text-[0.8125rem] font-bold text-[#3b2200]">1</span>
        <span className="min-w-0">
          <span className="block text-[0.8125rem] font-semibold">الأول في البحث</span>
          <span className="block text-[0.6875rem] text-white/60">+1,240 زيارة شهرياً</span>
        </span>
      </div>
    </div>
  );
}

/** التقارير: رسالة واتساب فيها تقرير الأسبوع، وردّك على المستشار */
export function ReportsScene() {
  return (
    <div className="mx-auto grid w-[84%] gap-1.5 text-white">
      <div className="me-5 rounded-2xl rounded-ss-md bg-[#202c33] px-3 py-2 shadow-[0_10px_28px_-10px_rgb(0_0_0/0.8)]">
        <p className="text-[0.6875rem] font-semibold text-[#53bdeb]">مسوّقك الذكي</p>
        <p className="mt-0.5 text-[0.8125rem] font-semibold">تقرير الأسبوع</p>
        <p className="flex items-end justify-between gap-2 text-[0.75rem] text-white/80">
          الطلبات 42 · المبيعات +18٪
          <span className="shrink-0 text-[0.5625rem] text-white/45">9:00 ص</span>
        </p>
      </div>
      <div className="ms-8 rounded-2xl rounded-se-md bg-[#005c4b] px-3 py-1.5 shadow-[0_10px_28px_-10px_rgb(0_0_0/0.8)]">
        <p className="flex items-end justify-between gap-2 text-[0.75rem]">
          تمام، زيدوا ميزانية سناب
          <span className="shrink-0 text-[0.5625rem] text-white/55">9:04 ص</span>
        </p>
      </div>
    </div>
  );
}
