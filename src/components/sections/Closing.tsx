import { LOGIN_URL, SIGNUP_URL } from "@/lib/links";
import { Hand } from "@/components/ui/Hand";
import { Mark } from "@/components/ui/Mark";
import { Section } from "@/components/ui/Section";

export function Closing() {
  return (
    <Section theme="dark">
      <div className="mx-auto max-w-[56rem] px-5 py-32 text-center lg:py-40">
        <h2 className="font-display text-[clamp(2.1rem,4.6vw,3.9rem)] font-extrabold leading-[1.3]">
          متجرك جاهز؟
          <br />
          التسويق <Mark>علينا</Mark>.
        </h2>
        <p className="mx-auto mt-6 max-w-[30em] text-[1.0625rem] leading-[1.9] text-chalk-soft">اربط متجرك اليوم، وبكرة الصبح يوصلك أول تقرير.</p>
        <div className="relative mt-10 inline-flex">
          <a
            href={SIGNUP_URL}
            className="inline-flex h-13 items-center rounded-[12px] bg-green px-8 font-display text-[1.0625rem] font-semibold text-white transition-colors hover:bg-green-deep"
          >
            اربط متجرك
          </a>
          <Hand shape="arrow" className="absolute -left-24 -top-10 hidden h-16 w-24 text-chalk-soft sm:block" width={1.8} />
        </div>
        <p className="mt-6 text-[0.875rem] text-chalk-soft">بدون التزام، وتلغي بضغطة.</p>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="bg-board-2 text-chalk-soft">
      <div className="mx-auto flex max-w-[80rem] flex-col gap-8 px-5 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="flex items-center gap-2 font-display text-[1.0625rem] font-bold text-chalk">
            <svg viewBox="0 0 40 40" className="size-7" aria-hidden><use href="#pushpin" /></svg>
            مسوّقك الذكي
          </p>
          <p className="mt-2 text-[0.875rem]">أول وكالة تسويق في الوطن العربي يشغّلها الذكاء الاصطناعي.</p>
        </div>
        <nav aria-label="روابط الفوتر">
          <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[0.9375rem]">
            <li><a href="#how" className="hover:text-chalk">كيف نشتغل</a></li>
            <li><a href="#events" className="hover:text-chalk">المميزات</a></li>
            <li><a href="#pricing" className="hover:text-chalk">الأسعار</a></li>
            <li><a href="#faq" className="hover:text-chalk">الأسئلة</a></li>
            <li><a href={LOGIN_URL} className="hover:text-chalk">دخول</a></li>
          </ul>
        </nav>
        <p className="text-[0.8125rem]">© ٢٠٢٦ مسوّقك الذكي</p>
      </div>
    </footer>
  );
}
