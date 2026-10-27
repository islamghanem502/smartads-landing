import { MascotFace } from "../components/MascotFace";

/*
 * شخصيتنا نفسها (صورة الهيرو ووجهها) بس صغيرة، قاعدة على حافة كرت الدخول.
 * الحافة على 83% من طول الصورة: الجسم فوقها ويدها عليها، ورجولها القصيرة متدلية على الكرت.
 * يدها الثانية ممدودة للفقاعة اللي جنبها، وفيها كلامها (ترحيب، أو وش صار).
 * oops: خطأ (كلمة مرور غلط مثلاً)، فتهز راسها. كل خطأ جديد يعيد الهزة.
 */
export function Sitter({ say, oops }: { say: string; oops: boolean }) {
  return (
    <div className="pointer-events-none absolute end-4 top-0 w-[8rem] -translate-y-[83%] select-none sm:end-8 sm:w-[9rem]">
      <div key={oops ? say : undefined} className={`relative ${oops ? "oops" : ""}`}>
        {/* ظل خفيف على الكرت تحتها */}
        <span aria-hidden className="absolute left-[6%] top-[80%] h-[8%] w-[62%] rounded-[50%] bg-black/50 blur-[6px]" />
        <img src="/mascot.webp" alt="" width={1200} height={1200} draggable={false} className="relative h-auto w-full" />
        <MascotFace />
      </div>
      {/* الفقاعة: هي نفسها رسالة الخطأ، فقارئ الشاشة يقرأها */}
      <p
        role="status"
        aria-live="polite"
        className="absolute left-[94%] top-[10%] w-max max-w-[min(15rem,calc(100vw-10.5rem))] rounded-[16px] rounded-bl-[4px] bg-white px-3.5 py-2 text-[0.875rem] font-semibold leading-[1.5] text-night shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] sm:text-[0.9375rem]"
      >
        {say}
      </p>
    </div>
  );
}
