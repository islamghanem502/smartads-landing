import { Footer } from "../components/footer/Footer";
import { Ink } from "../components/Ink";
import { Container } from "../components/layout";
import { Nav } from "../components/Nav";
import { Category, Cta, Meta, POST_URL, PostCard } from "./parts";
import { POSTS } from "./sample";

/*
 * صفحة المقالات (/blog): فوق العنوان والشخصية تقرأ، بعدها التصنيفات، وأحدث مقال كبير،
 * وباقي المقالات كروت، والصفحات، وآخر شي دعوة للتجربة. نفس ترتيب المدونة الحالية، بشكلنا.
 */
export function BlogIndex() {
  const [first, ...rest] = POSTS;
  // التصنيفات وعدد مقالات كل واحد (بترتيب أول ظهور)
  const counts = new Map<string, number>();
  for (const p of POSTS) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);

  return (
    <>
      <Nav />
      <main className="bg-cloud text-night [--ink-base:var(--color-night)]">
        <section className="pt-(--nav-h)">
          <Container className="grid items-center gap-6 pt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 lg:pt-12">
            <div>
              <p className="inline-flex rounded-full bg-white px-3.5 py-1.5 text-[0.875rem] font-semibold text-ink-soft ring-1 ring-black/5">مدونة مسوّقك الذكي</p>
              <h1 className="mt-5 text-[clamp(2.25rem,4.4vw,3.75rem)] font-bold leading-[1.25]">
                <Ink>تسويق يبيع،</Ink> <span className="chip text-white">بلغة التاجر</span>
              </h1>
              <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-[1.85] text-ink-soft sm:text-[1.125rem]">
                أدلة عملية لأصحاب المتاجر: إعلانات تجيب مبيعات، ومحتوى يشد، وأرقام تفهمها وتقرر عليها.
              </p>
            </div>
            <img
              src="/blog/reading.webp"
              alt="شخصية مسوّقك الذكي تقرأ كتاب"
              width={540}
              height={570}
              fetchPriority="high"
              className="mx-auto w-[min(13rem,55vw)] max-lg:order-first lg:me-6 lg:w-[17rem]"
            />
          </Container>
        </section>

        <Container className="pb-(--section-y) pt-8 lg:pt-10">
          {/* التصنيفات: في الجوال تنسحب جنب بعض، وفي اللابتوب تنزل سطرين لو احتاجت */}
          <nav aria-label="التصنيفات" className="-mx-(--gutter) overflow-x-auto px-(--gutter) [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0">
            <ul className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
              <li>
                <a href="/blog/" aria-current="page" className="inline-flex h-10 items-center rounded-full bg-night px-4 text-[0.875rem] font-semibold text-white">كل المقالات</a>
              </li>
              {[...counts].map(([name, n]) => (
                <li key={name}>
                  <a href="/blog/" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[0.875rem] font-semibold text-ink-soft ring-1 ring-black/5 transition-colors hover:text-night">
                    {name}
                    <span className="text-[0.75rem] opacity-60">{n}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* أحدث مقال: كبير، الصورة يسار والكلام يمين (في الجوال الصورة فوق) */}
          <article className="group relative mt-8 grid overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-night px-3 py-1 text-[0.8125rem] font-semibold text-white">أحدث مقال</span>
                <Category name={first.category} />
              </div>
              <h2 className="mt-5 text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.4]">
                <a href={POST_URL} className="after:absolute after:inset-0 after:content-['']">{first.title}</a>
              </h2>
              <p className="mt-3 line-clamp-3 text-[1rem] leading-[1.8] text-ink-soft">{first.excerpt}</p>
              <Meta date={first.date} minutes={first.minutes} className="mt-6" />
            </div>
            <div className="aspect-[16/9] overflow-hidden bg-[#e9eaee] max-lg:order-first lg:aspect-auto">
              <img src={first.cover} alt="" width={1200} height={675} fetchPriority="high" className="size-full object-cover transition-transform duration-700 ease-lift group-hover:scale-[1.03]" />
            </div>
          </article>

          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-6">
            {/* أول صفحة: أحدث مقال وتحته 9 (ثلاث صفوف كاملة)، والباقي في الصفحة الجاية */}
            {rest.slice(0, 9).map((p) => (
              <li key={p.title} className="grid">
                <PostCard post={p} />
              </li>
            ))}
          </ul>

          {/* الصفحات (العيّنة صفحة وحدة، فهذي للشكل بس) */}
          <nav aria-label="الصفحات" className="mt-12 flex items-center justify-center gap-2 text-[0.9375rem] font-semibold">
            <span aria-current="page" className="grid size-11 place-items-center rounded-full bg-night text-white">1</span>
            <a href="/blog/" className="grid size-11 place-items-center rounded-full bg-white ring-1 ring-black/5 hover:bg-[#eceef2]">2</a>
            <a href="/blog/" className="inline-flex h-11 items-center rounded-full bg-white px-5 ring-1 ring-black/5 hover:bg-[#eceef2]">التالي</a>
          </nav>

          <div className="mt-16 lg:mt-20">
            <Cta />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
