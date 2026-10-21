/* القسم: غامق أو فاتح. شريط التنقل يقرأ data-theme ويتلوّن على حسبه. */
export function Section({
  id,
  theme,
  className = "",
  children,
}: {
  id?: string;
  theme: "dark" | "light";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={`relative overflow-x-clip ${theme === "dark" ? "board-grain bg-board text-chalk" : "bg-snow text-ink"} ${className}`}
    >
      {children}
    </section>
  );
}

export function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`font-display text-[clamp(1.85rem,3.3vw,2.9rem)] font-extrabold leading-[1.32] ${className}`}>{children}</h2>;
}

/** ورقة بيضا معلّقة بدبوس: نفس مادة اللوح في الهيرو. */
export const paperShadow =
  "shadow-[0_1px_0_rgba(255,255,255,.7)_inset,0_18px_26px_-18px_rgba(0,0,0,.55),0_2px_4px_rgba(0,0,0,.12)]";
export const paperShadowDark =
  "shadow-[0_1px_0_rgba(255,255,255,.7)_inset,0_22px_30px_-20px_rgba(0,0,0,.9),0_2px_4px_rgba(0,0,0,.35)]";
