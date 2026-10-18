import { LOGIN_URL, SIGNUP_URL } from "@/lib/links";

export function Logo() {
  return (
    <a href="/" className="flex items-center gap-2.5" aria-label="مسوّقك الذكي، الرئيسية">
      {/* علامة مؤقتة لحد ما نقرر الشعار */}
      <span
        className="grid size-9 place-items-center rounded-[11px] bg-saffron font-display text-lg font-bold text-ink"
        style={{ boxShadow: "0 3px 0 var(--color-saffron-lip)" }}
        aria-hidden
      >
        م
      </span>
      <span className="font-display text-[1.2rem] font-bold tracking-tight">مسوّقك الذكي</span>
    </a>
  );
}

const NAV = [
  { href: "#what", label: "وش نسوي" },
  { href: "#how", label: "كيف نبدأ" },
  { href: "#pricing", label: "الأسعار" },
];

export function Header() {
  return (
    <header className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-5 sm:px-8">
      <div className="flex items-center gap-10">
        <Logo />
        <nav className="hidden items-center gap-7 text-[0.975rem] text-ink-soft md:flex" aria-label="الأقسام">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-ink">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <a href={LOGIN_URL} className="hidden text-[0.975rem] font-medium text-ink-soft hover:text-ink sm:inline">
          دخول
        </a>
        <a href={SIGNUP_URL} className="btn btn-primary btn-sm">
          ابدأ الحين
        </a>
      </div>
    </header>
  );
}
