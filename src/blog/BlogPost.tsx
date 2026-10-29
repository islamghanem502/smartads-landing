import { useEffect, useRef, useState } from "react";
import { Footer } from "../components/footer/Footer";
import { Container } from "../components/layout";
import { Nav } from "../components/Nav";
import { Category, Cta, Meta, PostCard } from "./parts";
import { ARTICLE, POSTS } from "./sample";

/*
 * صفحة المقال: المسار، العنوان والملخص، الكاتب والتاريخ، الغلاف، وبعدها المقال وجنبه (في اللابتوب)
 * «في هذا المقال» ثابت وإنت تنزل، والعنوان اللي تقراه الحين ينوّر فيه. في الجوال القائمة تنفتح وتنقفل فوق المقال.
 * في نص المقال (قبل العنوان الثالث) دعوة صغيرة، وفي آخره الأسئلة والدعوة الكبيرة والمشاركة والمقالات القريبة.
 * المقال نفسه HTML من قاعدة البيانات، وتنسيقه كله في .article (index.css).
 * فوق الصفحة خط رفيع يتعبّى مع القراءة.
 */
const SPLIT = (() => {
  const at = [...ARTICLE.html.matchAll(/<h2\b/g)][2]?.index ?? ARTICLE.html.length;
  return [ARTICLE.html.slice(0, at), ARTICLE.html.slice(at)];
})();
const POST = POSTS.find((p) => p.title === ARTICLE.title) ?? POSTS[0];
const RELATED = POSTS.filter((p) => p !== POST).slice(0, 3);

export function BlogPost() {
  const body = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [now, setNow] = useState(ARTICLE.toc[0]?.id);

  // خط القراءة فوق، والعنوان اللي وصلت له في «في هذا المقال»
  useEffect(() => {
    const el = body.current!;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      bar.current!.style.transform = `scaleX(${p})`;
    };
    addEventListener("scroll", tick, { passive: true });
    tick();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setNow(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" },
    );
    el.querySelectorAll("h2[id]").forEach((h) => io.observe(h));
    return () => {
      removeEventListener("scroll", tick);
      io.disconnect();
    };
  }, []);

  const toc = (
    <ol className="grid gap-1 text-[0.9375rem]">
      {ARTICLE.toc.map((t) => (
        <li key={t.id}>
          <a
            href={`#${t.id}`}
            aria-current={now === t.id ? "location" : undefined}
            className={`block rounded-[10px] border-s-2 px-3 py-1.5 leading-[1.6] transition-colors ${now === t.id ? "border-[#7c5cff] bg-[#7c5cff]/[0.07] font-semibold text-night" : "border-transparent text-ink-soft hover:text-night"}`}
          >
            {t.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <span aria-hidden ref={bar} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-right scale-x-0 bg-(image:--gradient)" />
      <Nav />
      <main className="bg-cloud pt-(--nav-h) text-night [--ink-base:var(--color-night)]">
        <Container className="pb-(--section-y)">
          <nav aria-label="مسار الصفحة" className="pt-8 text-[0.875rem] text-ink-soft">
            <ol className="flex flex-wrap items-center gap-2">
              <li><a href="/" className="hover:text-night">الرئيسية</a></li>
              <li aria-hidden>/</li>
              <li><a href="/blog/" className="hover:text-night">المدونة</a></li>
              <li aria-hidden>/</li>
              <li><a href="/blog/" className="hover:text-night">{ARTICLE.category}</a></li>
            </ol>
          </nav>

          <header className="mt-6 max-w-[52rem]">
            <div className="flex flex-wrap items-center gap-2">
              <Category name={ARTICLE.category} className="bg-white ring-1 ring-black/5" />
              {ARTICLE.tags.map((t) => (
                <span key={t} className="text-[0.8125rem] text-ink-soft">#{t}</span>
              ))}
            </div>
            <h1 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.3]">{ARTICLE.title}</h1>
            <p className="mt-5 text-[1.125rem] leading-[1.8] text-ink-soft sm:text-[1.1875rem]">{ARTICLE.excerpt}</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-night">
                <img src="/mascot-head.png" alt="" width={40} height={40} className="mt-1.5 size-9 object-contain" />
              </span>
              <span>
                <span className="block text-[0.9375rem] font-semibold">{ARTICLE.author}</span>
                <Meta date={POST.date} minutes={POST.minutes} className="mt-0.5" />
              </span>
            </div>
          </header>

          {/* عمود المقال بعرض القراءة (44rem) وكل شي فيه بنفس العرض، و«في هذا المقال» على الطرف الثاني */}
          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,44rem)_17rem] lg:justify-between">
            <div className="min-w-0">
              <figure className="mb-10 overflow-hidden rounded-[24px] bg-[#e9eaee] ring-1 ring-black/5">
                <img src={ARTICLE.cover} alt={ARTICLE.title} width={1600} height={900} fetchPriority="high" className="aspect-video w-full object-cover" />
              </figure>

              {/* الجوال: «في هذا المقال» تنفتح وتنقفل */}
              <details className="group mb-8 rounded-[20px] bg-white ring-1 ring-black/5 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-semibold [&::-webkit-details-marker]:hidden">
                  في هذا المقال
                  <svg viewBox="0 0 24 24" aria-hidden className="size-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <div className="px-2 pb-4">{toc}</div>
              </details>

              <div ref={body}>
                <div className="article" dangerouslySetInnerHTML={{ __html: SPLIT[0] }} />
                <Cta inline />
                <div className="article" dangerouslySetInnerHTML={{ __html: SPLIT[1] }} />
              </div>

              {/* الأسئلة: نفس شكل أسئلة الصفحة الرئيسية */}
              <section aria-labelledby="faq" className="mt-14">
                <h2 id="faq" className="text-[1.75rem] font-bold">أسئلة تهمك</h2>
                <div className="mt-5 grid gap-3">
                  {ARTICLE.faq.map(({ q, a }) => (
                    <details key={q} className="faq group rounded-[22px] bg-white ring-1 ring-black/5 transition-shadow open:shadow-[0_18px_40px_-24px_rgb(17_19_24/0.3)]">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-5 text-[1.0625rem] font-semibold sm:p-6 [&::-webkit-details-marker]:hidden">
                        {q}
                        <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-cloud transition-[rotate,background-color] duration-300 ease-lift group-open:rotate-45 group-open:bg-night group-open:text-white">
                          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M8 3v10M3 8h10" />
                          </svg>
                        </span>
                      </summary>
                      <p className="-mt-1 px-5 pb-6 text-[1rem] leading-[1.9] text-ink-soft sm:px-6">{a}</p>
                    </details>
                  ))}
                </div>
              </section>

              <div className="mt-14">
                <Cta />
              </div>

              <Share />
            </div>

            {/* اللابتوب: «في هذا المقال» ثابتة جنب المقال وإنت تنزل */}
            <aside className="hidden lg:block">
              <div className="sticky top-[calc(var(--nav-h)+1.5rem)] rounded-[24px] bg-white p-4 ring-1 ring-black/5">
                <p className="px-3 pb-2 pt-1 text-[0.9375rem] font-bold">في هذا المقال</p>
                {toc}
              </div>
            </aside>
          </div>

          <section aria-labelledby="related" className="mt-20">
            <h2 id="related" className="text-[clamp(1.5rem,2.6vw,2rem)] font-bold">مقالات ممكن تفيدك</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {RELATED.map((p) => (
                <li key={p.title} className="grid">
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}

/** شارك المقال: إكس وواتساب ولينكدإن ونسخ الرابط */
function Share() {
  const [done, setDone] = useState(false);
  const pill = "inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[0.875rem] font-semibold ring-1 ring-black/5 transition-colors hover:bg-[#eceef2]";
  const url = "https://ilanakdhaki.com/blog/";
  const text = encodeURIComponent(ARTICLE.title);
  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-black/[0.07] pt-6">
      <span className="me-1 text-[0.9375rem] text-ink-soft">شارك المقال:</span>
      <a className={pill} href={`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">واتساب</a>
      <a className={pill} href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`} target="_blank" rel="noopener noreferrer">إكس</a>
      <a className={pill} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">لينكدإن</a>
      <button
        type="button"
        className={pill}
        onClick={() => {
          navigator.clipboard?.writeText(location.href).catch(() => {});
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        }}
      >
        {done ? "تم النسخ" : "نسخ الرابط"}
      </button>
    </div>
  );
}
