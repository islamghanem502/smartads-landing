import { MascotFace } from "../MascotFace";

/** الشخصية واقفة وتمدّ يدها لكرت الفريق، كأنها تقول: هذا فريقك. */
export function Mascot({ className = "" }: { className?: string }) {
  return (
    <div data-a="mascot" data-reveal className={`mascot-ground relative shrink-0 ${className}`}>
      <img
        src="/mascot.webp"
        alt="شخصية مسوّقك الذكي: روبوت أبيض لابس غترة وعقال، واقف ويأشّر بيده على فريقك التسويقي"
        width={1200}
        height={1200}
        fetchPriority="high"
        draggable={false}
        className="h-auto w-full select-none"
      />
      <MascotFace />
      <p data-a="hello" data-reveal className="absolute left-[-6%] top-[-3%] whitespace-nowrap rounded-[16px] rounded-br-[4px] bg-white px-4 py-2 text-[0.9375rem] font-semibold text-night sm:text-[1.0625rem]">
        هلا والله!
      </p>
    </div>
  );
}
