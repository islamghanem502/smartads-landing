import type { IconType } from "react-icons";
import { SiGoogle, SiMeta, SiSnapchat, SiTiktok } from "react-icons/si";
import { SIGNUP_URL } from "@/lib/links";
import { HeroScene } from "./HeroScene";
import { HeroThemeSync } from "./HeroThemeSync";

function Chip({ Icon, color, children }: { Icon?: IconType; color?: string; children: React.ReactNode }) {
  return (
    <span className="pchip">
      {Icon ? <Icon aria-hidden style={{ color }} /> : null}
      {children}
    </span>
  );
}

export function Hero() {
  return (
    <section id="hero" className="hero-dark relative overflow-hidden">
      <HeroThemeSync />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-6 px-4 pb-20 pt-[104px] sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:pb-24 lg:pt-[124px]">
        <div className="max-w-[620px]">
          <h1 className="font-display text-[2.15rem] font-extrabold leading-[1.3] text-cream sm:text-[3rem] lg:text-[2.35rem] xl:text-[2.6rem] 2xl:text-[2.95rem]">
            <span className="sm:block">وكالة تسويق كاملة، </span>
            <span className="sm:block">
              يشغّلها <span className="hl">الذكاء الاصطناعي</span>
            </span>
          </h1>
          <p className="mt-6 max-w-[31em] text-[1.2rem] leading-[1.95] text-cream-soft sm:text-[1.35rem]">
            نسوي حملاتك على
            <Chip Icon={SiMeta} color="#5B9BFF">ميتا</Chip>
            <Chip Icon={SiGoogle} color="#8AB4F8">قوقل</Chip>
            <Chip Icon={SiTiktok} color="#F4EEE5">تيك توك</Chip>
            <Chip Icon={SiSnapchat} color="#FFFC00">سناب</Chip>، ونتابعها <strong className="font-bold text-cream">كل يوم</strong> ونعدّل
            عليها أول بأول. و<strong className="font-bold text-cream">كل قرار تشوفه قدامك</strong>.
          </p>
          <div className="mt-9 flex w-full max-w-[340px] flex-col items-stretch gap-3 sm:max-w-none sm:flex-row">
            <a href={SIGNUP_URL} className="btn btn-primary btn-lg">
              ابدأ الحين
            </a>
            <a href="#events" className="btn btn-ghost-dark btn-lg">
              شوف وش نسوي
            </a>
          </div>
          <p className="mt-6 text-[1.05rem] text-cream-faint">
            يشتغل مع
            <span className="pchip" style={{ color: "#7DF0D8" }}>
              سلة
            </span>
            <span className="pchip" style={{ color: "#CDB0FF" }}>
              زد
            </span>
            أو أي موقع عندك.
          </p>
        </div>
        <HeroScene />
      </div>
    </section>
  );
}
