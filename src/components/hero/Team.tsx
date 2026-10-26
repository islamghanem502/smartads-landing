import { useEffect, useRef } from "react";
import { gsap, reduced } from "../../lib/gsap";
import { Google, Instagram, Meta, Snapchat, TikTok, type Logo } from "../logos";

/*
 * «فريقك التسويقي، شغّال الحين»: أربعة من الفريق، كلهم الشخصية نفسها (يعني كلهم ذكاء اصطناعي).
 * كل كم ثانية واحد منهم ينوّر ويتكتب جنبه وش يسوي الحين، ومرات يطلع له «+ طلب جديد».
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
          tl.fromTo(row.querySelector("[data-sale]"), { opacity: 0, scale: 0.6, y: 4 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(2.4)" }, "+=0.25")
            .to(row.querySelector("[data-sale]"), { opacity: 0, duration: 0.3 }, "+=1.4");
        }
      }
      loop.restart(true);
    };
    const loop = gsap.delayedCall(2.2, next);
    return () => {
      loop.kill();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={box} data-a="team" data-reveal className="w-full max-w-[24rem] rounded-[26px] bg-night-2 p-3 ring-1 ring-line sm:w-[clamp(15.5rem,28vw,21rem)] sm:p-3.5">
      <div className="flex items-center justify-between gap-3 px-2 pb-3 pt-1.5">
        <p className="whitespace-nowrap text-[1rem] font-bold">فريقك التسويقي</p>
        <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#22c55e]/12 px-2.5 py-1 text-[0.75rem] font-semibold text-[#86efac]">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e]" />
            <span className="relative size-1.5 rounded-full bg-[#22c55e]" />
          </span>
          شغّال الحين
        </span>
      </div>

      <ul className="grid gap-1">
        {TEAM.map(({ role, img, tasks }) => (
          <li
            key={role}
            data-row
            className="relative flex items-center gap-3 rounded-[18px] p-2 transition-colors duration-500 data-on:bg-white/[0.06]"
          >
            <span className="relative shrink-0">
              <img src={img} alt="" width={48} height={48} className="size-11 rounded-[14px] bg-night-3 object-cover sm:size-12" />
              <span className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-[#22c55e] ring-2 ring-night-2" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] font-semibold">{role}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[0.8125rem] text-mist">
                {tasks.map(({ L }, k) => (
                  <span key={k} data-icon={k} hidden={k !== 0} className="grid size-4 shrink-0 place-items-center rounded-[5px] bg-white">
                    <L className="size-3 rounded-[3px]" />
                  </span>
                ))}
                <span data-text className="truncate">{tasks[0].text}</span>
              </span>
            </span>
            {tasks.some((t) => t.sale) && (
              <span data-sale aria-hidden className="absolute left-2 top-2 rounded-full bg-[#22c55e] px-2 py-0.5 text-[0.6875rem] font-bold text-night opacity-0">
                + طلب جديد
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
