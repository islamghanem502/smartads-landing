import { SIGNUP_URL } from "../lib/links";
import type { Post } from "./sample";

/*
 * قطع المدونة المشتركة بين صفحة المقالات وصفحة المقال.
 * المدونة فاتحة (نفس أقسام الصفحة الرئيسية الفاتحة) عشان القراءة الطويلة أريح، والنافبار والفوتر نفسهم.
 * في التجربة كل الكروت توديك لنفس المقال (/blog/post/). لما ننقلها للمنصة الروابط تصير روابط المقالات الحقيقية.
 */
export const POST_URL = "/blog/post/";

/** لون كل تصنيف: نقطة صغيرة جنب اسمه (من ألوان المنصات وأدواتنا) */
const COLORS: [RegExp, string][] = [
  [/سناب/, "#f5c400"],
  [/تيك توك/, "#fe2c55"],
  [/ميتا|إنستقرام/, "#0866ff"],
  [/جوجل|قوقل/, "#34a853"],
  [/سلة|زد/, "#00a28f"],
  [/سيو/, "#0ea5e9"],
  [/المحتوى/, "#ec4899"],
  [/نمو|تحليلات/, "#f59e0b"],
  [/الذكاء/, "#7c5cff"],
];
const colorOf = (name: string) => COLORS.find(([re]) => re.test(name))?.[1] ?? "#9aa0ad";

export function Category({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-cloud px-3 py-1 text-[0.8125rem] font-semibold text-ink-soft ${className}`}>
      <span aria-hidden className="size-2 rounded-full" style={{ background: colorOf(name) }} />
      {name}
    </span>
  );
}

/** التاريخ ومدة القراءة */
export function Meta({ date, minutes, className = "" }: { date: string; minutes: number; className?: string }) {
  return (
    <p className={`flex items-center gap-2 text-[0.8125rem] text-ink-soft ${className}`}>
      <span>{date}</span>
      <span aria-hidden className="size-1 rounded-full bg-current opacity-40" />
      <span>{minutes} دقايق قراءة</span>
    </p>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-black/5 transition-[translate,box-shadow] duration-300 ease-lift hover:-translate-y-1 hover:shadow-[0_28px_50px_-30px_rgb(17_19_24/0.35)]">
      <div className="aspect-[16/9] overflow-hidden bg-[#e9eaee]">
        <img src={post.cover} alt="" width={640} height={360} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 ease-lift group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Category name={post.category} className="self-start" />
        <h3 className="mt-4 text-[1.125rem] font-bold leading-[1.55] text-night">
          {/* الرابط يغطي الكرت كامل */}
          <a href={POST_URL} className="after:absolute after:inset-0 after:content-['']">{post.title}</a>
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-[1.75] text-ink-soft">{post.excerpt}</p>
        <Meta date={post.date} minutes={post.minutes} className="mt-auto pt-5" />
      </div>
    </article>
  );
}

/*
 * دعوة للتجربة: الغامقة الكبيرة (آخر المقال وآخر صفحة المقالات) فيها الشخصية تكتب،
 * والصغيرة (inline) تنحط في نص المقال قبل العنوان الثالث.
 */
export function Cta({ inline = false }: { inline?: boolean }) {
  if (inline)
    return (
      <aside className="my-10 flex flex-col gap-5 rounded-[24px] bg-night p-6 text-white sm:flex-row sm:items-center sm:p-7">
        <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-night-3 ring-1 ring-white/15">
          <img src="/mascot-head.png" alt="" width={56} height={56} loading="lazy" className="mt-2 size-12 object-contain" />
        </span>
        <div className="flex-1">
          <p className="text-[1.125rem] font-bold leading-[1.5]">تبي أحد يطبّق هالكلام عنك؟</p>
          <p className="mt-1 text-[0.9375rem] leading-[1.7] text-mist">فريقك التسويقي يخطط حملاتك ويطلقها ويحسّنها كل 15 دقيقة.</p>
        </div>
        <a href={SIGNUP_URL} className="inline-flex h-11 shrink-0 items-center justify-center rounded-[12px] bg-white px-5 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-[#e9eaee]">
          جرّب أسبوع مجاناً
        </a>
      </aside>
    );
  return (
    <aside className="relative overflow-hidden rounded-[32px] bg-night text-white">
      <span aria-hidden className="absolute -bottom-1/2 left-[8%] h-full w-[60%] rounded-full bg-[#7c5cff]/35 blur-3xl" />
      <div className="relative grid items-center gap-6 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10 lg:p-12">
        <div>
          <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.3]">
            قريت؟ <span className="bg-(image:--gradient) bg-clip-text pb-[0.1em] text-transparent">خلّنا نطبّقه لك</span>
          </p>
          <p className="mt-3 max-w-[30rem] text-[1.0625rem] leading-[1.8] text-mist">
            فريقك التسويقي يطلق حملاتك، ويصمّم محتواك، ويرفعك في قوقل. وأول أسبوع على حسابنا.
          </p>
          <a href={SIGNUP_URL} className="mt-7 inline-flex h-13 items-center rounded-[14px] bg-white px-7 font-bold text-night transition-[background-color,scale] hover:bg-[#e9eaee] active:scale-[0.97]">
            ابدأ أسبوعك المجاني
          </a>
        </div>
        <img src="/blog/writing.webp" alt="" width={540} height={570} loading="lazy" className="mx-auto -mb-16 w-[min(13rem,55vw)] sm:-mb-20 lg:-mb-24 lg:w-[15rem]" />
      </div>
    </aside>
  );
}
