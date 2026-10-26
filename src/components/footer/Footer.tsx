import { useEffect, useRef } from "react";
import { reduced } from "../../lib/gsap";
import { APP_URL, LOGIN_URL, SIGNUP_URL } from "../../lib/links";
import { Ink } from "../Ink";
import { Container } from "../layout";
import { LINKS } from "../Nav";

/*
 * الفوتر: الختام فوق (لا تضيّع وقت + سجّل/دخول)، وبعده الشخصية طالعة من بوابة بيضاوية على خط الأفق
 * وتورّيك ساعتها (عقاربها تركض: الوقت يمشي)، وتحت الخط الروابط وبيانات المؤسسة.
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
 * البوابة: SVG واحد بعرض الفتحة (1000 وحدة)، وخط الأفق يمر من نصها.
 * الطبقات: جوف الفتحة والحافة اللي ورا ← الشخصية ← الحافة اللي قدّام.
 * الشخصية مقصوصة بـ(كل اللي فوق نص الفتحة + الفتحة نفسها): جسمها ينزل داخل الفتحة، ويختفي ورا الحافة اللي قدّام
 * بنفس انحناءها، ويغمق كل ما نزل. لما ينزل الزائر للفوتر تطلع من الفتحة (rise في index.css، على خط زمني --portal).
 * الصورة: مقاسها، ومكان وجه الساعة فيها، ونص الجسم بالعرض (الذراع المرفوعة تخلّيه يسار نص الصورة) في IMG.
 * لو تغيّرت الصورة غيّر الأرقام هنا بس.
 * الشخصية كلها (بذراعها المرفوعة) في نص الفتحة، والفتحة أعرض منها شوي، وعمقها ثلث عرضها عشان حافتها اللي ورا تمر ورا الذراعين.
 */
const IMG = { src: "/footer/watch.webp", w: 900, h: 915, dial: { x: 0.874, y: 0.4855, rx: 0.0489, ry: 0.0491 } };
const HOLE = { w: 1000, cy: 535, rx: 420, ry: 140 };
const ART_W = 640;
const ART_H = (ART_W * IMG.h) / IMG.w;
const ART_X = (HOLE.w - ART_W) / 2;
const ART_Y = HOLE.cy + HOLE.ry * 0.92 - ART_H; // الخصر تحت الحافة اللي قدّام (مخفي)
const VIEW_H = HOLE.cy + HOLE.ry + 20;
const arc = (sweep: 0 | 1) => `M${HOLE.w / 2 - HOLE.rx} ${HOLE.cy}a${HOLE.rx} ${HOLE.ry} 0 0 ${sweep} ${2 * HOLE.rx} 0`;

function Portal() {
  const { cy, rx, ry } = HOLE;
  const cx = HOLE.w / 2;
  return (
    <div className="portal relative mt-14 lg:mt-16">
      <span
        aria-hidden
        className="absolute inset-x-0 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.16)_18%,rgb(255_255_255/0.16)_82%,transparent)]"
        style={{ top: `${(cy / VIEW_H) * 100}%` }}
      />
      <svg viewBox={`0 0 ${HOLE.w} ${VIEW_H}`} role="img" aria-label="مسوّقك الذكي يأشّر على ساعته" className="relative mx-auto block w-[min(36rem,96vw)] overflow-visible">
        <defs>
          <linearGradient id="rim" x1="0" x2="1">
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset="0.5" stopColor="#d946ef" />
            <stop offset="1" stopColor="#ffa94d" />
          </linearGradient>
          {/* الجدار البعيد داخل الفتحة فيه شوية ضوء، والقريب ظلام */}
          <linearGradient id="hole" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#262a35" />
            <stop offset="0.45" stopColor="#0b0c10" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <clipPath id="portal-clip">
            <rect width={HOLE.w} height={cy} />
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
          </clipPath>
          <linearGradient id="sink" gradientUnits="userSpaceOnUse" x1="0" y1={cy - ry * 0.3} x2="0" y2={cy + ry * 0.8}>
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="sink-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={HOLE.w} height={VIEW_H}>
            <rect width={HOLE.w} height={VIEW_H} fill="url(#sink)" />
          </mask>
          <filter id="glow" x="-10%" y="-60%" width="120%" height="220%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#hole)" />
        <path d={arc(1)} stroke="url(#rim)" strokeWidth="2.5" fill="none" opacity="0.45" />
        <g clipPath="url(#portal-clip)" mask="url(#sink-mask)">
          <g className="rise">
            <image href={IMG.src} x={ART_X} y={ART_Y} width={ART_W} height={ART_H} />
            <Clock />
          </g>
        </g>
        <path d={arc(0)} stroke="url(#rim)" strokeWidth="14" fill="none" opacity="0.5" filter="url(#glow)" />
        <path d={arc(0)} stroke="url(#rim)" strokeWidth="4.5" fill="none" />
      </svg>
    </div>
  );
}

/*
 * الساعة: تبدأ على الوقت الحقيقي حق الزائر، وبعدين تركض (عقرب الدقائق يلف كل 12 ثانية والساعات معه بنسبته)،
 * يعني الوقت يمشي وإنت واقف. عقربين عريضين بس، الدقائق بالوردي، عشان الحركة تبان على وجه صغير.
 * مرسومة على وجه 100 وحدة (نص قطره 50) وتنكبر على وجه الساعة اللي في الصورة.
 * تركض بس والفوتر على الشاشة. قبل الجافاسكربت تطلع على 10:10، ومع «تقليل الحركة» على الوقت الحقيقي وثابتة.
 */
const LAP = 12; // ثواني للفة عقرب الدقائق

function Clock() {
  const hands = useRef<SVGGElement>(null);
  useEffect(() => {
    const [h, m] = [...hands.current!.children] as SVGGElement[];
    const now = new Date();
    let minutes = (now.getHours() % 12) * 60 + now.getMinutes() + now.getSeconds() / 60; // من الساعة 12
    const draw = () => {
      h.setAttribute("transform", `rotate(${(minutes / 2) % 360})`);
      m.setAttribute("transform", `rotate(${(minutes * 6) % 360})`);
    };
    draw();
    if (reduced()) return;

    let frame = 0, last = 0;
    const run = (t: number) => {
      if (last) minutes += ((t - last) / 1000) * (60 / LAP);
      last = t;
      draw();
      frame = requestAnimationFrame(run);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(frame);
      last = 0;
      if (e.isIntersecting) frame = requestAnimationFrame(run);
    });
    io.observe(hands.current!.closest("svg")!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const x = ART_X + IMG.dial.x * ART_W, y = ART_Y + IMG.dial.y * ART_H;
  const sx = (IMG.dial.rx * ART_W) / 50, sy = (IMG.dial.ry * ART_H) / 50;
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
      <circle r="46" fill="#fbfbfc" />
      <g ref={hands} strokeLinecap="round">
        <g transform="rotate(300)"><line y1="4" y2="-21" stroke="#111318" strokeWidth="10" /></g>
        <g transform="rotate(60)"><line y1="4" y2="-34" stroke="#d946ef" strokeWidth="7" /></g>
      </g>
      <circle r="7" fill="#111318" />
    </g>
  );
}
