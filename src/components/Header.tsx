import { LOGIN_URL, SIGNUP_URL } from "@/lib/links";

export function Header() {
  return (
    <header data-reveal data-h="header" className="relative z-30 mx-auto flex max-w-[80rem] items-center justify-between px-5 py-5 lg:px-8">
      <a href="/" className="flex items-center gap-2.5 font-display text-[1.0625rem] font-bold text-chalk">
        <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
          <circle cx="10" cy="9" r="7" fill="var(--color-pin)" />
          <circle cx="7.6" cy="6.6" r="2" fill="rgba(255,255,255,.5)" />
        </svg>
        مسوّقك الذكي
      </a>
      <div className="flex items-center gap-5">
        <a href={LOGIN_URL} className="text-[0.9375rem] text-chalk-soft transition-colors hover:text-chalk">
          دخول
        </a>
        <a
          href={SIGNUP_URL}
          className="inline-flex h-10 items-center rounded-[10px] bg-green px-4 font-display text-[0.875rem] font-semibold text-white transition-colors hover:bg-green-deep"
        >
          اربط متجرك
        </a>
      </div>
    </header>
  );
}
