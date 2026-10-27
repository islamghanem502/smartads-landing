import { useId, useState, type ComponentProps, type ReactNode } from "react";

/*
 * خانة الإدخال: العنوان فوق، والخانة غائرة في الكرت: حد أسود، وظل من فوق جوّاها، وخط فاتح خفيف تحتها.
 * hint على طرف سطر العنوان (مثل «8 أحرف على الأقل» أو «نسيت كلمة المرور؟»)، عشان الخانات تتساوى في الصف.
 * كلمة المرور فيها «إظهار» بمفتاح على الطرف، بنفس الحد الأسود.
 * الإيميل والروابط والأرقام تنكتب من اليسار (dir=ltr)، والكلام العربي من اليمين.
 */
export function Field({
  label,
  hint,
  type = "text",
  className = "",
  ...input
}: { label: string; hint?: ReactNode } & ComponentProps<"input">) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const password = type === "password";

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.9375rem] font-semibold">{label}</label>
        {hint && <span id={`${id}-hint`} className="text-[0.8125rem] text-fog">{hint}</span>}
      </div>
      <div className="flex h-13 items-center rounded-[14px] border-2 border-black bg-night-3 shadow-[inset_0_4px_8px_-2px_rgb(0_0_0/0.85),0_1px_0_rgb(255_255_255/0.08)] transition-colors focus-within:border-[#4a4f5c] lg:h-12">
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
            <span className="relative h-[1.625rem] w-12 rounded-full border-2 border-black bg-[#e4e5e9] transition-colors group-aria-checked:bg-night">
              <span className="absolute start-0.5 top-1/2 size-[1.125rem] -translate-y-1/2 rounded-full border-2 border-black bg-white transition-[translate] duration-200 ease-lift group-aria-checked:-translate-x-[1.375rem]" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
