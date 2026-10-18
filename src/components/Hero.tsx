import { SIGNUP_URL } from "@/lib/links";
import { HeroCards } from "./HeroCards";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-14 px-4 pb-24 pt-10 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:pt-16">
      <div className="max-w-[640px]">
        <h1 className="font-display text-[2.6rem] font-bold leading-[1.2] tracking-tight sm:text-[3.3rem] lg:text-[2.75rem] xl:text-[3.2rem]">
          <span className="lg:block">وكالة تسويق كاملة، </span>
          <span className="lg:block">يشغّلها الذكاء الاصطناعي</span>
        </h1>
        <p className="mt-6 max-w-[30em] text-[1.15rem] leading-[1.9] text-ink-soft sm:text-[1.25rem]">
          نسوي حملاتك على ميتا وقوقل وتيك توك وسناب، ونتابعها كل يوم ونعدّل عليها أول بأول. وكل قرار تشوفه قدامك.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3.5">
          <a href={SIGNUP_URL} className="btn btn-primary btn-lg">
            ابدأ الحين
          </a>
          <a href="#what" className="btn btn-quiet btn-lg">
            شوف وش نسوي
          </a>
        </div>
        <p className="mt-6 text-[0.95rem] text-ink-soft">مع سلة وزد وشوبيفاي، أو أي موقع عندك.</p>
      </div>
      <HeroCards />
    </section>
  );
}
