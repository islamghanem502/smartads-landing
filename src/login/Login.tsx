import { useEffect, useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { Salla, Website, ZidMark, type Logo } from "../components/logos";
import { API_URL, APP_URL, LOGIN_URL, SIGNUP_URL } from "../lib/links";
import { Field } from "./Field";
import { Sitter } from "./Sitter";

/*
 * صفحة الدخول: نفس طرق المنصة بالضبط، بتصميمنا.
 *   سلة وزد: نوديه لـ /api/auth/{salla|zid}/install، والمنصة تكمّل الربط وترجّعه للوحة.
 *   موقعك الخاص: دخول بالإيميل وكلمة المرور (/api/auth/login)، أو حساب جديد (/api/auth/register)
 *   بنفس الخانات والشروط اللي في صفحة المنصة (custom-signup): كلمة المرور 8 أحرف، والواتساب أرقام بس.
 * الشخصية فوق الكرت هي اللي ترحّب وتقول وش صار (الأخطاء كلها في فقاعتها).
 * fresh: صفحة /signup/ (أزرار «اربط متجرك»): نفس الصفحة، بس العنوان «اربط متجرك» وموقعك الخاص يفتح على حساب جديد.
 * في اللابتوب الكرت عريض عشان ما يحتاج تمرير: الطرق الثلاث جنب بعض، والخانات كل ثنتين في صف،
 * ورابط «عندك حساب؟» جنب العنوان. في الجوال كل شي تحت بعض.
 */
type View = "stores" | "login" | "signup";
type Say = { text: string; oops?: boolean };

const HELLO: Record<View, Say> = {
  stores: { text: "هلا والله! متجرك على وين؟" },
  login: { text: "حيّاك! دخّل إيميلك وكلمة المرور" },
  signup: { text: "حيّاك! عرّفنا على موقعك" },
};

const STORES: { id: "salla" | "zid"; L: Logo; name: string }[] = [
  { id: "salla", L: Salla, name: "سلة" },
  { id: "zid", L: ZidMark, name: "زد" },
];

const WHATSAPP = /^\+?\d{7,15}$/;

export function Login({ fresh = false }: { fresh?: boolean }) {
  const [view, setView] = useState<View>("stores");
  const [say, setSay] = useState<Say>(HELLO.stores);
  const [busy, setBusy] = useState(false);

  // لو رجع للصفحة بزر الرجوع (بعد ما راح لسلة مثلاً) نرجّعها زي ما كانت
  useEffect(() => {
    const back = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      setBusy(false);
      setSay(HELLO.stores);
      setView("stores");
    };
    addEventListener("pageshow", back);
    return () => removeEventListener("pageshow", back);
  }, []);

  const open = (v: View) => {
    setView(v);
    setSay(HELLO[v]);
  };
  const oops = (text: string) => {
    setBusy(false);
    setSay({ text, oops: true });
  };

  const store = (id: "salla" | "zid", name: string) => {
    setBusy(true);
    setSay({ text: `يلا، نوديك لـ${name}…` });
    location.href = `${API_URL}/api/auth/${id}/install?redirect_to=/merchant`;
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const email = (f.email ?? "").trim();
    const signup = view === "signup";
    let body: Record<string, string> = { email, password: f.password };

    if (signup) {
      const whatsappNumber = (f.whatsapp ?? "").replace(/\s/g, "");
      const site = (f.site ?? "").trim();
      if (!f.store?.trim() || !site || !whatsappNumber || !email || !f.password) return oops("عبّ كل الخانات، كلها نحتاجها");
      if (!/^\S+@\S+\.\S+$/.test(email)) return oops("الإيميل مو صحيح، تأكد منه");
      if (f.password.length < 8) return oops("كلمة المرور لازم تكون 8 أحرف على الأقل");
      if (!WHATSAPP.test(whatsappNumber)) return oops("رقم الواتساب مو صحيح، اكتبه بالأرقام مع رمز الدولة");
      body = { ...body, storeName: f.store.trim(), websiteUrl: /^https?:\/\//i.test(site) ? site : `https://${site}`, whatsappNumber };
    } else if (!email || !f.password) {
      return oops("دخّل إيميلك وكلمة المرور");
    }

    setBusy(true);
    setSay({ text: "لحظة…" });
    try {
      const res = await fetch(`${API_URL}/api/auth/${signup ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // حساب جديد: إيميله مو مؤكد، فنوديه لصفحة التأكيد في المنصة على طول (مثل صفحتها)
        setSay({ text: signup ? "تم! باقي تأكد إيميلك" : "هلا فيك! نوديك للوحتك" });
        location.href = `${APP_URL}${signup ? "/auth/verify-required" : "/merchant"}`;
        return;
      }
      const data: { error?: string } = await res.json().catch(() => ({}));
      oops(explain(res.status, data.error));
    } catch {
      oops("ما قدرنا نوصل للسيرفر، تأكد من النت وجرّب");
    }
  }

  // رابط الصفحة الثانية: «عندك حساب؟» أو «جديد عندنا؟». في اللابتوب جنب العنوان، وفي الجوال تحت الكرت
  const other =
    view === "stores" ? (
      <Switch ask={fresh ? "عندك حساب؟" : "جديد عندنا؟"}>
        <a href={fresh ? LOGIN_URL : SIGNUP_URL}>{fresh ? "سجّل دخولك" : "اربط متجرك"}</a>
      </Switch>
    ) : (
      <Switch ask={view === "login" ? "ما عندك حساب؟" : "عندك حساب؟"}>
        <button type="button" onClick={() => open(view === "login" ? "signup" : "login")}>{view === "login" ? "سجّل موقعك" : "سجّل دخولك"}</button>
      </Switch>
    );

  const title = view === "stores" ? (fresh ? "اربط متجرك" : "سجّل دخولك") : view === "login" ? "دخول بموقعك الخاص" : "اربط موقعك الخاص";
  const sub = view === "stores" ? "اختر وين متجرك، ونكمّل من هناك." : view === "signup" ? "حط رابط موقعك، ونبدأ نفهم نشاطك ونجهّز خطتك. ما تحتاج بطاقة." : null;
  const back = (
    <button type="button" onClick={() => open("stores")} className="-ms-1 inline-flex items-center gap-1.5 text-[0.9375rem] text-fog transition-colors hover:text-white">
      <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 6 6 6-6 6" />
      </svg>
      سلة أو زد
    </button>
  );
  // في اللابتوب: العنوان وجنبه «سلة أو زد»، وتحته الوصف وجنبه «عندك حساب؟»
  const head = (
    <div className="grid gap-x-8 lg:grid-cols-[1fr_auto] lg:items-baseline">
      <h1 className="text-[1.75rem] font-bold leading-[1.3]">{title}</h1>
      <div className="hidden lg:block">{view !== "stores" && back}</div>
      {sub ? <p className="mt-2 text-[1rem] text-mist">{sub}</p> : <span />}
      <div className="hidden lg:mt-2 lg:block">{other}</div>
    </div>
  );

  return (
    <div className="relative flex min-h-svh flex-col">
      <header className="absolute inset-x-0 top-0 mx-auto flex w-full max-w-page items-center justify-between px-(--gutter) py-5">
        <a href="/" className="flex items-center gap-2.5 text-[1.0625rem] font-bold">
          <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-night-3 ring-1 ring-line">
            <img src="/mascot-head.png" alt="" width={36} height={36} className="mt-1 size-8 object-contain" />
          </span>
          مسوّقك الذكي
        </a>
        <a href="/" className="text-[0.9375rem] text-fog transition-colors hover:text-white">الرئيسية</a>
      </header>

      {/* فوق: مكان الهيدر والشخصية (قاعدة على الكرت، وأغلبها فوقه) */}
      <main className="flex flex-1 flex-col items-center justify-center px-(--gutter) pb-6 pt-44 sm:pt-48 lg:pt-36">
        <div className="relative w-full max-w-[27rem] lg:max-w-[50rem]">
          <Sitter say={say.text} oops={!!say.oops} />

          <div className="rounded-[28px] bg-night-2 px-5 pb-6 pt-10 ring-1 ring-line shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] sm:px-8 sm:pb-8 lg:px-10 lg:pt-8">
            {view === "stores" ? (
              <>
                {head}
                <ul className="mt-7 grid gap-3 lg:grid-cols-3">
                  {STORES.map(({ id, L, name }) => (
                    <li key={id}>
                      <Choice L={L} title={name} sub="بحساب متجرك" disabled={busy} onClick={() => store(id, name)} />
                    </li>
                  ))}
                  <li>
                    <Choice L={Website} title="موقعك الخاص" sub="بالإيميل وكلمة المرور" disabled={busy} onClick={() => open(fresh ? "signup" : "login")} />
                  </li>
                </ul>
              </>
            ) : (
              <form noValidate onSubmit={submit} onInput={() => say.oops && setSay(HELLO[view])}>
                <div className="mb-3 lg:hidden">{back}</div>
                {head}

                <div className="mt-7 grid grid-cols-1 gap-5 lg:mt-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-3.5">
                  {view === "signup" && (
                    <>
                      <Field label="اسم الموقع" name="store" autoComplete="organization" placeholder="مثال: متجر لمتي" disabled={busy} />
                      <Field label="رابط الموقع" name="site" type="url" dir="ltr" inputMode="url" autoComplete="url" placeholder="example.com" disabled={busy} />
                      <Field label="رقم الواتساب" name="whatsapp" type="tel" dir="ltr" autoComplete="tel" placeholder="+9665xxxxxxxx" disabled={busy} />
                    </>
                  )}
                  <Field label="البريد الإلكتروني" name="email" type="email" dir="ltr" autoComplete="email" placeholder="name@mail.com" disabled={busy} />
                  <Field
                    label="كلمة المرور"
                    name="password"
                    type="password"
                    dir="ltr"
                    autoComplete={view === "login" ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    hint={
                      view === "signup" ? (
                        "8 أحرف على الأقل"
                      ) : (
                        <a href={`${APP_URL}/auth/forgot-password`} className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-white">نسيت كلمة المرور؟</a>
                      )
                    }
                    disabled={busy}
                  />
                  {/* حساب جديد: الزر جنب كلمة المرور في اللابتوب. الدخول: تحت الخانتين */}
                  <button
                    type="submit"
                    disabled={busy}
                    className={`mt-2 inline-flex h-13 w-full items-center justify-center self-end rounded-[14px] bg-white text-[1rem] font-semibold text-night transition-[background-color,scale] hover:bg-[#e9eaee] active:scale-[0.98] disabled:opacity-60 lg:mt-0 lg:h-12 ${view === "login" ? "lg:col-span-2 lg:mt-3" : ""}`}
                  >
                    {busy ? "لحظة…" : view === "login" ? "دخول" : "أنشئ حسابك"}
                  </button>
                </div>
              </form>
            )}
            <div className="mt-6 border-t border-line pt-5 text-center lg:hidden">{other}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** «عندك حساب؟ سجّل دخولك»: سؤال، وجنبه الرابط (أو زر يبدّل الشكل) */
function Switch({ ask, children }: { ask: string; children: ReactNode }) {
  return (
    <p className="text-[0.9375rem] text-mist [&>a,&>button]:font-semibold [&>a,&>button]:text-white [&>a,&>button]:underline [&>a,&>button]:decoration-white/30 [&>a,&>button]:underline-offset-4 [&>a:hover,&>button:hover]:decoration-white">
      {ask} {children}
    </p>
  );
}

/** زر من طرق الدخول: شعار المنصة، واسمها، وكيف تدخل */
function Choice({ L, title, sub, ...button }: { L: Logo; title: string; sub: ReactNode } & Omit<ComponentProps<"button">, "title">) {
  return (
    <button type="button" className="group flex h-16 w-full items-center gap-3.5 rounded-[18px] bg-white ps-3 pe-4 text-start text-night transition-[background-color,scale] hover:bg-[#eef0f3] active:scale-[0.99] disabled:opacity-60" {...button}>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-chip">
        <L className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[1rem] font-semibold leading-tight">{title}</span>
        <span className="mt-1 block text-[0.8125rem] leading-tight text-ink-soft">{sub}</span>
      </span>
      <svg viewBox="0 0 24 24" aria-hidden className="size-5 shrink-0 text-ink-soft transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 6 9 12l6 6" />
      </svg>
    </button>
  );
}

/** رد السيرفر بكلامنا. المنصة ترجّع نفس الرموز في customAuth.ts */
function explain(status: number, error?: string) {
  if (status === 401) return "الإيميل أو كلمة المرور غلط، جرّب مرة ثانية";
  if (status === 409) return error?.includes("الواتساب") ? "رقم الواتساب هذا مسجّل لحساب ثاني" : "هالإيميل مسجّل عندنا، سجّل دخولك بداله";
  if (status === 429) return "محاولات كثيرة، استنّى شوي وجرّب";
  if (status >= 500) return "عندنا مشكلة صغيرة، جرّب بعد شوي";
  return error ?? "صار شي غلط، جرّب مرة ثانية";
}
