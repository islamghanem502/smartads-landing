import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { Ink } from "../Ink";
import { Container } from "../layout";
import { StoreChips } from "../StoreChips";
import { ChooseVisual, GrowVisual, LearnVisual, LinkVisual, RankVisual, TestVisual, type VisualProps } from "./visuals";

/*
 * «طيب، كيف نشتغل؟»: ست خطوات ورا بعض. في اللابتوب الكلام يمين والرسمة يسار ثابتة على الشاشة،
 * وتتبدّل لما توصل كل خطوة (الخطوة اللي في نص الشاشة هي النشطة). في الجوال كل خطوة كلامها ورسمتها مع بعض.
 * على يمين الخطوات خط يتعبّى لين الخطوة النشطة.
 */
const STEPS: { title: string; text: string; extra?: ReactNode; Visual: ComponentType<VisualProps> }[] = [
  { title: "حط رابط متجرك", text: "ونحلّل منتجاتك وعملاءك، ونطلع لك خطة تناسبك.", extra: <StoreChips />, Visual: LinkVisual },
  { title: "اختر وش نمسك لك", text: "إعلانات، أو نشر في حساباتك، أو الاثنين مع بعض.", Visual: ChooseVisual },
  { title: "نطلق حملاتك ونتابعها لحظة بلحظة", text: "نختبر أكثر من إعلان، ونوجّه ميزانيتك تلقائياً للي يجيب مبيعات.", Visual: TestVisual },
  { title: "طلب واحد يعلّم كل المنصات", text: "جاك طلب من سناب؟ ميتا وتيك توك وقوقل يعرفون مين اشترى، ويوصلون لناس يشبهونه.", Visual: LearnVisual },
  { title: "يدوّرون في قوقل؟ يلقونك أول", text: "نحسّن منتجاتك كل يوم ونكتب مقالات لمدونتك، عشان تكون أول اسم في قوقل وأدوات الذكاء الاصطناعي.", Visual: RankVisual },
  { title: "جمهور يشتري حتى بدون إعلانات", text: "صور وفيديوهات بهويتك، ونشر منتظم يبني لك متابعين يرجعون يشترون.", Visual: GrowVisual },
];

const stage = "@container grid aspect-square w-full place-items-center rounded-[32px] bg-night-2 ring-1 ring-line";

export function How() {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);
  const [plays, setPlays] = useState(() => STEPS.map(() => 0));

  // الخطوة اللي توصل نص الشاشة تصير النشطة، وقصة رسمتها تعيد كل ما ترجع لها
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const i = Number((e.target as HTMLElement).dataset.step);
        setActive(i);
        setPlays((p) => p.map((n, k) => (k === i ? n + 1 : n)));
      }
    }, { rootMargin: "-45% 0px -45% 0px" });
    // الخطوات بس (الخط اللي يتعبّى داخل نفس القائمة)
    for (const li of list.current!.querySelectorAll(":scope > li")) io.observe(li);
    return () => io.disconnect();
  }, []);

  const shown = Math.max(active, 0);
  return (
    <section id="how" className="py-(--section-y)">
      <Container>
        <h2 className="text-center text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.25]">
          <Ink>طيب، كيف</Ink> <span className="chip">نشتغل</span>؟
        </h2>

        <div className="mt-12 grid gap-x-16 lg:mt-20 lg:grid-cols-2">
          <ol ref={list} className="relative lg:self-start">
            {/* الخط اللي يتعبّى مع الخطوات: من رقم أول خطوة لين رقم آخر وحدة */}
            <span aria-hidden className="absolute bottom-14 right-4 top-14 w-px bg-white/10 lg:bottom-[10%] lg:top-[10%]">
              <span
                className="absolute inset-x-0 top-0 bg-[linear-gradient(to_bottom,#7c5cff,#d946ef,#ffa94d)] transition-[height] duration-700 ease-lift"
                style={{ height: `${(shown / (STEPS.length - 1)) * 100}%` }}
              />
            </span>
            {STEPS.map(({ title, text, extra, Visual }, i) => (
              <li key={title} data-step={i} className="relative flex flex-col justify-center py-10 pe-0 ps-14 lg:min-h-[70vh] lg:py-0">
                <span
                  className={`absolute right-0 top-10 grid size-8 place-items-center rounded-full text-[0.875rem] font-bold transition-colors duration-500 lg:top-1/2 lg:-translate-y-1/2 ${i <= shown ? "bg-white text-night" : "bg-night-3 text-white/50"}`}
                >
                  {i + 1}
                </span>
                <h3 className={`text-[clamp(1.5rem,2.4vw,2.125rem)] font-bold leading-[1.3] transition-opacity duration-500 lg:max-w-[26rem] ${i === shown ? "opacity-100" : "lg:opacity-35"}`}>{title}</h3>
                <p className={`mt-3 max-w-[26rem] text-[1.0625rem] leading-[1.8] text-mist transition-opacity duration-500 ${i === shown ? "opacity-100" : "lg:opacity-35"}`}>{text}</p>
                {extra && <div className={`mt-6 transition-opacity duration-500 ${i === shown ? "opacity-100" : "lg:opacity-35"}`}>{extra}</div>}
                {/* في الجوال: الرسمة تحت الكلام */}
                <div className={`${stage} mt-8 max-w-[26rem] lg:hidden`}>
                  <Visual play={plays[i]} />
                </div>
              </li>
            ))}
          </ol>

          {/* في اللابتوب: الرسمة ثابتة على الشاشة وتتبدّل مع الخطوة */}
          {/* المسرح في نص المساحة اللي تحت النافبار بالضبط، وحجمه على طول الشاشة وما يطلع عن عرض العمود (100cqw) */}
          {/* العمود يطول تحت القائمة بقد اللي يحتاجه المسرح عشان يبقى في النص لين آخر خطوة */}
          {/* (الـ sticky يوقف عند محتوى أبوه، فالـ padding ما ينفع؛ الهامش السالب يمدّد العمود نفسه) */}
          <div className="@container hidden [--over:max(0px,calc(var(--nav-h)/2+var(--stage)/2-35vh))] [--stage:min(34rem,calc(100svh-var(--nav-h)-5rem),100cqw)] [margin-bottom:calc(-1*var(--over))] lg:block">
            <div className="sticky top-[calc(var(--nav-h)+(100svh-var(--nav-h)-var(--stage))/2)]">
              <div className="relative mx-auto w-(--stage)">
                {STEPS.map(({ title, Visual }, i) => (
                  <div
                    key={title}
                    aria-hidden={i !== shown}
                    className={`${stage} ${i === 0 ? "relative" : "absolute inset-0"} transition-[opacity,scale] duration-500 ease-lift ${i === shown ? "opacity-100" : "pointer-events-none scale-[0.97] opacity-0"}`}
                  >
                    <Visual play={plays[i]} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
