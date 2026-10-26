import { Salla, Website, ZidMark } from "./logos";

const STORES = [
  { L: Salla, name: "سلة" },
  { L: ZidMark, name: "زد" },
  { L: Website, name: "موقعك الخاص" },
];

/** المنصات اللي نشتغل عليها: حبوب بيضاء بالشعار والاسم (في الهيرو و«كيف نشتغل»). */
export function StoreChips({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {STORES.map(({ L, name }) => (
        <li key={name} className="flex h-11 items-center gap-2.5 rounded-full bg-white ps-2.5 pe-4 text-[0.9375rem] font-semibold text-night">
          <span className="grid size-7 place-items-center rounded-full bg-chip"><L className="size-[1.1rem]" /></span>
          {name}
        </li>
      ))}
    </ul>
  );
}
