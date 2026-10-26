import { useRef } from "react";
import { gsap, reduced, useGSAP } from "../../lib/gsap";
import { SIGNUP_URL } from "../../lib/links";
import { Ink } from "../Ink";
import { Container } from "../layout";
import { StoreChips } from "../StoreChips";
import { Mascot } from "./Mascot";
import { Team } from "./Team";

/*
 * الهيرو يملا الشاشة (لين 56rem في الشاشات الطويلة، وبعدها يبان أول القسم اللي بعده)، والمحتوى في نص المساحة اللي تحت النافبار:
 * المسافة فوقه نفس اللي تحته، على أي ارتفاع.
 *
 * التخطيط حسب العرض الفعلي (يعني بعد الزوم):
 *   الجوال: الكلام، بعده الشخصية، بعدها كرت الفريق.
 *   من 640: تحت الكلام كرت الفريق يمين والشخصية يسار تأشّر عليه.
 *   من 1024: الكلام يمين بعرضه، والفريق مع الشخصية في نص اللي باقي.
 * السطر الثاني مقسوم سطرين عن قصد: يخلّي عمود الكلام ضيق، فتلقى الشخصية مكان حتى على 1024.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reduced()) { gsap.set("[data-a]", { opacity: 1 }); return; }
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo("[data-a=line]", { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12 }, 0.1)
      .fromTo("[data-a=fade]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.4)
      .fromTo("[data-a=team]", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.45)
      .fromTo("[data-a=team] [data-row]", { x: 14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.09 }, 0.75)
      .fromTo("[data-a=mascot]", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "back.out(1.4)" }, 0.75)
      .fromTo("[data-a=hello]", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.2)" }, 1.6);
  }, { scope: ref });

  return (
    <section ref={ref} className="flex min-h-[min(100svh,56rem)] flex-col overflow-x-clip pt-(--nav-h)">
      <Container className="grid flex-1 items-center gap-x-10 gap-y-12 py-[clamp(1.5rem,6vh,4rem)] lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="max-w-[34rem]">
          <h1 className="text-[clamp(2.05rem,min(3.6vw,6.6vh),3.5rem)] font-bold leading-[1.3]">
            <span data-reveal data-a="line" className="block">
              <Ink>وكالة تسويق</Ink> <span className="chip">كاملة</span>،
            </span>
            <span data-reveal data-a="line" className="block">
              <Ink>بدون ما توظّف أحد.</Ink>
            </span>
          </h1>
          <p data-reveal data-a="fade" className="mt-4 text-[1.0625rem] font-semibold leading-[1.7] lg:text-lg">
            <span className="block"><Ink>يشغّلها الذكاء الاصطناعي،</Ink></span>
            <span className="block"><Ink>والأولى من نوعها في الوطن العربي</Ink></span>
          </p>

          <div data-reveal data-a="fade" className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={SIGNUP_URL}
              className="inline-flex h-12 items-center rounded-[14px] bg-white px-7 font-semibold text-night transition-[background-color,scale] hover:bg-[#e9eaee] active:scale-[0.97]"
            >
              اربط متجرك
            </a>
            <a href="#services" className="underline decoration-white/40 underline-offset-[7px] transition-colors hover:decoration-white">
              شوف وش نسوي
            </a>
          </div>

          <div data-reveal data-a="fade" className="mt-8">
            <p className="text-[0.9375rem] font-medium">نشتغل مع متجرك على</p>
            <StoreChips className="mt-3" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-center sm:justify-between lg:justify-end lg:gap-4">
          <Team />
          <Mascot className="w-[min(15rem,62vw)] self-center max-sm:order-first sm:w-[min(20rem,38vw)] lg:w-[min(24rem,26vw,62vh)]" />
        </div>
      </Container>
    </section>
  );
}
