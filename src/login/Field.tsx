import { useId, useState, type ComponentProps } from "react";

/*
 * خانة الإدخال: العنوان فوق، والخانة غامقة بحد أسود خفيف، وتنوّر لما تكتب فيها.
 * كلمة المرور فيها «إظهار» بمفتاح على الطرف.
 * الإيميل والروابط والأرقام تنكتب من اليسار (dir=ltr)، والكلام العربي من اليمين.
 */
export function Field({
  label,
  hint,
  type = "text",
  className = "",
  ...input
}: { label: string; hint?: string } & ComponentProps<"input">) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const password = type === "password";

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.9375rem] font-semibold">{label}</label>
      <div className="flex h-13 items-center rounded-[14px] bg-night-3 ring-1 ring-black/70 transition-shadow focus-within:ring-2 focus-within:ring-white/35">
        <input
          id={id}
          type={password && shown ? "text" : type}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`h-full min-w-0 flex-1 bg-transparent px-4 text-[1rem] text-white outline-none! placeholder:text-[#6b7080] ${password ? "text-right" : ""} ${className}`}
          {...input}
        />
        {password && (
          <button type="button" role="switch" aria-checked={shown} onClick={() => setShown(!shown)} className="group flex h-full shrink-0 items-center gap-2.5 ps-2 pe-3 text-[0.8125rem] text-fog">
            إظهار
            <span className="relative h-6 w-11 rounded-full bg-white/15 transition-colors group-aria-checked:bg-white">
              <span className="absolute start-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-[translate,background-color] duration-200 ease-lift group-aria-checked:-translate-x-5 group-aria-checked:bg-night" />
            </span>
          </button>
        )}
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-[0.8125rem] text-fog">{hint}</p>}
    </div>
  );
}
