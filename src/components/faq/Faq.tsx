import type { ReactNode } from "react";
import { APP_URL } from "../../lib/links";
import { Ink } from "../Ink";
import { Container } from "../layout";

/*
 * الأسئلة: اللي يوقّف التاجر قبل ما يسجّل. العنوان يمين (ثابت وإنت تنزل في اللابتوب) والأسئلة يسار.
 * كل سؤال <details> عادي، فيفتح ويقفل بدون جافاسكربت، والمتصفحات اللي تدعم تحرّكه بنعومة (faq في index.css).
 * الأجوبة مطابقة للمنصة: اعتماد الخطة قبل أي صرف، الإلغاء بضغطة، الربط بصلاحيات المنصات الرسمية.
 * text: الجواب، وهو نفسه في بيانات قوقل (FAQPage). a: نفس الجواب بروابط، لو فيه.
 */
const FAQ: { q: string; text: string; a?: ReactNode }[] = [
  {
    q: "وش أحتاج عشان أبدأ؟",
    text: "بس رابط متجرك. بعدها تربط حساباتك الإعلانية وحسابات النشر بضغطات، ونرسل لك خطة تناسب متجرك، توافق عليها ونبدأ.",
  },
  {
    q: "هل أحتاج خبرة في التسويق؟",
    text: "أبد. إحنا نخطط وننفّذ ونتابع، وكل قرار نشرحه لك بالعربي وبكلام واضح. وإذا عندك سؤال، مستشارك معك على واتساب 24 ساعة.",
  },
  {
    q: "مين يتحكم في ميزانيتي الإعلانية؟",
    text: "إنت. ميزانيتك منفصلة عن سعر الباقة، وما نصرف منها ريال قبل ما توافق على الخطة. وبعدها نوجّهها للإعلانات اللي تجيب مبيعات.",
  },
  {
    q: "أقدر ألغي متى ما أبي؟",
    text: "إيه، تلغي بضغطة وبدون أي التزام. وأول أسبوع أصلاً على حسابنا.",
  },
  {
    q: "متى أشوف نتيجة؟",
    text: "الإعلانات تنطلق أول ما توافق على الخطة، ونتابعها من أول يوم ونحسّنها كل 15 دقيقة. أما السيو والمتابعين فيكبرون مع الوقت، خلال أسابيع.",
  },
  {
    q: "على أي منصات تشتغلون؟",
    text: "الإعلانات على سناب وتيك توك وميتا (فيسبوك وانستقرام) وقوقل. والنشر على انستقرام وتيك توك وسناب وفيسبوك. ومتجرك ممكن يكون على سلة أو زد أو موقعك الخاص.",
  },
  {
    q: "هل حساباتي وبياناتي بأمان؟",
    text: "نربط حساباتك بالصلاحيات الرسمية من كل منصة، فما نحتاج كلمات مرورك أبد، وتقدر تفصل الربط متى ما تبي.",
    a: (
      <>
        نربط حساباتك بالصلاحيات الرسمية من كل منصة، فما نحتاج كلمات مرورك أبد، وتقدر تفصل الربط متى ما تبي. والتفاصيل في{" "}
        <a href={`${APP_URL}/privacy`} className="font-semibold text-night underline decoration-night/30 underline-offset-4 hover:decoration-night">سياسة الخصوصية</a>.
      </>
    ),
  },
  {
    q: "وش الفرق بينكم وبين وكالة تسويق؟",
    text: "الوكالة فريق يشتغل بالدوام وبسعر عالي. إحنا فريقك التسويقي الكامل، نشتغل 24 ساعة، نتابع حملاتك كل 15 دقيقة ونشرح لك كل قرار، وبأقل من راتب موظف واحد.",
  },
];

const schema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, text }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text } })),
});

export function Faq() {
  return (
    <section id="faq" className="bg-cloud py-(--section-y) text-night [--ink-base:var(--color-night)]">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)] lg:self-start">
          <h2 className="text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.3]">
            <Ink>عندك</Ink> <span className="chip text-white">سؤال</span>؟
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-[1.8] text-ink-soft">
            جمعنا لك أكثر الأسئلة اللي توصلنا. وإذا ما لقيت جوابك، راسلنا وبنرد عليك.
          </p>
          <a
            href="mailto:support@ilanakdhaki.com"
            className="mt-6 inline-flex h-12 items-center rounded-[14px] bg-night px-6 font-semibold text-white transition-[background-color,scale] hover:bg-night-3 active:scale-[0.97]"
          >
            راسلنا
          </a>
        </div>

        <div className="grid gap-3">
          {FAQ.map(({ q, text, a }, i) => (
            <details key={q} open={i === 0} className="faq group rounded-[22px] bg-white ring-1 ring-black/5 transition-shadow open:shadow-[0_18px_40px_-24px_rgb(17_19_24/0.3)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-5 text-[1.0625rem] font-semibold sm:p-6 sm:text-[1.125rem] [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-cloud transition-[rotate,background-color] duration-300 ease-lift group-open:rotate-45 group-open:bg-night group-open:text-white">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </summary>
              <p className="-mt-1 px-5 pb-6 text-[1rem] leading-[1.9] text-ink-soft sm:px-6">{a ?? text}</p>
            </details>
          ))}
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
    </section>
  );
}
