import { SIGNUP_URL } from "@/lib/links";
import { HeroScene } from "./HeroScene";
import { HeroThemeSync } from "./HeroThemeSync";

export function Hero() {
  return (
    <section id="hero" className="hero-dark relative overflow-hidden">
      <HeroThemeSync />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-6 px-4 pb-20 pt-[104px] sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-6 lg:pb-24 lg:pt-[124px]">
        <div className="max-w-[620px]">
          <h1 className="font-display text-[2.15rem] font-extrabold leading-[1.25] text-[#F6F4EE] sm:text-[3rem] lg:text-[2.3rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
            <span className="sm:block">وكالة تسويق كاملة، </span>
            <span className="sm:block">يشغّلها الذكاء الاصطناعي</span>
          </h1>
          <p className="mt-5 max-w-[30em] text-[1.2rem] leading-[1.65] text-[#A3ABBC] sm:text-[1.4rem]">
            نسوي حملاتك على ميتا وقوقل وتيك توك وسناب، ونتابعها كل يوم ونعدّل عليها أول بأول. وكل قرار تشوفه قدامك.
          </p>
          <div className="mt-8 flex w-full max-w-[340px] flex-col items-stretch gap-3.5 sm:max-w-none sm:flex-row">
            <a href={SIGNUP_URL} className="btn btn-primary btn-lg">
              ابدأ الحين
            </a>
            <a href="#events" className="btn btn-ghost-dark btn-lg">
              شوف وش نسوي
            </a>
          </div>
          <p className="mt-5 text-[1.05rem] text-[#7D8597]">مع سلة وزد، أو أي موقع عندك.</p>
        </div>
        <HeroScene />
      </div>
    </section>
  );
}
