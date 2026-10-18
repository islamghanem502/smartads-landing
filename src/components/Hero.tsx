import { SIGNUP_URL } from "@/lib/links";

export function Hero() {
  return (
    <section className="px-4 pb-28 pt-[124px] sm:px-8 md:pt-[136px]">
      <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
        <h1 className="font-display text-[2.15rem] font-extrabold leading-[1.25] sm:text-[3.3rem] lg:text-[4rem]">
          <span className="sm:block">وكالة تسويق كاملة، </span>
          <span className="sm:block">يشغّلها الذكاء الاصطناعي</span>
        </h1>
        <p className="mt-5 max-w-[34em] text-[1.2rem] leading-[1.65] text-ink-soft sm:text-[1.45rem]">
          نسوي حملاتك على ميتا وقوقل وتيك توك وسناب، ونتابعها كل يوم ونعدّل عليها أول بأول. وكل قرار تشوفه قدامك.
        </p>
        <div className="mt-8 flex w-full max-w-[340px] flex-col items-stretch gap-3.5 sm:max-w-none sm:flex-row sm:justify-center">
          <a href={SIGNUP_URL} className="btn btn-primary btn-lg">
            ابدأ الحين
          </a>
          <a href="#events" className="btn btn-quiet btn-lg">
            شوف وش نسوي
          </a>
        </div>
        <p className="mt-5 text-[1.05rem] text-ink-soft">مع سلة وزد وشوبيفاي، أو أي موقع عندك.</p>
      </div>
    </section>
  );
}
