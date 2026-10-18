import { LOGIN_URL, SIGNUP_URL } from "@/lib/links";
import { Dock } from "./Dock";

export function Logo() {
  return (
    <a href="/" className="flex items-center gap-2.5" aria-label="مسوّقك الذكي، الرئيسية">
      {/* علامة مؤقتة لحد ما نقرر الشعار */}
      <span className="grid size-9 place-items-center rounded-[11px] bg-saffron font-display text-lg font-bold text-ink" aria-hidden>
        م
      </span>
      <span className="font-display text-[1.1rem] font-bold">مسوّقك الذكي</span>
    </a>
  );
}

export function Header() {
  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-40 flex h-[76px] items-center justify-between px-4 sm:px-8">
        <Logo />
        <div className="flex items-center gap-5">
          <a href={LOGIN_URL} className="hdr-muted hidden font-display text-[0.92rem] sm:inline">
            دخول
          </a>
          <a href={SIGNUP_URL} className="btn btn-primary btn-sm">
            ابدأ الحين
          </a>
        </div>
      </header>
      <Dock />
    </>
  );
}
