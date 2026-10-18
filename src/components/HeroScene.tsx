"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import type { IconType } from "react-icons";
import { SiFacebook, SiGoogle, SiInstagram, SiMeta, SiSnapchat, SiTiktok } from "react-icons/si";

// المشهد مرسوم على 600×500، وبيتصغّر/يتكبّر كله مع العمود.
const W = 600;
const H = 500;

// التابلت (عرضي) وقبة المنصات فوقه
const TAB = { w: 404, h: 280, cx: 300, cy: 344, rx: 11, ry: 13, depth: 7 };
const SCR = { w: TAB.w - 26, h: TAB.h - 26 };
const DOME = { x: 300, y: 192 };

type NodeId = "meta" | "facebook" | "instagram" | "google" | "tiktok" | "snapchat" | "salla" | "zid";
type Node = { id: NodeId; Icon?: IconType; text?: string; color: string; bg?: string; r: number; deg: number };

// قبة المنصات فوق الشاشة. بس المنصات اللي شغالين معاها فعلاً.
const NODES: Node[] = [
  { id: "instagram", Icon: SiInstagram, color: "#FF8FBE", r: 166, deg: -160 },
  { id: "meta", Icon: SiMeta, color: "#6EA6FF", r: 170, deg: -125 },
  { id: "google", Icon: SiGoogle, color: "#9CC0FF", r: 172, deg: -90 },
  { id: "tiktok", Icon: SiTiktok, color: "#F4EEE5", r: 170, deg: -55 },
  { id: "snapchat", Icon: SiSnapchat, color: "#16120E", bg: "#FFFC00", r: 166, deg: -20 },
  { id: "facebook", Icon: SiFacebook, color: "#6EA6FF", r: 100, deg: -146 },
  { id: "salla", text: "سلة", color: "#7DF0D8", bg: "#123A38", r: 96, deg: -90 },
  { id: "zid", text: "زد", color: "#CDB0FF", bg: "#2C1F42", r: 100, deg: -34 },
];

// أرقام صحيحة: الكسور الطويلة بتختلف بين السيرفر والمتصفح (hydration)
const pos = (n: Node) => {
  const a = (n.deg * Math.PI) / 180;
  return { x: Math.round(DOME.x + Math.cos(a) * n.r), y: Math.round(DOME.y + Math.sin(a) * n.r) };
};
// العمق: اللي على أطراف القبة أصغر وأبهت
const depth = (n: Node) => +(0.78 + 0.22 * Math.sin((-n.deg * Math.PI) / 180) * (n.r > 150 ? 1 : 0.94)).toFixed(3);

const DOTS = Array.from({ length: 22 }, (_, i) => {
  const a = (-172 + (i * 164) / 21) * (Math.PI / 180);
  const r = (i % 3 === 0 ? 206 : i % 3 === 1 ? 132 : 192) + ((i * 37) % 11);
  return { x: Math.round(DOME.x + Math.cos(a) * r), y: Math.round(DOME.y + Math.sin(a) * r), s: 2 + (i % 2) };
});

const ADS: NodeId[] = ["meta", "google", "tiktok", "snapchat"];

type Action = { button: string; done: string; to?: NodeId[]; from?: NodeId[] };
// كل دورة: الماوس يدوس زرار واحد، وحاجة واحدة تحصل، ورسالة واحدة تتقري
const ACTIONS: Action[] = [
  { button: "أنشئ حملة", done: "حملتك نزلت على ٤ منصات", to: ADS },
  { button: "انشر منشور", done: "منشورك نزل", to: ["instagram", "facebook"] },
  { button: "اربط متجرك", done: "متجرك مربوط", from: ["salla", "zid"] },
];

// مكان الماوس جوه الشاشة: يبدأ تحت شمال، ويوصل لنص الزرار
const CURSOR_FROM = { x: 46, y: SCR.h - 34 };
const CURSOR_TO = { x: SCR.w / 2 + 6, y: SCR.h / 2 + 4 };

export function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tablet = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const power = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLDivElement>(null);
  const buttonLabel = useRef<HTMLSpanElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const messageText = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const arrow = useRef<SVGSVGElement>(null);
  const hand = useRef<SVGSVGElement>(null);
  const ripple = useRef<HTMLSpanElement>(null);
  const lines = useRef<SVGGElement>(null);
  const nodes = useRef<Partial<Record<NodeId, HTMLDivElement | null>>>({});
  const dots = useRef<HTMLDivElement>(null);
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

    /** مستطيل عنصر جوه المشهد (بعد الـ 3D والتكبير)، بإحداثيات الـ 600×500. */
    const inStage = (el: Element | null) => {
      const s = stage.current?.getBoundingClientRect();
      const r = el?.getBoundingClientRect();
      if (!s || !r) return { x: TAB.cx, y: TAB.cy, top: TAB.cy - TAB.h / 2 };
      const k = s.width / W;
      return { x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k, top: (r.top - s.top) / k };
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
      path.setAttribute("stroke-width", "2.2");
      path.setAttribute("stroke-linecap", "round");
      const ball = document.createElementNS(ns, "g");
      ball.innerHTML = `<circle r="10" fill="url(#orbGlow)"/><circle r="3" fill="#FFF8E6"/>`;
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
        tl.to(el, { opacity: 0.6 + 0.4 * s, duration: 0.3, ease: "power1.out" }, 0).to(
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

      // الماوس يدخل ويروح للزرار على منحنى، ويتحوّل لإيد وهو فوقه
      tl.set(cursor.current, { x: CURSOR_FROM.x, y: CURSOR_FROM.y, scale: 1, opacity: 0 });
      tl.set(arrow.current, { opacity: 1 });
      tl.set(hand.current, { opacity: 0 });
      tl.to(cursor.current, { opacity: 1, duration: 0.25 }, 0.1);
      tl.to(
        cursor.current,
        {
          duration: reduced ? 0.01 : 1,
          ease: "power3.inOut",
          motionPath: {
            path: [CURSOR_FROM, { x: (CURSOR_FROM.x + CURSOR_TO.x) / 2 + 10, y: CURSOR_TO.y + 46 }, CURSOR_TO],
            curviness: 1.3,
          },
        },
        0.2,
      );
      tl.to(arrow.current, { opacity: 0, duration: 0.12 }, 1.02);
      tl.to(hand.current, { opacity: 1, duration: 0.12 }, 1.02);
      tl.to(button.current, { scale: 1.04, duration: 0.2, ease: "power2.out" }, 1.05);
      // الضغطة
      tl.to(cursor.current, { scale: 0.86, duration: 0.09, ease: "power2.out" }, 1.32);
      tl.to(button.current, { scale: 0.97, duration: 0.09, ease: "power2.out" }, 1.32);
      tl.fromTo(ripple.current, { scale: 0.2, opacity: 0.5 }, { scale: 1.6, opacity: 0, duration: 0.55, ease: "power2.out", immediateRender: false }, 1.34);
      tl.to(cursor.current, { scale: 1, duration: 0.2, ease: "power2.out" }, 1.42);
      tl.to(button.current, { scale: 1, duration: 0.25, ease: "power2.out" }, 1.42);

      const launch = 1.5 + (emerged ? 0 : 1.15);
      tl.call(
        () => {
          if (!emerged) {
            emerged = true;
            emerge();
          }
        },
        [],
        1.46,
      );

      // الزرار يختفي والرسالة الواحدة تظهر
      tl.to(cursor.current, { opacity: 0, duration: 0.3 }, 1.65);
      tl.to(button.current, { scale: 0.9, opacity: 0, duration: 0.28, ease: "power2.in" }, 1.6);
      tl.fromTo(message.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, 1.95);

      // اللي بيطلع من الشاشة (أو بيدخلها من المتجر)
      tl.call(
        () => {
          const scr = inStage(screen.current);
          const src = { x: scr.x, y: scr.top + 26 };
          const targets = a.to ?? a.from ?? [];
          targets.forEach((id, i) => {
            const p = pos(node(id));
            if (a.to) orb(src, p, i * 0.09, () => arrive(id));
            else orb(p, src, i * 0.12, () => arrive(id));
          });
        },
        [],
        launch,
      );

      // ترجع للزرار اللي بعده
      const end = launch + 3.1;
      tl.to(message.current, { y: -8, opacity: 0, duration: 0.35, ease: "power2.in" }, end);
      tl.fromTo(button.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, end + 0.3);
      tl.call(() => later(0.4, cycle), [], end + 0.75);
    };

    // ── لحظة الدخول: التابلت يقوم من نايم لواقف، والشاشة تنوّر ──
    const ctx = gsap.context(() => {
      NODES.forEach((x) => {
        const el = nodeEl(x.id);
        if (el) el.dataset.s = String(depth(x));
      });
      const rest = { rotationX: TAB.rx, rotationY: TAB.ry, y: 0, scale: 1, opacity: 1 };
      const tl = gsap.timeline({ delay: reduced ? 0 : 0.35 });
      if (reduced) {
        tl.set(tablet.current, rest).set(shadow.current, { opacity: 1, scale: 1 });
      } else {
        tl.fromTo(
          tablet.current,
          { rotationX: 72, rotationY: 0, y: 70, scale: 0.92, opacity: 0 },
          { ...rest, duration: 1.7, ease: "power3.out" },
        );
        tl.fromTo(shadow.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 0.2);
        // بعد ما يقف: عوم بطيء جداً
        tl.call(() => {
          pending.push(gsap.to(tablet.current, { y: -6, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 }));
          pending.push(gsap.to(tablet.current, { rotationY: TAB.ry - 3, duration: 4.6, ease: "sine.inOut", yoyo: true, repeat: -1 }));
          pending.push(gsap.to(shadow.current, { scale: 0.94, opacity: 0.8, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 }));
        });
      }
      // الشاشة تشتغل
      tl.fromTo(power.current, { opacity: 0.6 }, { opacity: 0, duration: 0.8, ease: "power2.out" }, reduced ? 0 : 1.25);
      tl.to(content.current, { opacity: 1, duration: 0.5, ease: "power2.out" }, "<0.1");
      tl.call(cycle, [], "+=0.35");
    }, stage);

    return () => {
      alive = false;
      pending.forEach((p) => p.kill());
      io.disconnect();
      ctx.revert();
    };
  }, []);

  const tabLeft = TAB.cx - TAB.w / 2;
  const tabTop = TAB.cy - TAB.h / 2;

  return (
    <div
      ref={wrap}
      className="relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
      role="img"
      aria-label="تابلت عليه زرار «أنشئ حملة»، الماوس يدوسه، والحملة تطلع منه لكل المنصات"
    >
      <div ref={stage} className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }} aria-hidden>
        <div ref={dots} className="absolute inset-0" style={{ opacity: 0 }}>
          {DOTS.map((d, i) => (
            <span key={i} className="absolute rounded-full bg-[#F4EEE5]/20" style={{ left: d.x - d.s / 2, top: d.y - d.s / 2, width: d.s, height: d.s }} />
          ))}
        </div>

        {/* ظل ناعم على الأرض */}
        <div
          ref={shadow}
          className="absolute rounded-[50%]"
          style={{ left: TAB.cx - 170, top: tabTop + TAB.h + 22, width: 340, height: 40, opacity: 0, background: "radial-gradient(closest-side, rgba(0,0,0,0.55), rgba(0,0,0,0))" }}
        />

        {/* التابلت: طبقات ورا بعض في 3D بتعمل السُمك والحافة المعدن */}
        <div className="absolute" style={{ left: tabLeft, top: tabTop, width: TAB.w, height: TAB.h, perspective: 1100 }}>
          <div
            ref={tablet}
            className="relative size-full"
            style={{ transformStyle: "preserve-3d", transform: "rotateX(72deg) translateY(70px) scale(0.92)", opacity: 0 }}
          >
            {Array.from({ length: TAB.depth }, (_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-[24px]"
                style={{
                  transform: `translateZ(${-(i + 1)}px)`,
                  background: i === TAB.depth - 1 ? "linear-gradient(140deg, #D9DCE1, #A7ACB5)" : "linear-gradient(140deg, #C9CDD3, #8E939C)",
                }}
              />
            ))}
            <div
              className="absolute inset-0 rounded-[24px] bg-[#0B0A09] p-[13px]"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 2px rgba(0,0,0,0.6)" }}
            >
              {/* الكاميرا */}
              <span className="absolute right-1/2 top-[5px] size-[4px] translate-x-1/2 rounded-full bg-[#1E2024]" />
              <div ref={screen} className="relative size-full overflow-hidden rounded-[12px] bg-[#FBFAF8]">
                <div ref={content} className="absolute inset-0" style={{ opacity: 0 }}>
                  {/* زرار واحد في النص */}
                  <div className="absolute inset-0 grid place-items-center">
                    <div
                      ref={button}
                      className="relative rounded-[12px] bg-[#16120E] px-[24px] py-[11px] font-display text-[15px] font-semibold text-[#F4EEE5]"
                      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 6px 14px -6px rgba(22,18,14,0.5)" }}
                    >
                      <span ref={buttonLabel}>أنشئ حملة</span>
                    </div>
                  </div>
                  {/* رسالة واحدة بعد الضغطة */}
                  <div ref={message} className="absolute inset-0 grid place-items-center" style={{ opacity: 0 }}>
                    <div className="flex items-center gap-2" dir="rtl">
                      <span className="grid size-[24px] place-items-center rounded-full bg-[#1F9D6B] text-white">
                        <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
                          <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span ref={messageText} className="font-display text-[16px] font-bold text-[#16120E]">
                        حملتك نزلت على ٤ منصات
                      </span>
                    </div>
                  </div>
                  {/* الماوس: سهم، وبيتحول لإيد فوق الزرار */}
                  <div ref={cursor} className="absolute left-0 top-0" style={{ opacity: 0 }}>
                    <span ref={ripple} className="absolute left-[-14px] top-[-14px] size-[28px] rounded-full border-2 border-[#16120E]/40" style={{ opacity: 0 }} />
                    <svg ref={arrow} width="22" height="28" viewBox="0 0 22 28" className="absolute left-[-3px] top-[-2px]" style={{ filter: "drop-shadow(0 2px 2.5px rgba(0,0,0,0.35))" }}>
                      <path d="M3 2.5 L3 22 L8.1 17.4 L11.4 25.1 L14.9 23.6 L11.6 16.1 L18.6 16.1 Z" fill="#16120E" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                    <svg ref={hand} width="24" height="28" viewBox="0 0 24 28" className="absolute left-[-9px] top-[-3px]" style={{ opacity: 0, filter: "drop-shadow(0 2px 2.5px rgba(0,0,0,0.35))" }}>
                      <path
                        d="M8.6 3.2c0-1.1.9-2 2-2s2 .9 2 2v7.4c.4-.3.9-.4 1.4-.4 1 0 1.8.7 2 1.6.4-.3.9-.4 1.4-.4 1.1 0 2 .8 2.1 1.9.3-.2.7-.3 1.1-.3 1.1 0 2 .9 2 2v5.4c0 4-3.2 7.2-7.2 7.2h-1.4c-2.3 0-4.4-1.1-5.7-2.9L3.2 17.8c-.6-.9-.5-2.1.4-2.7.8-.6 2-.5 2.6.3l2.4 3.1V3.2z"
                        fill="#FFFFFF"
                        stroke="#16120E"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path d="M12.6 10.6v4.6M16 12v3.6M19.5 13.4v2.8" stroke="#16120E" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                {/* ومضة تشغيل الشاشة + انعكاس الزجاج */}
                <div ref={power} className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: 0 }} />
                <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.35) 52%, rgba(255,255,255,0) 64%)", mixBlendMode: "soft-light" }} />
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
                background: nd.bg ?? "#211C18",
                color: nd.color,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(244,238,229,0.09), 0 12px 24px -10px rgba(0,0,0,0.7)",
                opacity: 0, // مخفية لحد ما تطلع من الشاشة (من غير flash قبل الـ JS)
              }}
            >
              {nd.Icon ? <nd.Icon size={20} /> : <span className="font-display text-[0.8rem] font-bold">{nd.text}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
