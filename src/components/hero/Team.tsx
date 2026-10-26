import { useEffect, useRef } from "react";
import { gsap, reduced } from "../../lib/gsap";
import { Google, Instagram, Meta, Snapchat, TikTok, type Logo } from "../logos";

/*
 * «فريقك التسويقي، شغّال الحين»: أربعة من الفريق، كلهم الشخصية نفسها (يعني كلهم ذكاء اصطناعي).
 * كل كم ثانية واحد منهم ينوّر (والباقي يخفت، مثل خطوات «كيف نشتغل») ويتكتب جنبه وش يسوي الحين، ومرات «+1 طلب».
 * الصفحة المولّدة فيها أول مهمة لكل واحد، والحركة تبدأ بعدها (المهمة الثانية فيها طلب، فيبان من أول لفة). الصور من art/unused/services-standing (مقصوصة).
 */
type Task = { L: Logo; text: string; sale?: boolean };
const TEAM: { role: string; img: string; tasks: Task[] }[] = [
  {
    role: "مدير الحملات",
    img: "/team/ads.webp",
    tasks: [
      { L: TikTok, text: "يختبر 3 إعلانات جديدة" },
      { L: Snapchat, text: "يرفع ميزانية الإعلان الرابح", sale: true },
      { L: Meta, text: "يوقف إعلان ما جاب نتيجة" },
    ],
  },
  {
    role: "المصمم",
    img: "/team/design.webp",
    tasks: [
      { L: Instagram, text: "يجهّز فيديو لمنتجك الجديد" },
      { L: Snapchat, text: "يصمّم ستوري لعرض اليوم" },
    ],
  },
  {
    role: "الناشر",
    img: "/team/publishing.webp",
    tasks: [
      { L: TikTok, text: "جدول منشورات الأسبوع" },
      { L: Instagram, text: "نزّل ريل في انستقرام", sale: true },
    ],
  },
  {
    role: "مختص السيو",
    img: "/team/seo.webp",
    tasks: [
      { L: Google, text: "متجرك صار ثالث في قوقل" },
      { L: Google, text: "يكتب مقال لمدونتك" },
    ],
  },
];

export function Team() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced()) return;
    const el = box.current!;
    const rows = [...el.querySelectorAll<HTMLElement>("[data-row]")];
    el.setAttribute("data-live", "");
    const at = TEAM.map(() => 0); // وين وصل كل واحد في مهماته
    let r = -1, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const next = () => {
      if (visible && !document.hidden) {
        r = (r + 1) % TEAM.length;
        at[r] = (at[r] + 1) % TEAM[r].tasks.length;
        const row = rows[r], task = TEAM[r].tasks[at[r]];
        const typed = row.querySelector<HTMLElement>("[data-text]")!;
        const n = { i: 0 };
        rows.forEach((x) => x.removeAttribute("data-on"));
        row.setAttribute("data-on", "");
        row.querySelectorAll<HTMLElement>("[data-icon]").forEach((ic) => (ic.hidden = Number(ic.dataset.icon) !== at[r]));
        const tl = gsap.timeline()
          .fromTo(n, { i: 0 }, { i: task.text.length, duration: task.text.length * 0.035, ease: "none", onUpdate: () => { typed.textContent = task.text.slice(0, Math.round(n.i)); } });
        if (task.sale) {
          tl.fromTo(row.querySelector("[data-sale]"), { opacity: 0, x: 6 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, "+=0.2")
            .to(row.querySelector("[data-sale]"), { opacity: 0, duration: 0.3 }, "+=1.2");
        }
      }
      loop.restart(true);
    };
    const loop = gsap.delayedCall(2.2, next);
    return () => {
      loop.kill();
      io.disconnect();
      el.removeAttribute("data-live");
    };
  }, []);

  return (
    <div ref={box} data-a="team" data-reveal className="team w-full max-w-[24rem] rounded-[28px] bg-white/[0.03] px-5 py-5 ring-1 ring-white/[0.07] sm:w-[clamp(15.5rem,28vw,21rem)]">
      <p className="text-[0.8125rem] font-medium text-fog">فريقك التسويقي</p>
      <ul className="mt-4 grid gap-4">
        {TEAM.map(({ role, img, tasks }) => (
          <li key={role} data-row className="relative flex items-center gap-3.5 transition-opacity duration-500">
            {/* خط التدرّج جنب اللي شغّال الحين */}
            <span aria-hidden data-bar className="absolute -right-3 top-1/2 h-9 w-[3px] -translate-y-1/2 rounded-full bg-(image:--gradient)" />
            <img src={img} alt="" width={48} height={48} className="size-11 shrink-0 rounded-[15px] bg-night-3 object-cover sm:size-12" />
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] font-semibold">{role}</span>
              <span className="mt-1 flex items-center gap-1.5 text-[0.8125rem] text-mist">
                {tasks.map(({ L }, k) => (
                  <span key={k} data-icon={k} hidden={k !== 0} className="grid size-4 shrink-0 place-items-center rounded-[5px] bg-white">
                    <L className="size-3 rounded-[3px]" />
                  </span>
                ))}
                <span data-text className="truncate">{tasks[0].text}</span>
                {tasks.some((t) => t.sale) && (
                  <span data-sale aria-hidden className="shrink-0 font-semibold text-[#4ade80] opacity-0"><bdi dir="ltr">+1</bdi> طلب</span>
                )}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
