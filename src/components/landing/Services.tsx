"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SIGNUP_URL } from "@/lib/links";
import { Facebook, Google, Instagram, Meta, Salla, Snapchat, TikTok, WhatsApp, Website, ZidMark } from "@/components/brand/logos";

type Svg = React.SVGProps<SVGSVGElement>;
type Logo = (p: Svg) => React.ReactElement;

const EASE = [0.32, 0.72, 0, 1] as const;
const inView = { once: true, margin: "-80px" } as const;

/* ---------- الرسومات الصغيرة داخل كل كرت: تشرح الخدمة بنظرة ---------- */

/** توزيع الميزانية: الأشرطة تمتد لما الكرت يبان. */
function BudgetBars() {
  const rows: { L: Logo; n: string; v: number }[] = [
    { L: Meta, n: "ميتا", v: 38 },
    { L: Snapchat, n: "سناب شات", v: 31 },
    { L: Google, n: "قوقل", v: 19 },
    { L: TikTok, n: "تيك توك", v: 12 },
  ];
  return (
    <div className="grid gap-2.5">
      {rows.map(({ L, n, v }, i) => (
        <div key={n} className="grid grid-cols-[2.25rem_1fr_2.75rem] items-center gap-3">
          <span className="grid size-9 place-items-center rounded-[11px] bg-white ring-1 ring-black/5"><L className="size-5" /></span>
          <span className="h-3 overflow-hidden rounded-full bg-[#e7e9ee]">
            <motion.span
              className="block h-full rounded-full bg-[var(--card-ink)]"
              initial={{ width: "0%" }}
              whileInView={{ width: `${(v / 38) * 100}%` }}
              viewport={inView}
              transition={{ duration: 1, delay: 0.15 + i * 0.1, ease: EASE }}
            />
          </span>
          <span className="text-left text-[0.875rem] font-semibold tabular-nums">{v}٪</span>
        </div>
      ))}
      <p className="mt-1 text-[0.8125rem] text-[var(--card-soft)]">مثال: الميزانية بعد أسبوعين، رايحة للي يبيع أكثر</p>
    </div>
  );
}

/** نتيجة بحث في قوقل لمنتج من متجرك، ومقال جديد نزل في المدونة. */
function SearchResult() {
  return (
    <div className="grid gap-2.5">
      <div className="rounded-[16px] bg-white p-4 ring-1 ring-black/5">
        <div className="flex items-center gap-2 text-[0.8125rem] text-[var(--card-soft)]">
          <Google className="size-4" />
          <span dir="ltr">yourstore.com › perfumes</span>
        </div>
        <p className="mt-1.5 text-[1rem] font-semibold text-[#1a0dab]">عطر عود فاخر ١٠٠ مل | متجرك</p>
        <p className="mt-1 text-[0.8125rem] leading-[1.6] text-[var(--card-soft)]">عطر عود بثبات يدوم طول اليوم، شحن سريع لكل مدن المملكة…</p>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[0.8125rem] font-medium ring-1 ring-black/5">
        <span className="size-2 rounded-full bg-[#22c55e]" />
        نزل مقال جديد في مدونتك: «كيف تختار عطرك للشتاء؟»
      </div>
    </div>
  );
}

/** الاستوديو: من تحليل المنتج لين الفيديو الجاهز. */
function Studio() {
  const steps = ["تحليل المنتج", "السيناريو", "التصميم", "جاهز"];
  return (
    <div className="flex items-center gap-4">
      <div className="relative grid aspect-[9/16] w-24 shrink-0 place-items-center overflow-hidden rounded-[16px] bg-[linear-gradient(160deg,#7c5cff,#d946ef_50%,#ff6b6b_80%,#ffa94d)]">
        <span className="grid size-10 place-items-center rounded-full bg-white/90">
          <svg viewBox="0 0 24 24" className="ms-0.5 size-4 text-[var(--card-ink)]" aria-hidden><path d="M8 5.5v13l10.5-6.5Z" fill="currentColor" /></svg>
        </span>
        <span className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-white/35">
          <motion.span className="block h-full bg-white" initial={{ width: "0%" }} whileInView={{ width: "70%" }} viewport={inView} transition={{ duration: 2.4, ease: "linear" }} />
        </span>
      </div>
      <ol className="grid gap-2 text-[0.875rem]">
        {steps.map((s, i) => (
          <motion.li
            key={s}
            className="flex items-center gap-2"
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            viewport={inView}
            transition={{ delay: 0.3 + i * 0.35, duration: 0.3 }}
          >
            <span className={`grid size-5 place-items-center rounded-full text-[0.625rem] font-bold ${i === steps.length - 1 ? "bg-[#22c55e] text-white" : "bg-[var(--card-ink)] text-white"}`}>
              {i === steps.length - 1 ? "✓" : i + 1}
            </span>
            {s}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/** أسبوع نشر: الأيام اللي فيها منشور عليها شعار الحساب. */
function Week() {
  const days = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
  const posts: (Logo | null)[] = [Instagram, null, TikTok, Instagram, Facebook, null, TikTok];
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d, i) => {
        const L = posts[i];
        return (
          <div key={d} className="flex flex-col items-center gap-1.5">
            <span className="text-[0.6875rem] text-[var(--card-soft)]">{d}</span>
            <motion.span
              className={`grid aspect-square w-full place-items-center rounded-[10px] ${L ? "bg-white ring-1 ring-black/5" : "bg-[#e7e9ee]"}`}
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={inView}
              transition={{ delay: 0.1 + i * 0.07, type: "spring", stiffness: 300, damping: 20 }}
            >
              {L ? <L className="size-[55%]" /> : null}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}

/** طلب من المتجر يوصل للمنصات الأربع. */
function Tracking() {
  const to: Logo[] = [Snapchat, TikTok, Meta, Google];
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 rounded-[14px] bg-white px-3 py-2.5 text-[0.8125rem] ring-1 ring-black/5">
        <p className="font-semibold">طلب جديد</p>
        <p className="text-[var(--card-soft)]">٣٤٠ ريال</p>
      </div>
      <svg viewBox="0 0 40 12" className="w-10 shrink-0 text-[var(--card-soft)]" aria-hidden><path d="M38 6H4m5-4L4 6l5 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div className="grid grid-cols-4 gap-1.5">
        {to.map((L, i) => (
          <motion.span
            key={i}
            className="grid size-9 place-items-center rounded-[11px] bg-white ring-1 ring-black/5"
            initial={{ opacity: 0.25 }}
            whileInView={{ opacity: 1 }}
            viewport={inView}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.3 }}
          >
            <L className="size-5" />
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/** رسالة الصباح على الواتساب من الشخصية. */
function Chat() {
  return (
    <div className="grid gap-2">
      <div className="flex items-end gap-2">
        <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--night)]">
          <Image src="/landing/mascot-head.png" alt="" width={36} height={36} className="mt-1 size-8 object-contain" />
        </span>
        <div className="rounded-[16px] rounded-br-[4px] bg-white px-3.5 py-2.5 text-[0.875rem] leading-[1.7] ring-1 ring-black/5">
          صباح الخير! أمس جاك <b>١٤ طلب</b>، وأوقفنا إعلان ما كان يبيع ونقلنا ميزانيته لسناب.
        </div>
      </div>
      <div className="me-11 flex justify-end">
        <span className="rounded-[16px] rounded-bl-[4px] bg-[#d9fdd3] px-3.5 py-2 text-[0.875rem]">تمام، كمّلوا 👌</span>
      </div>
    </div>
  );
}

/* ---------- الكروت ---------- */

type Card = {
  title: string;
  points: string[];
  logos?: { L: Logo; n: string }[];
  Visual: () => React.ReactElement;
  wide?: boolean;
};

const CARDS: Card[] = [
  {
    title: "حملات إعلانية تبيع",
    points: ["نختار المنصة والجمهور والميزانية", "نطلق على سناب وتيك توك وميتا وقوقل", "نراجع كل ١٥ دقيقة، والميزانية تروح للي يبيع"],
    Visual: BudgetBars,
    wide: true,
  },
  {
    title: "سيو ومدونة",
    points: ["عناوين ووصف منتجاتك بكلمات يدوّر عليها عميلك", "مقالات تنزل في مدونتك تلقائياً كل أسبوع", "بيانات منظّمة تفهمها محركات البحث والذكاء الاصطناعي"],
    logos: [{ L: Google, n: "قوقل" }],
    Visual: SearchResult,
  },
  {
    title: "صور وفيديوهات إعلانية",
    points: ["نحلل منتجك ونكتب السيناريو", "نصمّم بهوية متجرك وبمقاس كل منصة", "تشوفها وتوافق قبل ما تنزل"],
    Visual: Studio,
  },
  {
    title: "النشر في حساباتك",
    points: ["جدول نشر للشهر كله", "ننشر بالوقت اللي يتفاعل فيه جمهورك", "نتابع الوصول والتفاعل لكل منشور"],
    logos: [{ L: Instagram, n: "انستقرام" }, { L: TikTok, n: "تيك توك" }, { L: Facebook, n: "فيسبوك" }],
    Visual: Week,
  },
  {
    title: "تتبّع كل طلب",
    points: ["ربط مباشر بين متجرك والمنصات الإعلانية", "كل طلب يوصل لها لحظة ما يصير", "فتتعلم إعلاناتك مين يشتري فعلاً"],
    logos: [{ L: Salla, n: "سلة" }, { L: ZidMark, n: "زد" }, { L: Website, n: "موقعك الخاص" }],
    Visual: Tracking,
  },
  {
    title: "خطة وتقارير ومستشار",
    points: ["خطة تسويق كل شهر، تعتمدها بضغطة", "تقارير وتنبيهات على الواتساب", "تسأل مسوّقك الذكي أي وقت، ويرد بأرقامك"],
    logos: [{ L: WhatsApp, n: "واتساب" }],
    Visual: Chat,
    wide: true,
  },
];

function ServiceCard({ c, i }: { c: Card; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
      className={`flex flex-col rounded-[28px] bg-white p-6 ring-1 ring-black/[0.06] sm:p-7 ${c.wide ? "lg:col-span-2" : ""}`}
    >
      <div className={`flex flex-1 flex-col gap-6 ${c.wide ? "lg:grid lg:grid-cols-2 lg:items-center lg:gap-8" : ""}`}>
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[1.25rem] font-bold leading-snug sm:text-[1.375rem]">{c.title}</h3>
            {c.logos && (
              <ul className="flex shrink-0 gap-1" aria-label="المنصات">
                {c.logos.map(({ L, n }) => (
                  <li key={n} title={n} className="grid size-8 place-items-center rounded-[10px] bg-[#f2f3f6]">
                    <L className="size-[1.1rem]" />
                    <span className="sr-only">{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ul className="mt-4 grid gap-2.5">
            {c.points.map((p) => (
              <li key={p} className="flex gap-2.5 text-[0.9375rem] leading-[1.6] text-[var(--card-ink)]">
                <svg viewBox="0 0 24 24" className="mt-[0.2rem] size-4 shrink-0 text-[#22c55e]" aria-hidden>
                  <path d="M4.5 12.5 9.5 17.5 19.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className={`mt-auto rounded-[20px] bg-[#f4f5f7] p-4 sm:p-5 ${c.wide ? "lg:mt-0" : ""}`}>
          <c.Visual />
        </div>
      </div>
    </motion.article>
  );
}

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-[#f4f5f7] text-[var(--card-ink)]">
      <div className="mx-auto max-w-[78rem] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-[44rem]">
          <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.3]">
            كل اللي يحتاجه تسويق متجرك، <span className="mh-chip">بمكان واحد</span>.
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-[1.9] text-[#3d424e] sm:text-[1.125rem]">
            ست خدمات نشتغل عليها كل يوم، ومربوطة ببعض: اللي نتعلمه من إعلاناتك يحسّن محتواك، واللي يبيع ياخذ ميزانية أكثر.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-3">
          {CARDS.map((c, i) => <ServiceCard key={c.title} c={c} i={i} />)}
          <motion.a
            href={SIGNUP_URL}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
            className="group flex flex-col justify-between rounded-[28px] bg-[var(--night)] p-7 text-white"
          >
            <p className="text-[1.375rem] font-bold leading-[1.45]">وكل هذا يبدأ من ٧٩٩ ريال بالشهر.</p>
            <span className="mt-8 inline-flex h-12 w-fit items-center rounded-[14px] bg-white px-6 text-[1rem] font-semibold text-[var(--night)] transition-colors group-hover:bg-[#e9eaee]">
              اربط متجرك
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
