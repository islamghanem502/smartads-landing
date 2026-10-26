import { APP_URL, LOGIN_URL, SIGNUP_URL } from "../../lib/links";
import { Ink } from "../Ink";
import { Container } from "../layout";
import { LINKS } from "../Nav";

/*
 * الفوتر: الختام فوق (لا تضيّع وقت + سجّل/دخول)، وبعده الشخصية طالعة من بوابة بيضاوية على خط الأفق
 * وتورّيك ساعتها (العقارب تدور)، وتحت الخط الروابط وبيانات المؤسسة.
 */
const GROUPS = [
  { title: "الصفحة", links: LINKS },
  {
    title: "قانوني",
    links: [
      { href: `${APP_URL}/terms`, label: "الشروط والأحكام" },
      { href: `${APP_URL}/privacy`, label: "سياسة الخصوصية" },
    ],
  },
  // آخر وحدة: في الجوال تاخذ سطر كامل عشان الإيميل ما يطلع برّا الشاشة
  {
    title: "تواصل",
    links: [
      { href: "mailto:support@ilanakdhaki.com", label: "support@ilanakdhaki.com" },
      { href: `${APP_URL}/blog`, label: "المدونة" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="overflow-x-clip pt-(--section-y)">
      <Container>
        <div className="text-center">
          <h2 className="text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.3]">
            <Ink>لا تضيّع وقت،</Ink> <span className="chip">ابدأ اليوم</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[30rem] text-balance text-[1.125rem] leading-[1.8] text-mist">
            كل يوم يفوت، فيه طلبات تروح لمنافسينك. وأول أسبوع على حسابنا.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={SIGNUP_URL}
              className="inline-flex h-13 items-center rounded-[14px] bg-white px-8 text-[1.0625rem] font-bold text-night transition-[background-color,scale] hover:bg-[#e9eaee] active:scale-[0.97]"
            >
              سجّل الحين
            </a>
            <a
              href={LOGIN_URL}
              className="inline-flex h-13 items-center rounded-[14px] px-6 text-[1.0625rem] font-semibold text-white ring-1 ring-white/20 transition-[background-color,scale] hover:bg-white/[0.06] active:scale-[0.97]"
            >
              تسجيل الدخول
            </a>
          </div>
        </div>

        <Portal />

        {/* الروابط وبيانات المؤسسة */}
        <div className="mt-20 grid gap-12 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
          <div className="max-w-[24rem]">
            <a href="/" className="inline-flex items-center gap-2.5 text-[1.125rem] font-bold">
              <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-night-3 ring-1 ring-line">
                <img src="/mascot-head.png" alt="" width={36} height={36} loading="lazy" className="mt-1 size-9 object-contain" />
              </span>
              مسوّقك الذكي
            </a>
            <p className="mt-4 text-[1rem] leading-[1.8] text-mist">فريقك التسويقي الكامل بالذكاء الاصطناعي، لمتاجر سلة وزد والمواقع الخاصة.</p>
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-night-2 p-4 ring-1 ring-line">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white">
                <svg viewBox="0 0 24 24" aria-hidden className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 14.5l2 2 4-4.5" />
                </svg>
              </span>
              <p className="text-[0.9375rem] leading-[1.7]">
                <span className="font-semibold">مسجّلين رسمياً في وزارة التجارة</span>
                <span className="block text-fog">مؤسسة كودرز · الرقم الوطني الموحد <span className="tabular-nums">7054511014</span></span>
              </p>
            </div>
          </div>

          <nav aria-label="روابط الفوتر" className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3">
            {GROUPS.map((g, i) => (
              <div key={g.title} className={i === GROUPS.length - 1 ? "col-span-2 sm:col-span-1" : ""}>
                <h3 className="text-[0.9375rem] font-semibold">{g.title}</h3>
                <ul className="mt-4 grid gap-3 text-[0.9375rem] text-fog">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="transition-colors hover:text-white">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line py-7 text-[0.875rem] text-fog sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} مسوّقك الذكي. كل الحقوق محفوظة.</p>
          <p>نشتغل لك 24 ساعة… حتى وإنت نايم.</p>
        </div>
      </Container>
    </footer>
  );
}

/*
 * البوابة: خط أفق بعرض المحتوى، وفي نصه فتحة بيضاوية غامقة بحافة بالتدرّج، والشخصية طالعة منها.
 * الطبقات: نص الفتحة اللي ورا (والحافة اللي فوق) ← الشخصية (مقصوصة عند نص الفتحة وتذوب في الظلام) ← الحافة اللي قدّام.
 * لما ينزل الزائر للفوتر الشخصية تطلع من الفتحة (rise في index.css). القص overflow-clip مو hidden،
 * لأن hidden يخلّي الصندوق نفسه حاوية تمرير فالحركة تتبعه بدل الصفحة.
 * الساعة: مكان الوجه من الصورة نفسها (900×891): المركز عند 85.05٪ بالعرض و51.76٪ بالطول، وقطره 12.86٪ من العرض.
 */
function Portal() {
  return (
    <div className="relative mt-14 lg:mt-16">
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.16)_18%,rgb(255_255_255/0.16)_82%,transparent)]" />
      <div className="relative mx-auto w-[min(22rem,72vw)]">
        <Rim part="back" />
        <div className="relative z-10 aspect-[900/891] overflow-clip [mask-image:linear-gradient(to_top,transparent,#000_16%)]">
          <div className="rise relative size-full">
            <img src="/footer/watch.webp" alt="مسوّقك الذكي يأشّر على ساعته" width={900} height={891} loading="lazy" decoding="async" className="size-full" />
            <Clock />
          </div>
        </div>
        <Rim part="front" />
      </div>
    </div>
  );
}

/* الفتحة: بيضاوية أعرض من الشخصية، نصها فوق خط الأفق ونصها تحته */
function Rim({ part }: { part: "back" | "front" }) {
  const back = part === "back";
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 150"
      className={`absolute -left-[16%] bottom-0 w-[132%] translate-y-1/2 overflow-visible ${back ? "" : "z-20 drop-shadow-[0_0_10px_rgb(217_70_239/0.55)]"}`}
      fill="none"
    >
      <defs>
        <linearGradient id={`rim-${part}`} x1="0" x2="1">
          <stop offset="0" stopColor="#7c5cff" />
          <stop offset="0.5" stopColor="#d946ef" />
          <stop offset="1" stopColor="#ffa94d" />
        </linearGradient>
        {back && (
          <radialGradient id="hole" cx="0.5" cy="0.42" r="0.6">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.7" stopColor="#07080b" />
            <stop offset="1" stopColor="#15171d" />
          </radialGradient>
        )}
      </defs>
      {back ? (
        <>
          <ellipse cx="300" cy="75" rx="296" ry="71" fill="url(#hole)" />
          <path d="M4 75a296 71 0 0 1 592 0" stroke={`url(#rim-${part})`} strokeWidth="2.5" opacity="0.55" />
        </>
      ) : (
        <>
          <path d="M4 75a296 71 0 0 0 592 0" stroke={`url(#rim-${part})`} strokeWidth="3" />
        </>
      )}
    </svg>
  );
}

/* عقارب فوق وجه الساعة: الدقائق تدور بسرعة والساعات أبطأ، يعني الوقت يمشي */
function Clock() {
  return (
    <svg aria-hidden viewBox="-50 -50 100 100" className="absolute left-[85.05%] top-[51.76%] w-[12.86%] -translate-x-1/2 -translate-y-1/2">
      <circle r="47" fill="#fbfbfc" />
      <path d="M0-43v6M43 0h-6M0 43v-6M-43 0h6" stroke="#c4c8d0" strokeWidth="3" strokeLinecap="round" />
      <line className="clock-h" y2="-22" stroke="#111318" strokeWidth="5.5" strokeLinecap="round" />
      <line className="clock-m" y2="-34" stroke="#111318" strokeWidth="3.5" strokeLinecap="round" />
      <circle r="4" fill="#d946ef" />
    </svg>
  );
}
