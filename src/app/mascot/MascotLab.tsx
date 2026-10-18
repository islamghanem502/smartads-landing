"use client";

import { useRef, useState } from "react";
import { Mascot, type MascotHandle } from "@/mascot/Mascot";
import { EMOTE_NAMES, STATE_NAMES, type MascotStateName } from "@/mascot/look";

const STATE_AR: Record<MascotStateName, string> = {
  idle: "عادي",
  watching: "بيتفرج",
  thinking: "بيفكر",
  happy: "مبسوط",
  sleeping: "نايم",
  error: "خطأ",
  dance: "بيرقص",
};

const EMOTE_AR: Record<string, string> = {
  hop: "نطة",
  love: "حب",
  proud: "فخور",
  surprised: "متفاجئ",
  yawn: "تثاؤب",
  wink: "غمزة",
  annoyed: "متضايق",
  dizzy: "دايخ",
  wave: "يسلّم",
  celebrate: "يحتفل",
  shake: "يهز",
};

const SIZES = [180, 280, 400];

/** لوحة مراجعة الشخصية: كل حالة وكل تعبير بزرار. */
export function MascotLab() {
  const ref = useRef<MascotHandle>(null);
  const [state, setState] = useState<MascotStateName>("idle");
  const [size, setSize] = useState(400);
  const [sound, setSound] = useState(true);

  return (
    <main className="mx-auto grid min-h-screen max-w-[1100px] items-center gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[1fr_380px]">
      <div className="flex min-h-[440px] items-center justify-center">
        <Mascot ref={ref} size={size} sound={sound} />
      </div>

      <div className="space-y-7">
        <div>
          <h1 className="font-display text-2xl font-bold">الشخصية</h1>
          <p className="mt-1 text-ink-soft">حرّك الماوس عشان تتبعه. اضغط عليها مرة، أو 3 مرات ورا بعض.</p>
        </div>

        <section>
          <h2 className="mb-2.5 font-display text-[0.95rem] font-semibold">الحالة</h2>
          <div className="flex flex-wrap gap-2">
            {STATE_NAMES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setState(s);
                  ref.current?.setState(s);
                }}
                className={`btn btn-sm ${state === s ? "btn-primary" : "btn-quiet"}`}
              >
                {STATE_AR[s]}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2.5 font-display text-[0.95rem] font-semibold">تعبير</h2>
          <div className="flex flex-wrap gap-2">
            {EMOTE_NAMES.map((e) => (
              <button key={e} type="button" onClick={() => ref.current?.triggerEmote(e, { sound: true })} className="btn btn-quiet btn-sm">
                {EMOTE_AR[e]}
              </button>
            ))}
            <button type="button" onClick={() => ref.current?.greet()} className="btn btn-quiet btn-sm">
              ترحيب
            </button>
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-6">
          <div>
            <h2 className="mb-2.5 font-display text-[0.95rem] font-semibold">المقاس</h2>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)} className={`btn btn-sm ${size === s ? "btn-primary" : "btn-quiet"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <label className="mt-7 flex cursor-pointer items-center gap-2 text-[1rem]">
            <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} className="size-4 accent-[#f2a20c]" />
            الصوت
          </label>
        </section>
      </div>
    </main>
  );
}
