import { MascotFace } from "../components/MascotFace";

/*
 * شخصيتنا صغيرة قاعدة على حافة كرت الدخول (صورة Manus بنفس نسبها، وشاشتها فاضية).
 * الحافة على 80% من طول الصورة: يدها على الحافة ورجولها القصيرة متدلية على الكرت،
 * ويدها الثانية ممدودة للفقاعة اللي جنبها، وفيها كلامها (ترحيب، أو وش صار).
 * oops: خطأ (كلمة مرور غلط مثلاً)، فتهز راسها. كل خطأ جديد يعيد الهزة.
 */
// شاشتها في الصورة (1200): نصها 494,318 ومايلة 10 درجات، وأصغر من شاشة الهيرو شوي
const FACE = "translate(494 318) rotate(-10) scale(0.6426) translate(-965 -530)";

export function Sitter({ say, oops }: { say: string; oops: boolean }) {
  return (
    <div className="pointer-events-none absolute end-4 top-0 w-[8.5rem] -translate-y-[80%] select-none sm:end-8 sm:w-[9.5rem]">
      <div key={oops ? say : undefined} className={`relative ${oops ? "oops" : ""}`}>
        {/* ظل خفيف على الكرت تحتها */}
        <span aria-hidden className="absolute left-[10%] top-[77%] h-[7%] w-[66%] rounded-[50%] bg-black/50 blur-[6px]" />
        <img src="/login/sit.webp" alt="" width={600} height={600} draggable={false} className="relative h-auto w-full" />
        <MascotFace view="0 0 1200 1200" place={FACE} />
      </div>
      {/* الفقاعة: هي نفسها رسالة الخطأ، فقارئ الشاشة يقرأها */}
      <p
        role="status"
        aria-live="polite"
        className="absolute left-[90%] top-[14%] w-max max-w-[min(15rem,calc(100vw-11rem))] rounded-[16px] rounded-bl-[4px] bg-white px-3.5 py-2 text-[0.875rem] font-semibold leading-[1.5] text-night shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] sm:text-[0.9375rem]"
      >
        {say}
      </p>
    </div>
  );
}
