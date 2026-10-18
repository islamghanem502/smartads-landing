import { SIGNUP_URL } from "@/lib/links";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-[1240px] items-center gap-6 px-4 pb-20 pt-[104px] sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pt-[120px]">
      <div className="max-w-[620px]">
        <h1 className="font-display text-[2.15rem] font-extrabold leading-[1.25] sm:text-[3rem] lg:text-[2.5rem] xl:text-[2.7rem] 2xl:text-[3.1rem]">
          <span className="sm:block">وكالة تسويق كاملة، </span>
          <span className="sm:block">يشغّلها الذكاء الاصطناعي</span>
        </h1>
        <p className="mt-5 max-w-[30em] text-[1.2rem] leading-[1.65] text-ink-soft sm:text-[1.4rem]">
          نسوي حملاتك على ميتا وقوقل وتيك توك وسناب، ونتابعها كل يوم ونعدّل عليها أول بأول. وكل قرار تشوفه قدامك.
        </p>
        <div className="mt-8 flex w-full max-w-[340px] flex-col items-stretch gap-3.5 sm:max-w-none sm:flex-row">
          <a href={SIGNUP_URL} className="btn btn-primary btn-lg">
            ابدأ الحين
          </a>
          <a href="#events" className="btn btn-quiet btn-lg">
            شوف وش نسوي
          </a>
        </div>
        <p className="mt-5 text-[1.05rem] text-ink-soft">مع سلة وزد، أو أي موقع عندك.</p>
      </div>
      <HeroScene />
    </section>
  );
}
