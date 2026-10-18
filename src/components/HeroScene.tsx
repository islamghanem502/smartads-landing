"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import type { IconType } from "react-icons";
import { SiFacebook, SiGoogle, SiInstagram, SiMeta, SiSnapchat, SiTiktok } from "react-icons/si";
import { Mascot, type MascotHandle } from "@/mascot/Mascot";

// المشهد مرسوم على 600×500، وبيتصغّر/يتكبّر كله مع العمود.
const W = 600;
const H = 500;

// اللابتوب: صندوق الغطا (المفصّلة تحته)، وعمق القاعدة = طول الغطا عشان يقفل عليها بالظبط
const LT = { x: 190, y: 128, w: 310, h: 200, depth: 200, thick: 10, tilt: -24 };
const DOME = { x: LT.x + LT.w / 2, y: 168 };

type NodeId = "meta" | "facebook" | "instagram" | "google" | "tiktok" | "snapchat" | "salla" | "zid";
type Node = { id: NodeId; Icon?: IconType; text?: string; color: string; bg?: string; r: number; deg: number };

// قبة المنصات فوق الشاشة. بس المنصات اللي شغالين معاها فعلاً.
const NODES: Node[] = [
  { id: "instagram", Icon: SiInstagram, color: "#FF7EB3", r: 176, deg: -160 },
  { id: "meta", Icon: SiMeta, color: "#5B9BFF", r: 182, deg: -125 },
  { id: "google", Icon: SiGoogle, color: "#8AB4F8", r: 186, deg: -90 },
  { id: "tiktok", Icon: SiTiktok, color: "#F4F6FA", r: 182, deg: -55 },
  { id: "snapchat", Icon: SiSnapchat, color: "#14161C", bg: "#FFFC00", r: 176, deg: -20 },
  { id: "facebook", Icon: SiFacebook, color: "#5B9BFF", r: 108, deg: -144 },
  { id: "salla", text: "سلة", color: "#7DF0D8", bg: "#0F3A3D", r: 104, deg: -90 },
  { id: "zid", text: "زد", color: "#CDB0FF", bg: "#2B1B47", r: 108, deg: -36 },
];

// أرقام صحيحة: الكسور الطويلة بتختلف بين السيرفر والمتصفح (hydration)
const pos = (n: Node) => {
  const a = (n.deg * Math.PI) / 180;
  return { x: Math.round(DOME.x + Math.cos(a) * n.r), y: Math.round(DOME.y + Math.sin(a) * n.r) };
};
// العمق: اللي على أطراف القبة أصغر وأبهت
const depth = (n: Node) => +(0.76 + 0.24 * Math.sin((-n.deg * Math.PI) / 180) * (n.r > 150 ? 1 : 0.92)).toFixed(3);

const DOTS = Array.from({ length: 24 }, (_, i) => {
  const a = (-174 + (i * 168) / 23) * (Math.PI / 180);
  const r = (i % 3 === 0 ? 226 : i % 3 === 1 ? 140 : 208) + ((i * 37) % 13);
  return { x: Math.round(DOME.x + Math.cos(a) * r), y: Math.round(DOME.y + Math.sin(a) * r), s: 2 + (i % 3) };
});

const ADS: NodeId[] = ["meta", "google", "tiktok", "snapchat"];

type Action = { button: string; done: string; to?: NodeId[]; from?: NodeId[]; emote: "celebrate" | "proud" | "love" };
// كل دورة: الماوس يدوس زرار واحد، وحاجة واحدة تحصل، ورسالة واحدة تتقري
const ACTIONS: Action[] = [
  { button: "أنشئ حملة", done: "حملتك نزلت على ٤ منصات", to: ADS, emote: "celebrate" },
  { button: "انشر منشور", done: "منشورك نزل", to: ["instagram", "facebook"], emote: "love" },
  { button: "اربط متجرك", done: "متجرك مربوط", from: ["salla", "zid"], emote: "proud" },
];

// كيبورد: صفوف مفاتيح (عدد المفاتيح في كل صف)
const KEY_ROWS = [13, 13, 12, 11, 9];

export function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const lid = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const power = useRef<HTMLDivElement>(null);
  const deckGlow = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLDivElement>(null);
  const buttonLabel = useRef<HTMLSpanElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const messageText = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const lines = useRef<SVGGElement>(null);
  const nodes = useRef<Partial<Record<NodeId, HTMLDivElement | null>>>({});
  const dots = useRef<HTMLDivElement>(null);
  const mascot = useRef<MascotHandle>(null);
  const [scale, setScale] = useState(1);

  // المشهد بياخد عرض العمود — قبل أول رسم، عشان ما يتنططش على الموبايل
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1.15, el.clientWidth / W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    let emerged = false;
    let n = 0;
    let alive = true;
    const pending: (gsap.core.Tween | gsap.core.Timeline)[] = [];
    const later = (d: number, fn: () => void) => pending.push(gsap.delayedCall(d, () => alive && fn()));
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);

    const nodeEl = (id: NodeId) => nodes.current[id] ?? null;
    const node = (id: NodeId) => NODES.find((x) => x.id === id)!;

    /** مكان عنصر جوه المشهد (بعد الـ 3D والتكبير)، بإحداثيات الـ 600×500. */
    const inStage = (el: Element | null) => {
      const s = stage.current?.getBoundingClientRect();
      const r = el?.getBoundingClientRect();
      if (!s || !r) return { x: DOME.x, y: DOME.y + 80 };
      const k = s.width / W;
      return { x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k };
    };

    /** حلقة بتتنفخ حوالين المنصة، والمنصة تنط نطة مرنة. */
    const arrive = (id: NodeId) => {
      const el = nodeEl(id);
      if (!el) return;
      const s = Number(el.dataset.s);
      const ring = document.createElement("span");
      ring.className = "pointer-events-none absolute inset-[-4px] rounded-full border-2 border-[#F2A20C]";
      el.appendChild(ring);
      gsap.fromTo(ring, { scale: 1, opacity: 0.9 }, { scale: reduced ? 1 : 1.75, opacity: 0, duration: 0.9, ease: "power2.out", onComplete: () => ring.remove() });
      if (!reduced) gsap.fromTo(el, { scale: s * 1.2 }, { scale: s, duration: 0.7, ease: "elastic.out(1, 0.55)" });
    };

    /** كرة نور بتسافر على منحنى، ووراها ذيل بيترسم وبعدين يتسحب من أوله. */
    const orb = (from: { x: number; y: number }, to: { x: number; y: number }, delay: number, onArrive: () => void) => {
      const g = lines.current;
      if (!g) return;
      const ns = "http://www.w3.org/2000/svg";
      const lift = Math.max(40, Math.abs(to.x - from.x) * 0.35);
      const mx = (from.x + to.x) / 2 + (to.x - from.x) * 0.1;
      const my = Math.min(from.y, to.y) - lift;
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "url(#trail)");
      path.setAttribute("stroke-width", "2.4");
      path.setAttribute("stroke-linecap", "round");
      const ball = document.createElementNS(ns, "g");
      ball.innerHTML = `<circle r="11" fill="url(#orbGlow)"/><circle r="3.2" fill="#FFF8E6"/>`;
      g.append(path, ball);
      const len = path.getTotalLength();
      const dur = reduced ? 0.01 : 1.05;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(ball, { opacity: 0 });
      const tl = gsap.timeline({ delay, onComplete: () => (path.remove(), ball.remove()) });
      tl.to(ball, { opacity: 1, duration: 0.15 }, 0)
        .to(ball, { duration: dur, ease: "power2.inOut", motionPath: { path, align: path, alignOrigin: [0.5, 0.5] } }, 0)
        .to(path, { strokeDashoffset: 0, duration: dur, ease: "power2.inOut" }, 0)
        .call(onArrive, [], dur)
        .to(ball, { opacity: 0, scale: 1.8, transformOrigin: "50% 50%", duration: 0.35, ease: "power2.out" }, dur)
        .to(path, { strokeDashoffset: -len, duration: 0.55, ease: "power2.in" }, dur - 0.05);
      pending.push(tl);
    };

    /** أول مرة: المنصات بتطلع من الشاشة وتتصف في القبة على منحنيات. */
    const emerge = () => {
      const src = inStage(screen.current);
      const els = NODES.map((x) => nodeEl(x.id)).filter(Boolean) as HTMLDivElement[];
      els.sort((a, b) => Math.abs(Number(a.dataset.deg) + 90) - Math.abs(Number(b.dataset.deg) + 90));
      els.forEach((el, i) => {
        const p = pos(node(el.dataset.id as NodeId));
        const sx = src.x - p.x;
        const sy = src.y - p.y;
        const s = Number(el.dataset.s);
        gsap.set(el, { x: sx, y: sy, scale: 0.2, opacity: 0, rotation: sx > 0 ? -18 : 18 });
        const tl = gsap.timeline({ delay: i * 0.065 });
        tl.to(el, { opacity: 0.55 + 0.45 * s, duration: 0.3, ease: "power1.out" }, 0).to(
          el,
          {
            scale: s,
            rotation: 0,
            duration: reduced ? 0.01 : 1.35,
            ease: "power3.out",
            motionPath: { path: [{ x: sx, y: sy }, { x: sx * 0.45, y: sy * 0.2 - 46 }, { x: 0, y: 0 }], curviness: 1.25 },
          },
          0,
        );
        pending.push(tl);
      });
      gsap.to(dots.current, { opacity: 1, duration: 1.2, delay: 0.4 });
    };

    const cycle = () => {
      if (!alive) return;
      if (!visible) return later(1, cycle);
      const a = ACTIONS[n++ % ACTIONS.length];
      if (buttonLabel.current) buttonLabel.current.textContent = a.button;
      if (messageText.current) messageText.current.textContent = a.done;
      const tl = gsap.timeline();
      pending.push(tl);

      // الماوس يدخل من تحت شمال الشاشة ويروح للزرار على منحنى
      tl.set(cursor.current, { x: 30, y: 150, scale: 1, opacity: 0 });
      tl.to(cursor.current, { opacity: 1, duration: 0.25 }, 0.1);
      tl.call(() => mascot.current?.lookAtElement(button.current, 1.8), [], 0.1);
      tl.to(
        cursor.current,
        { duration: reduced ? 0.01 : 0.95, ease: "power3.inOut", motionPath: { path: [{ x: 30, y: 150 }, { x: 90, y: 125 }, { x: 150, y: 96 }], curviness: 1.4 } },
        0.2,
      );
      tl.to(button.current, { scale: 1.05, duration: 0.18, ease: "power2.out" }, 1.08);
      // الضغطة: الماوس يصغر، والزرار ينزل على حافته
      tl.to(cursor.current, { scale: 0.82, duration: 0.08, ease: "power2.out" }, 1.28);
      tl.to(button.current, { y: 3, boxShadow: "0 0px 0 #C27F00", duration: 0.08, ease: "power2.out" }, 1.28);
      tl.to(cursor.current, { scale: 1, duration: 0.2, ease: "back.out(2)" }, 1.36);
      tl.to(button.current, { y: 0, boxShadow: "0 3px 0 #C27F00", duration: 0.22, ease: "back.out(2)" }, 1.36);

      const launch = 1.45 + (emerged ? 0 : 1.15);
      tl.call(
        () => {
          if (!emerged) {
            emerged = true;
            emerge();
          }
        },
        [],
        1.42,
      );

      // الزرار يختفي والرسالة الواحدة تظهر
      tl.to(cursor.current, { opacity: 0, duration: 0.3 }, 1.6);
      tl.to(button.current, { scale: 0.85, opacity: 0, duration: 0.28, ease: "power2.in" }, 1.55);
      tl.fromTo(message.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, 1.95);

      // اللي بيطلع من الشاشة (أو بيدخلها من المتجر)
      tl.call(
        () => {
          const scr = inStage(screen.current);
          const src = { x: scr.x, y: scr.y - 50 };
          const targets = a.to ?? a.from ?? [];
          let first = true;
          targets.forEach((id, i) => {
            const p = pos(node(id));
            const done = () => {
              arrive(id);
              if (first) {
                first = false;
                mascot.current?.triggerEmote(a.emote);
              }
            };
            if (a.to) orb(src, p, i * 0.09, done);
            else orb(p, src, i * 0.12, () => (arrive(id), first && ((first = false), mascot.current?.triggerEmote(a.emote))));
          });
          mascot.current?.lookAtElement(nodeEl(targets[0]), 1.6);
        },
        [],
        launch,
      );

      // ترجع للزرار اللي بعده
      const end = launch + 3.1;
      tl.to(message.current, { y: -8, opacity: 0, duration: 0.35, ease: "power2.in" }, end);
      tl.fromTo(button.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, end + 0.3);
      tl.call(() => later(0.4, cycle), [], end + 0.75);
    };

    // ── لحظة الدخول: الشخصية تسلّم، الغطا يتفتح، الشاشة تنوّر ──
    const ctx = gsap.context(() => {
      NODES.forEach((x) => {
        const el = nodeEl(x.id);
        if (el) el.dataset.s = String(depth(x));
      });
      gsap.set(lid.current, { rotationX: -90, y: -2, transformOrigin: "50% 100%" });
      const tl = gsap.timeline({ delay: reduced ? 0 : 1.7 });
      tl.call(() => mascot.current?.setState("watching"));
      tl.call(() => mascot.current?.lookAtElement(lid.current));
      if (reduced) tl.set(lid.current, { rotationX: 13 });
      else tl.to(lid.current, { rotationX: 16, duration: 1.25, ease: "power3.inOut" }).to(lid.current, { rotationX: 13, duration: 0.45, ease: "sine.out" });
      tl.call(() => mascot.current?.triggerEmote("surprised"), [], reduced ? 0 : 0.85);
      // الشاشة تشتغل: ومضة خفيفة، والمحتوى يظهر، والنور ينزل على الكيبورد
      tl.fromTo(power.current, { opacity: 0.3 }, { opacity: 0, duration: 0.8, ease: "power2.out" }, reduced ? 0 : 1.1);
      tl.to(screen.current, { opacity: 1, duration: 0.5, ease: "power2.out" }, "<");
      tl.to(deckGlow.current, { opacity: 1, duration: 0.8, ease: "power2.out" }, "<");
      tl.call(() => mascot.current?.lookAtElement(screen.current), [], "+=0.1");
      tl.call(cycle, [], "+=0.4");
    }, stage);

    return () => {
      alive = false;
      pending.forEach((p) => p.kill());
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
      role="img"
      aria-label="لابتوب بيتفتح، والماوس يدوس «أنشئ حملة»، والحملة تطلع منه لكل المنصات، والشخصية عايمة جنبه بتتفرج"
    >
      <div ref={stage} className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }} aria-hidden>
        {/* أرضية: نور دافي تحت اللابتوب */}
        <div
          className="absolute rounded-[50%]"
          style={{ left: LT.x - 120, top: LT.y + LT.h + 30, width: LT.w + 240, height: 150, background: "radial-gradient(closest-side, rgba(242,162,12,0.12), rgba(242,162,12,0))" }}
        />

        <div ref={dots} className="absolute inset-0" style={{ opacity: 0 }}>
          {DOTS.map((d, i) => (
            <span key={i} className="absolute rounded-full bg-white/20" style={{ left: d.x - d.s / 2, top: d.y - d.s / 2, width: d.s, height: d.s }} />
          ))}
        </div>

        {/* اللابتوب: كله 3D — قاعدة بكيبورد وتراك باد، وغطا بيلف على المفصّلة ويقفل على القاعدة بالظبط */}
        <div className="absolute" style={{ left: LT.x, top: LT.y, width: LT.w, height: LT.h, perspective: 1300, perspectiveOrigin: "50% 20%" }}>
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: `rotateX(${LT.tilt}deg)`, transformOrigin: "50% 100%" }}>
            {/* سطح القاعدة */}
            <div
              className="absolute left-0 overflow-hidden rounded-[6px_6px_14px_14px]"
              style={{
                top: "100%",
                width: LT.w,
                height: LT.depth,
                transformOrigin: "50% 0",
                transform: "rotateX(90deg)",
                background: "linear-gradient(180deg, #CDD2DA 0%, #BAC0CA 55%, #AAB0BB 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <div className="absolute inset-x-[18px] top-[18px] flex flex-col gap-[4px] rounded-[6px] bg-[#9EA5B1] p-[5px]">
                {KEY_ROWS.map((count, r) => (
                  <div key={r} className="flex gap-[4px]">
                    {Array.from({ length: count }, (_, k) => (
                      <span
                        key={k}
                        className="h-[14px] rounded-[3px] bg-[#23272F]"
                        style={{ flex: r === 4 && k === 4 ? 5 : 1, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="absolute bottom-[16px] left-1/2 h-[58px] w-[118px] -translate-x-1/2 rounded-[8px] bg-[#C3C8D0]" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)" }} />
              {/* نور الشاشة على الكيبورد */}
              <div ref={deckGlow} className="absolute inset-0" style={{ opacity: 0, background: "radial-gradient(70% 55% at 50% 0%, rgba(255,176,60,0.3), rgba(255,176,60,0))" }} />
            </div>
            {/* حافة القاعدة الأمامية */}
            <div
              className="absolute left-0 rounded-b-[12px]"
              style={{
                top: "100%",
                width: LT.w,
                height: LT.thick,
                transform: `translateZ(${LT.depth}px)`,
                background: "linear-gradient(180deg, #9EA4AF, #747A86)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <span className="absolute left-1/2 top-0 h-[4px] w-[46px] -translate-x-1/2 rounded-b-[4px] bg-[#6A707B]" />
            </div>

            {/* الغطا */}
            <div ref={lid} className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "translateY(-2px) rotateX(-90deg)", transformOrigin: "50% 100%" }}>
              {/* سُمك الغطا (باين وهو مقفول كحافة قدام) */}
              <div className="absolute inset-x-0 top-0 h-[5px] rounded-t-[10px] bg-[#9AA0AB]" style={{ transformOrigin: "50% 0", transform: "rotateX(-90deg)" }} />
              {/* الضهر */}
              <div
                className="absolute inset-0 grid place-items-center rounded-[14px_14px_5px_5px]"
                style={{
                  transform: "translateZ(-5px) rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  background: "radial-gradient(120% 90% at 70% 10%, #E4E7EC 0%, #C3C8D0 55%, #A8AEB9 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                }}
              >
                <span className="font-display text-[1.6rem] font-bold text-white/60">م</span>
              </div>
              {/* الشاشة */}
              <div className="absolute inset-0 rounded-[14px_14px_5px_5px] bg-[#07090E] p-[8px] pb-[12px]" style={{ backfaceVisibility: "hidden", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
                <div className="relative size-full overflow-hidden rounded-[6px]" style={{ background: "radial-gradient(120% 90% at 50% 0%, #1D2438 0%, #121726 60%, #0E1220 100%)" }}>
                  <div ref={screen} className="absolute inset-0" style={{ opacity: 0 }}>
                    {/* زرار واحد في النص */}
                    <div className="absolute inset-0 grid place-items-center">
                      <div
                        ref={button}
                        className="rounded-[12px] bg-[#F2A20C] px-[22px] py-[10px] font-display text-[15px] font-bold text-[#1B2230]"
                        style={{ boxShadow: "0 3px 0 #C27F00" }}
                      >
                        <span ref={buttonLabel}>أنشئ حملة</span>
                      </div>
                    </div>
                    {/* رسالة واحدة بعد الضغطة */}
                    <div ref={message} className="absolute inset-0 grid place-items-center" style={{ opacity: 0 }}>
                      <div className="flex items-center gap-2" dir="rtl">
                        <span className="grid size-[22px] place-items-center rounded-full bg-[#3DDC97] text-[#0E1220]">
                          <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
                            <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span ref={messageText} className="font-display text-[15px] font-bold text-[#F6F4EE]">
                          حملتك نزلت على ٤ منصات
                        </span>
                      </div>
                    </div>
                    {/* الماوس */}
                    <div ref={cursor} className="absolute left-0 top-0" style={{ opacity: 0 }}>
                      <svg width="20" height="24" viewBox="0 0 20 24" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.45))" }}>
                        <path d="M2 2 L2 19 L6.6 14.8 L9.6 21.6 L12.6 20.3 L9.7 13.6 L16 13.6 Z" fill="#FFFFFF" stroke="#0E1220" strokeWidth="1.4" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  {/* ومضة تشغيل الشاشة */}
                  <div ref={power} className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: 0 }} />
                  {/* انعكاس زجاج خفيف */}
                  <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 38%)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* المسارات وكور النور */}
        <svg className="pointer-events-none absolute inset-0 overflow-visible" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="orbGlow">
              <stop offset="0" stopColor="#FFF3D1" stopOpacity="1" />
              <stop offset="0.35" stopColor="#FFB52A" stopOpacity="0.85" />
              <stop offset="1" stopColor="#F2A20C" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#F2A20C" stopOpacity="0.25" />
              <stop offset="1" stopColor="#FFC45C" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <g ref={lines} />
        </svg>

        {/* المنصات */}
        {NODES.map((nd) => {
          const p = pos(nd);
          return (
            <div
              key={nd.id}
              ref={(el) => {
                nodes.current[nd.id] = el;
              }}
              data-id={nd.id}
              data-deg={nd.deg}
              className="absolute grid size-[46px] place-items-center rounded-full"
              style={{
                left: p.x - 23,
                top: p.y - 23,
                background: nd.bg ?? "linear-gradient(160deg, #1E2433, #131824)",
                color: nd.color,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.07), 0 12px 24px -10px rgba(0,0,0,0.7)",
                opacity: 0, // مخفية لحد ما تطلع من الشاشة (من غير flash قبل الـ JS)
              }}
            >
              {nd.Icon ? <nd.Icon size={20} /> : <span className="font-display text-[0.8rem] font-bold">{nd.text}</span>}
            </div>
          );
        })}

        {/* الشخصية عايمة جنب اللابتوب وبتتفرج */}
        <div className="absolute" style={{ left: -6, top: 214 }}>
          <Mascot ref={mascot} size={210} />
        </div>
      </div>
    </div>
  );
}
