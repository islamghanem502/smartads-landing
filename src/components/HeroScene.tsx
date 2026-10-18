"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { IconType } from "react-icons";
import { SiFacebook, SiGoogle, SiInstagram, SiMeta, SiSnapchat, SiTiktok } from "react-icons/si";
import { Mascot, type MascotHandle } from "@/mascot/Mascot";

// المشهد مرسوم على 600×500، وبيتصغّر/يتكبّر كله مع العمود.
const W = 600;
const H = 500;

// اللابتوب: المفصّلة والشاشة
const LID = { x: 228, w: 300, h: 194, hinge: 392 };
const SCREEN_TOP = { x: LID.x + LID.w / 2, y: LID.hinge - LID.h + 14 };

type NodeId = "meta" | "facebook" | "instagram" | "google" | "tiktok" | "snapchat" | "salla" | "zid";
type Node = { id: NodeId; name: string; Icon?: IconType; text?: string; color: string; bg?: string; r: number; deg: number };

// قبة المنصات فوق الشاشة: قوس برّه وقوس جوّه. بس المنصات اللي شغالين معاها فعلاً.
const NODES: Node[] = [
  { id: "instagram", name: "انستجرام", Icon: SiInstagram, color: "#E1306C", r: 178, deg: -158 },
  { id: "meta", name: "ميتا", Icon: SiMeta, color: "#0866FF", r: 182, deg: -124 },
  { id: "google", name: "قوقل", Icon: SiGoogle, color: "#4285F4", r: 186, deg: -90 },
  { id: "tiktok", name: "تيك توك", Icon: SiTiktok, color: "#111111", r: 182, deg: -56 },
  { id: "snapchat", name: "سناب", Icon: SiSnapchat, color: "#1B2230", bg: "#FFFC00", r: 178, deg: -22 },
  { id: "facebook", name: "فيسبوك", Icon: SiFacebook, color: "#1877F2", r: 108, deg: -142 },
  { id: "salla", name: "سلة", text: "سلة", color: "#004D5A", bg: "#E3F7F1", r: 104, deg: -90 },
  { id: "zid", name: "زد", text: "زد", color: "#5B2A8E", bg: "#F1EAFB", r: 108, deg: -38 },
];

const pos = (n: Node) => {
  const a = (n.deg * Math.PI) / 180;
  // أرقام صحيحة: الكسور الطويلة بتختلف بين السيرفر والمتصفح (hydration)
  return { x: Math.round(SCREEN_TOP.x + Math.cos(a) * n.r), y: Math.round(SCREEN_TOP.y - 10 + Math.sin(a) * n.r) };
};
// العمق: اللي على أطراف القبة أصغر وأبهت
const depth = (n: Node) => 0.74 + 0.26 * Math.sin((-n.deg * Math.PI) / 180) * (n.r > 150 ? 1 : 0.92);

// نقط خفيفة تكمّل القبة من غير ما ندّعي منصات زيادة
const DOTS = Array.from({ length: 22 }, (_, i) => {
  const a = (-172 + (i * 164) / 21) * (Math.PI / 180);
  const r = (i % 3 === 0 ? 222 : i % 3 === 1 ? 142 : 206) + ((i * 37) % 13);
  return { x: Math.round(SCREEN_TOP.x + Math.cos(a) * r), y: Math.round(SCREEN_TOP.y - 10 + Math.sin(a) * r), s: 3 + (i % 3) };
});

const ADS: NodeId[] = ["meta", "google", "tiktok", "snapchat"];

type Beat = { label: string; icon: string; from?: NodeId; to: NodeId[]; emote?: "celebrate" | "proud" };
// كل نبضة بتحكي ميزة: حدث موقعك لكل المنصات، النشر، الحملات، وطلب جاي من المتجر
const BEATS: Beat[] = [
  { label: "تواصل واتساب", icon: "💬", to: ADS, emote: "celebrate" },
  { label: "منشور جديد", icon: "📱", to: ["instagram", "facebook"] },
  { label: "طلب جديد من سلة", icon: "🛍️", from: "salla", to: ADS, emote: "celebrate" },
  { label: "حملة جاهزة", icon: "📣", to: ["snapchat", "tiktok"], emote: "proud" },
  { label: "تسجيل جديد", icon: "✍️", to: ADS },
  { label: "طلب جديد من زد", icon: "🛍️", from: "zid", to: ADS, emote: "celebrate" },
];

type Row = { id: number; label: string; icon: string };

export function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const lid = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const screenGlow = useRef<HTMLDivElement>(null);
  const lines = useRef<SVGGElement>(null);
  const nodes = useRef<Partial<Record<NodeId, HTMLDivElement | null>>>({});
  const dots = useRef<HTMLDivElement>(null);
  const mascot = useRef<MascotHandle>(null);
  const [scale, setScale] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);

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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    let beat = 0;
    let rowId = 0;
    let loopCall: gsap.core.Tween | null = null;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);

    const nodeEl = (id: NodeId) => nodes.current[id] ?? null;

    /** خط بيترسم من نقطة لنقطة، وبعدين يختفي. */
    const drawLine = (from: { x: number; y: number }, to: { x: number; y: number }, delay: number) => {
      const g = lines.current;
      if (!g) return 0;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const mx = (from.x + to.x) / 2;
      const my = Math.min(from.y, to.y) - 26;
      path.setAttribute("d", `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#F2A20C");
      path.setAttribute("stroke-width", "2.2");
      path.setAttribute("stroke-linecap", "round");
      g.appendChild(path);
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: reduced ? 0 : len, opacity: reduced ? 0 : 1 });
      gsap
        .timeline({ delay, onComplete: () => path.remove() })
        .to(path, reduced ? { opacity: 1, duration: 0.2 } : { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" })
        .to(path, { opacity: 0, duration: 0.5, ease: "power1.in" }, "+=0.55");
      return 0.45;
    };

    /** حلقة بتتنفخ حوالين المنصة لما الحدث يوصلها. */
    const ping = (id: NodeId, delay: number) => {
      const el = nodeEl(id);
      if (!el) return;
      const ring = document.createElement("span");
      ring.className = "pointer-events-none absolute inset-[-3px] rounded-full border-2 border-[#F2A20C]";
      el.appendChild(ring);
      gsap.fromTo(
        ring,
        { scale: 1, opacity: 0.9 },
        { scale: reduced ? 1 : 1.55, opacity: 0, duration: 0.8, delay, ease: "power2.out", onComplete: () => ring.remove() },
      );
      gsap.fromTo(el, { scale: Number(el.dataset.s) }, { scale: Number(el.dataset.s) * (reduced ? 1 : 1.12), duration: 0.16, delay, yoyo: true, repeat: 1, ease: "power2.out" });
    };

    const fire = () => {
      if (!visible) {
        loopCall = gsap.delayedCall(1, fire);
        return;
      }
      const b = BEATS[beat++ % BEATS.length];
      const src = { x: SCREEN_TOP.x, y: SCREEN_TOP.y + 6 };
      let t = 0;
      if (b.from) {
        const f = pos(NODES.find((n) => n.id === b.from)!);
        mascot.current?.lookAtElement(nodeEl(b.from), 0.7);
        ping(b.from, 0);
        t = drawLine(f, src, 0) + 0.05;
      }
      gsap.delayedCall(t, () => {
        setRows((r) => [{ id: ++rowId, label: b.label, icon: b.icon }, ...r].slice(0, 3));
      });
      b.to.forEach((id, i) => {
        const d = t + 0.2 + i * 0.08;
        drawLine(src, pos(NODES.find((n) => n.id === id)!), d);
        ping(id, d + 0.42);
      });
      gsap.delayedCall(t + 0.15, () => mascot.current?.lookAtElement(nodeEl(b.to[0]), 1.3));
      if (b.emote) gsap.delayedCall(t + 0.7, () => mascot.current?.triggerEmote(b.emote!));
      loopCall = gsap.delayedCall(t + 2.1, fire);
    };

    // ── لحظة الدخول: ترحيب، اللابتوب يتفتح، الشاشة تنوّر، المنصات تطلع منها ──
    const ctx = gsap.context(() => {
      const icons = NODES.map((n) => nodeEl(n.id)).filter(Boolean) as HTMLDivElement[];
      NODES.forEach((n) => {
        const el = nodeEl(n.id);
        if (!el) return;
        const p = pos(n);
        el.dataset.s = String(depth(n));
        gsap.set(el, { x: SCREEN_TOP.x - p.x, y: SCREEN_TOP.y + 40 - p.y, scale: 0.3, opacity: 0 });
      });
      gsap.set(lid.current, { rotationX: -90, transformOrigin: "50% 100%" });
      gsap.set([screen.current, screenGlow.current, dots.current], { opacity: 0 });

      const tl = gsap.timeline({ delay: reduced ? 0 : 1.6 });
      tl.call(() => mascot.current?.setState("watching"));
      tl.call(() => mascot.current?.lookAtElement(screen.current));
      if (reduced) {
        tl.set(lid.current, { rotationX: 7 });
      } else {
        tl.to(lid.current, { rotationX: 11, duration: 1.05, ease: "power3.inOut" }).to(lid.current, { rotationX: 7, duration: 0.4, ease: "sine.out" });
        tl.call(() => mascot.current?.triggerEmote("surprised"), [], 0.65);
      }
      tl.to(screenGlow.current, { opacity: 1, duration: 0.6, ease: "power2.out" }, reduced ? 0 : 0.85);
      tl.to(screen.current, { opacity: 1, duration: 0.35, ease: "power2.out" }, "<0.1");
      // من النص للأطراف
      const order = [...icons].sort((a, b) => Math.abs(Number(a.dataset.deg) + 90) - Math.abs(Number(b.dataset.deg) + 90));
      tl.to(
        order,
        {
          x: 0,
          y: 0,
          opacity: (_i: number, el: HTMLDivElement) => 0.55 + 0.45 * Number(el.dataset.s),
          scale: (_i: number, el: HTMLDivElement) => Number(el.dataset.s),
          duration: reduced ? 0.01 : 0.75,
          ease: "back.out(1.5)",
          stagger: reduced ? 0 : 0.07,
        },
        "<0.25",
      );
      tl.to(dots.current, { opacity: 1, duration: 0.8 }, "<0.3");
      tl.call(fire, [], "+=0.4");
    }, stage);

    return () => {
      loopCall?.kill();
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrap} className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }} role="img" aria-label="لابتوب بيتفتح وعليه لوحة مسوّقك الذكي، والأحداث بتطلع منه لكل المنصات، والشخصية قاعدة جنبه بتتفرج">
      <div ref={stage} className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }} aria-hidden>
        {/* نقط القبة */}
        <div ref={dots} className="absolute inset-0" style={{ opacity: 0 }}>
          {DOTS.map((d, i) => (
            <span key={i} className="absolute rounded-full bg-[#D9DCE3]" style={{ left: d.x - d.s / 2, top: d.y - d.s / 2, width: d.s, height: d.s }} />
          ))}
        </div>

        <svg className="pointer-events-none absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <g ref={lines} />
        </svg>

        {/* المنصات */}
        {NODES.map((n) => {
          const p = pos(n);
          return (
            <div
              key={n.id}
              ref={(el) => {
                nodes.current[n.id] = el;
              }}
              data-deg={n.deg}
              className="absolute grid size-[46px] place-items-center rounded-full border border-[#EEF0F3]"
              style={{
                left: p.x - 23,
                top: p.y - 23,
                background: n.bg ?? "#fff",
                color: n.color,
                opacity: 0, // مخفية لحد لحظة الدخول (من غير flash قبل الـ JS)
                boxShadow: "0 8px 18px -8px rgba(27,34,48,0.28)",
              }}
            >
              {n.Icon ? <n.Icon size={21} /> : <span className="font-display text-[0.8rem] font-bold">{n.text}</span>}
            </div>
          );
        })}

        {/* ظل اللابتوب */}
        <div
          className="absolute rounded-[50%]"
          style={{ left: LID.x - 50, top: LID.hinge + 22, width: LID.w + 100, height: 34, background: "radial-gradient(closest-side, rgba(27,34,48,0.16), rgba(27,34,48,0))" }}
        />

        {/* القاعدة: شبه منحرف ثابت (الحركة كلها في الغطا) */}
        <div
          className="absolute"
          style={{
            left: LID.x - 22,
            top: LID.hinge - 2,
            width: LID.w + 44,
            height: 30,
            clipPath: "polygon(7% 0, 93% 0, 100% 78%, 99% 100%, 1% 100%, 0 78%)",
            background: "linear-gradient(180deg, #F3F4F7 0%, #DADDE3 70%, #B9BDC6 100%)",
          }}
        >
          <div className="absolute left-1/2 top-[3px] h-[3px] w-[56px] -translate-x-1/2 rounded-full bg-[#C8CCD4]" />
        </div>

        {/* توهج الشاشة */}
        <div
          ref={screenGlow}
          className="absolute rounded-full"
          style={{ opacity: 0, left: LID.x - 40, top: LID.hinge - LID.h - 30, width: LID.w + 80, height: LID.h + 40, background: "radial-gradient(closest-side, rgba(242,162,12,0.18), rgba(242,162,12,0))" }}
        />

        {/* الغطا: بيلف حوالين المفصّلة في 3D */}
        <div className="absolute" style={{ left: LID.x, top: LID.hinge - LID.h, width: LID.w, height: LID.h, perspective: 900, perspectiveOrigin: "50% -60%" }}>
          <div ref={lid} className="relative size-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(-90deg)", transformOrigin: "50% 100%" }}>
            {/* الضهر (باين وهو مقفول) */}
            <div
              className="absolute inset-0 grid place-items-center rounded-[16px_16px_6px_6px]"
              style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden", background: "linear-gradient(160deg, #F1F2F5, #C9CDD4)" }}
            >
              <span className="grid size-9 place-items-center rounded-[11px] bg-white/70 font-display text-sm font-bold text-[#E08600]">م</span>
            </div>
            {/* الشاشة */}
            <div className="absolute inset-0 rounded-[16px_16px_6px_6px] bg-[#232733] p-[9px] pb-[12px]" style={{ backfaceVisibility: "hidden" }}>
              <div className="relative size-full overflow-hidden rounded-[8px] bg-[#FBFAF7]">
                <div ref={screen} className="flex size-full flex-col gap-2 p-3" dir="rtl" style={{ opacity: 0 }}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="grid size-[18px] place-items-center rounded-[5px] bg-[#F2A20C] font-display text-[0.6rem] font-bold text-[#1B2230]">م</span>
                      <span className="font-display text-[0.68rem] font-bold text-[#1B2230]">مسوّقك الذكي</span>
                    </span>
                    <span className="flex items-center gap-1 text-[0.6rem] text-[#1F9D6B]">
                      <span className="size-1.5 rounded-full bg-[#1F9D6B]" />
                      مباشر
                    </span>
                  </div>
                  <span className="font-display text-[0.58rem] text-[#8A8F98]">آخر اللي صار</span>
                  <div className="flex flex-col gap-1.5">
                    {rows.map((r) => (
                      <div key={r.id} className="scene-row flex items-center gap-2 rounded-[7px] bg-white px-2 py-1.5 shadow-[0_1px_0_#ECEDF0]">
                        <span className="text-[0.7rem]">{r.icon}</span>
                        <span className="flex-1 font-display text-[0.62rem] font-semibold text-[#1B2230]">{r.label}</span>
                        <span className="text-[0.55rem] text-[#8A8F98]">الحين</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الشخصية قاعدة جنب اللابتوب وبتتفرج */}
        <div className="absolute" style={{ left: 2, top: LID.hinge + 28 - 230 * (0.5 + 0.3 * 0.94) }}>
          <Mascot ref={mascot} size={230} />
        </div>
      </div>
    </div>
  );
}
