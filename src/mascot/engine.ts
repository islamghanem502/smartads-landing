import gsap from "gsap";
import { LOOK, STATES, type EmoteName, type EyeShape, type MascotStateName, type RGB } from "./look";

// ── رياضيات الحركة ──────────────────────────────────────────────────────────
// متابعة مستقلة عن الـ frame rate: value += (target − value)·(1 − b^dt)
const approach = (v: number, target: number, b: number, dt: number) => v + (target - v) * (1 - Math.pow(b, dt));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const rot2 = (x: number, y: number, a: number) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)] as const;
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`;

// cubic out / cubic in-out / back (c1 = 1.7) بأسماء GSAP
const OUT = "power2.out";
const IN_OUT = "power2.inOut";
const BACK = "back.out(1.7)";

type Point = { x: number; y: number };
type Target = Point | Element;
type ParticleKind = "heart" | "star" | "spark" | "text";
type Particle = {
  kind: ParticleKind;
  text?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
};
type SoundKind = "tap" | "hop" | "love" | "dizzy" | "error" | "greet" | "proud";

const BLINKABLE: EyeShape[] = ["round", "wide", "dot", "tired", "heart", "star"];

/** القيم اللي GSAP بيحرّكها (keyframes). باقي الحركة: متابعة أُسّية وزنبركات في update(). */
type Fx = {
  x: number; // × R
  y: number; // × R، سالب = لفوق
  sx: number;
  sy: number;
  rot: number;
  roll: number;
  lidL: number;
  lidR: number;
  morph: number;
  pop: number;
  wag: number;
  jaw: number;
  smile: number; // إضافة فوق ابتسامة الحالة
  brow: number; // −1 متضايق … 1 مرفوع
  browShow: number;
  typing: number;
  say: number;
  sink: number;
  dance: number;
  wait: number;
};

const NEUTRAL: Partial<Fx> = { x: 0, y: 0, sx: 1, sy: 1, rot: 0, pop: 1, wag: 0, jaw: 0, smile: 0, brow: 0, browShow: 0, say: 0 };

export type EmoteOptions = { sound?: boolean };

export class MascotEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private size = 240;
  private dpr = 1;
  private R = 72;
  private unit: [number, number][] = [];

  private visible = true;
  private reduced = false;
  private t = 0;

  state: MascotStateName = "idle";
  sound = true;

  // متابعة أُسّية
  private yaw = 0;
  private pitch = 0;
  private prevYaw = 0;
  private tilt = 0;
  private glow = STATES.idle.glowAmount;
  private tint = 0;
  private smile = STATES.idle.smile;
  private tintRGB: [number, number, number] = [...STATES.idle.tint];
  private glowRGB: [number, number, number] = [...STATES.idle.glow];
  private eyeScale = 1;

  private fx: Fx = { x: 0, y: 0, sx: 1, sy: 1, rot: 0, roll: 0, lidL: 1, lidR: 1, morph: 1, pop: 1, wag: 0, jaw: 0, smile: 0, brow: 0, browShow: 0, typing: 0, say: 0, sink: 0, dance: 0, wait: 0 };
  private prevFy = 0;
  private eyeL: EyeShape = "round";
  private eyeR: EyeShape = "round";
  private emoteEyes = false;
  private sayText = "هلا!";

  // زنبركات
  private tail = { x: 0, v: 0 };
  private tailLift = { x: 0, v: 0 };
  private jaw = { x: 0, v: 0 };

  private particles: Particle[] = [];
  private pointer = { x: 0, y: 0, moved: -1e9 };
  private home: Target | null = null;
  private focus: { target: Target; until: number } | null = null;
  private wander = { x: 0, y: 0, next: 0 };

  private emoteTl: gsap.core.Timeline | null = null;
  private calls: gsap.core.Tween[] = [];
  private stateCalls: gsap.core.Tween[] = [];
  private taps: number[] = [];
  private audio: AudioContext | null = null;
  private unlocked = false;
  private pose = { cx: 0, cy: 0, rot: 0, sx: 1, sy: 1, roll: 0 };
  private io: IntersectionObserver | null = null;
  private mql: MediaQueryList | null = null;

  constructor(canvas: HTMLCanvasElement, size: number) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d not available");
    this.ctx = ctx;
    this.setSize(size);

    const n = LOOK.n;
    for (let i = 0; i < LOOK.segments; i++) {
      const a = (i / LOOK.segments) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      this.unit.push([Math.sign(c) * Math.pow(Math.abs(c), 2 / n), Math.sign(s) * Math.pow(Math.abs(s), 2 / n)]);
    }

    this.mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reduced = this.mql.matches;
    this.mql.addEventListener("change", this.onReducedChange);

    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerdown", this.onAnyPointerDown, { passive: true });
    canvas.addEventListener("pointerdown", this.onCanvasPointerDown);

    this.io = new IntersectionObserver(([e]) => (this.visible = e.isIntersecting));
    this.io.observe(canvas);

    this.scheduleBlink();
    gsap.ticker.add(this.tick);
  }

  destroy() {
    gsap.ticker.remove(this.tick);
    this.emoteTl?.kill();
    [...this.calls, ...this.stateCalls].forEach((c) => c.kill());
    gsap.killTweensOf(this.fx);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onAnyPointerDown);
    this.canvas.removeEventListener("pointerdown", this.onCanvasPointerDown);
    this.mql?.removeEventListener("change", this.onReducedChange);
    this.io?.disconnect();
    void this.audio?.close();
  }

  setSize(size: number) {
    this.size = size;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.R = 0.3 * size;
    this.canvas.width = Math.round(size * this.dpr);
    this.canvas.height = Math.round(size * this.dpr);
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
  }

  // ── الـ API ───────────────────────────────────────────────────────────────

  setState(name: MascotStateName) {
    if (name === this.state) return;
    this.state = name;
    this.stateCalls.forEach((c) => c.kill());
    this.stateCalls = [];
    const look = STATES[name];
    if (!this.emoteEyes) this.setEyes(look.eye, look.eye);

    gsap.to(this.fx, { dance: name === "dance" && !this.reduced ? 1 : 0, duration: name === "dance" ? 0.3 : 0.5, ease: IN_OUT, overwrite: "auto" });
    gsap.to(this.fx, { wait: name === "thinking" && !this.reduced ? 1 : 0, duration: 0.4, ease: IN_OUT, overwrite: "auto" });
    gsap.to(this.fx, { typing: name === "thinking" ? 1 : 0, duration: 0.35, ease: IN_OUT, overwrite: "auto" });
    gsap.to(this.fx, { sink: name === "sleeping" ? 0.16 : 0, duration: 1.2, ease: IN_OUT, overwrite: "auto" });

    if (name === "error") this.triggerEmote("shake", { sound: true });
    if (name === "happy") this.triggerEmote("hop");
    if (name === "sleeping") {
      const z = () => {
        this.spawn("text", 2, LOOK.ink, { text: "z", fromSide: true });
        this.stateCalls.push(gsap.delayedCall(2.6, z));
      };
      this.stateCalls.push(gsap.delayedCall(0.9, z));
    }
  }

  triggerEmote(name: EmoteName, opts: EmoteOptions = {}) {
    const tl = this.startEmote();
    const m = this.reduced ? 0 : 1; // الحركة الكبيرة بتتلغي مع «تقليل الحركة»
    const play = (k: SoundKind) => opts.sound && this.play(k);

    switch (name) {
      case "hop":
        play("hop");
        this.hop(tl, 0.22 * m);
        this.endEmote(tl, 0);
        break;

      case "celebrate":
        play("hop");
        tl.call(() => this.setEyes("happy", "happy", true));
        tl.to(this.fx, { smile: 0.6, duration: 0.2, ease: OUT }, 0);
        this.hop(tl, 0.26 * m);
        tl.call(() => this.spawn("spark", 6, LOOK.star), [], 0.12);
        this.endEmote(tl, 0.8);
        break;

      case "love":
        play("love");
        tl.to(this.fx, { sy: 0.93, sx: 1.06, duration: 0.09, ease: OUT });
        tl.call(() => this.setEyes("heart", "heart", true));
        tl.to(this.fx, { smile: 0.6, duration: 0.3, ease: OUT }, "<");
        this.hop(tl, 0.12 * m);
        tl.call(() => this.spawn("heart", 4, LOOK.heart), [], 0.15);
        this.endEmote(tl, 1.4);
        break;

      case "proud":
        play("proud");
        tl.to(this.fx, { sy: 0.94, sx: 1.05, duration: 0.08, ease: OUT });
        tl.call(() => this.setEyes("star", "star", true));
        tl.to(this.fx, { sy: 1.05, sx: 0.97, rot: -0.14, brow: 1, browShow: 1, smile: 0.5, duration: 0.35, ease: BACK });
        tl.call(() => this.spawn("star", 4, LOOK.star), [], "<");
        this.endEmote(tl, 1.3);
        break;

      case "surprised":
        play("hop");
        tl.call(() => this.setEyes("dot", "dot", true));
        tl.to(this.fx, { pop: 1.25, jaw: 0.6, brow: 1, browShow: 1, duration: 0.12, ease: OUT });
        tl.call(() => this.spawn("text", 1, LOOK.star, { text: "!" }), [], 0.05);
        this.hop(tl, 0.26 * m, "<");
        this.endEmote(tl, 0.8);
        break;

      case "yawn":
        tl.call(() => this.setEyes("tired", "tired", false));
        tl.to(this.fx, { sy: 1 + 0.12 * (m || 0.4), sx: 1 - 0.06 * (m || 0.4), jaw: 1, duration: 0.55, ease: IN_OUT });
        tl.to(this.fx, { duration: 0.7 });
        tl.call(() => this.setEyes("closed", "closed", true));
        tl.to(this.fx, { sy: 1, sx: 1, jaw: 0, duration: 0.45, ease: OUT });
        tl.call(() => this.spawn("text", 2, LOOK.ink, { text: "z", fromSide: true }));
        this.endEmote(tl, 1.3);
        break;

      case "wink":
        play("tap");
        tl.call(() => this.setEyes(this.eyeL, "happy", true));
        tl.to(this.fx, { rot: 0.08, smile: 0.6, brow: 0.5, browShow: 0.7, duration: 0.25, ease: BACK }, 0);
        tl.call(() => this.spawn("spark", 1, LOOK.star), [], 0.1);
        this.endEmote(tl, 0.55);
        break;

      case "annoyed":
        tl.to(this.fx, { sy: 0.95, sx: 1.05, rot: -0.05, brow: -1, browShow: 1, smile: -0.9, duration: 0.18, ease: OUT });
        tl.call(() => this.setEyes("line", "line", true), [], 0.05);
        this.endEmote(tl, 1.3);
        break;

      case "dizzy":
        play("dizzy");
        tl.call(() => this.setEyes("spiral", "spiral", true));
        tl.to(this.fx, { jaw: 0.35, smile: -0.4, duration: 0.2 }, 0);
        if (m) {
          tl.to(this.fx, { sy: 0.9, sx: 1.08, duration: 0.1, ease: OUT });
          tl.to(this.fx, { roll: Math.PI * 4, sy: 1, sx: 1, duration: 1.3, ease: IN_OUT });
          tl.set(this.fx, { roll: 0 });
          tl.to(this.fx, { rot: 0.1, duration: 0.25, ease: IN_OUT, yoyo: true, repeat: 3 });
        } else {
          tl.to(this.fx, { duration: 1.6 });
        }
        this.endEmote(tl, 0.4);
        break;

      case "wave":
        // سلام الفقاعة: الذيل بيهز، وتقول «هلا!»
        play("greet");
        tl.call(() => this.setEyes("happy", "happy", true));
        tl.to(this.fx, { wag: 1, smile: 0.6, brow: 0.6, browShow: 0.8, duration: 0.2, ease: OUT });
        tl.call(() => (this.sayText = "هلا!"), [], 0);
        tl.to(this.fx, { say: 1, duration: 0.35, ease: BACK }, 0.05);
        tl.to(this.fx, { duration: 1.3 });
        tl.to(this.fx, { wag: 0, say: 0, duration: 0.3, ease: IN_OUT });
        this.endEmote(tl, 0);
        break;

      case "shake":
        play("error");
        tl.to(this.fx, { brow: -0.6, browShow: 1, duration: 0.15 }, 0);
        if (m) {
          tl.to(this.fx, { x: 0.08, duration: 0.05, ease: OUT })
            .to(this.fx, { x: -0.08, duration: 0.07, ease: IN_OUT })
            .to(this.fx, { x: 0.05, duration: 0.07, ease: IN_OUT })
            .to(this.fx, { x: 0, duration: 0.09, ease: OUT });
        }
        this.endEmote(tl, 0.6);
        break;
    }
  }

  greet() {
    this.triggerEmote("wave", { sound: true });
    if (!this.reduced) this.emoteTl?.add(this.hopTl(0.12), 0.05);
  }

  /** يبص على نقطة في الصفحة (إحداثيات العميل). hold بالثواني؛ من غيره يفضل يبص عليها. */
  lookAt(x: number | null, y?: number, hold?: number) {
    this.setLook(x === null ? null : { x, y: y ?? 0 }, hold);
  }

  lookAtElement(el: Element | null, hold?: number) {
    this.setLook(el, hold);
  }

  private setLook(target: Target | null, hold?: number) {
    if (target && hold !== undefined) this.focus = { target, until: this.t + hold };
    else {
      this.home = target;
      this.focus = null;
    }
  }

  // ── الإيموت: بداية ونهاية بدون قفزات ───────────────────────────────────────

  private startEmote() {
    if (this.emoteTl) {
      this.emoteTl.kill();
      // لفّة اتقطعت في النص: نكمّلها لأقرب صفر من مكانها
      const roll = this.fx.roll % (Math.PI * 2);
      this.fx.roll = roll > Math.PI ? roll - Math.PI * 2 : roll;
      gsap.to(this.fx, { roll: 0, duration: 0.3, ease: OUT });
    }
    this.emoteEyes = true;
    const tl = gsap.timeline({ onComplete: () => (this.emoteTl = null) });
    this.emoteTl = tl;
    return tl;
  }

  private endEmote(tl: gsap.core.Timeline, hold: number) {
    if (hold) tl.to(this.fx, { duration: hold });
    tl.call(() => {
      this.emoteEyes = false;
      const now = STATES[this.state].eye;
      if (this.eyeL !== now || this.eyeR !== now) this.setEyes(now, now, true);
    });
    tl.to(this.fx, { ...NEUTRAL, duration: 0.35, ease: OUT });
  }

  /** نطة في الهوا: استعداد، طلوع 150ms (out)، رجوع 300ms (back)، وضغطة الرجوع على قد النطة. */
  private hopTl(h: number) {
    const tl = gsap.timeline();
    if (!h) return tl;
    const k = clamp(h / 0.2, 0.4, 1.3);
    tl.to(this.fx, { sy: 0.92, sx: 1.06, duration: 0.07, ease: OUT })
      .to(this.fx, { y: -h, sy: 1.06, sx: 0.95, duration: 0.15, ease: OUT })
      .to(this.fx, { y: 0, sy: 1, sx: 1, duration: 0.3, ease: BACK })
      .to(this.fx, { sy: 1 - 0.14 * k, sx: 1 + 0.11 * k, duration: 0.07, ease: OUT }, "-=0.2")
      .to(this.fx, { sy: 1 + 0.06 * k, sx: 1 - 0.03 * k, duration: 0.13, ease: OUT })
      .to(this.fx, { sy: 1, sx: 1, duration: 0.17, ease: OUT });
    return tl;
  }

  private hop(tl: gsap.core.Timeline, h: number, at?: gsap.Position) {
    tl.add(this.hopTl(h), at);
  }

  /** تبديل شكل العين جوه حركة ناعمة (العين تتنفخ وترجع) عشان ما يبانش «قطع». */
  private setEyes(l: EyeShape, r: EyeShape, soft = true) {
    this.eyeL = l;
    this.eyeR = r;
    if (soft) gsap.fromTo(this.fx, { morph: 0.7 }, { morph: 1, duration: 0.3, ease: BACK, overwrite: "auto" });
  }

  // ── مواعيد ورمش ──────────────────────────────────────────────────────────

  private later(delay: number, fn: () => void) {
    this.calls = this.calls.filter((c) => c.progress() < 1);
    this.calls.push(gsap.delayedCall(delay, fn));
  }

  private scheduleBlink() {
    this.later(rand(2.2, 5.4), () => {
      this.blink();
      if (Math.random() < 0.22) this.later(0.23, () => this.blink());
      this.scheduleBlink();
    });
  }

  private blink() {
    if (this.state === "sleeping") return;
    const lids: ("lidL" | "lidR")[] = [];
    if (BLINKABLE.includes(this.eyeL)) lids.push("lidL");
    if (BLINKABLE.includes(this.eyeR)) lids.push("lidR");
    for (const lid of lids) {
      gsap
        .timeline()
        .to(this.fx, { [lid]: 0.06, duration: 0.07, ease: IN_OUT })
        .to(this.fx, { [lid]: 1, duration: 0.13, ease: OUT });
    }
  }

  // ── المدخلات ──────────────────────────────────────────────────────────────

  private onReducedChange = (e: MediaQueryListEvent) => {
    this.reduced = e.matches;
  };

  private onPointerMove = (e: PointerEvent) => {
    this.pointer.x = e.clientX;
    this.pointer.y = e.clientY;
    this.pointer.moved = this.t;
  };

  private onAnyPointerDown = () => {
    this.unlocked = true;
  };

  private onCanvasPointerDown = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * this.size;
    const py = ((e.clientY - rect.top) / rect.height) * this.size;
    if (!this.hit(px, py)) return;
    this.unlocked = true;
    this.taps = [...this.taps.filter((t) => this.t - t < 1.7), this.t];
    if (this.taps.length >= 3) {
      this.taps = [];
      this.triggerEmote("dizzy", { sound: true });
      return;
    }
    // ضغطة: تتهرس (الحجم ثابت تقريباً) + تعبير + صوت
    this.play("tap");
    gsap
      .timeline()
      .to(this.fx, { sy: 0.8, sx: 1.14, duration: 0.07, ease: OUT })
      .to(this.fx, { sy: 1.08, sx: 0.95, duration: 0.13, ease: OUT })
      .to(this.fx, { sy: 1, sx: 1, duration: 0.17, ease: OUT });
    const pick = (["wink", "love", "surprised"] as const)[Math.floor(Math.random() * 3)];
    this.later(0.18, () => this.triggerEmote(pick));
  };

  private hit(px: number, py: number) {
    const p = this.pose;
    const rx = LOOK.rx * this.R;
    const ry = LOOK.ry * this.R;
    let [x, y] = rot2(px - p.cx, py - p.cy, -p.rot);
    x /= p.sx;
    y /= p.sy;
    [x, y] = rot2(x, y, -p.roll);
    return Math.pow(Math.abs(x / rx), LOOK.n) + Math.pow(Math.abs(y / ry), LOOK.n) <= 1;
  }

  private play(kind: SoundKind) {
    if (!this.sound || !this.unlocked) return;
    try {
      this.audio ??= new AudioContext();
      const ac = this.audio;
      const [f0, f1, d, type] = (
        {
          tap: [520, 780, 0.12, "sine"],
          hop: [440, 680, 0.12, "sine"],
          love: [660, 990, 0.2, "sine"],
          proud: [540, 1080, 0.22, "triangle"],
          greet: [620, 930, 0.16, "sine"],
          dizzy: [300, 900, 0.35, "triangle"],
          error: [240, 150, 0.2, "triangle"],
        } as const
      )[kind];
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(f1, t + d);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + d + 0.03);
    } catch {
      // الصوت اختياري
    }
  }

  // ── جزيئات ────────────────────────────────────────────────────────────────

  private spawn(kind: ParticleKind, count: number, color: string, opts: { fromSide?: boolean; text?: string } = {}) {
    const R = this.R;
    const k = R / 72;
    for (let i = 0; i < count; i++) {
      this.later(i * 0.14, () => {
        const p = this.pose;
        const top = p.cy - LOOK.ry * R * p.sy;
        const side = opts.fromSide;
        this.particles.push({
          kind,
          text: opts.text,
          color,
          x: p.cx + (side ? LOOK.rx * R * 0.6 + i * 0.12 * R : kind === "text" ? 0.55 * R : rand(-0.7, 0.7) * R),
          y: top + (side ? 0.1 * R : rand(-0.05, 0.12) * R),
          vx: (side ? rand(6, 14) : rand(-12, 12)) * k,
          vy: -rand(26, 42) * k * (this.reduced ? 0.25 : 1),
          age: 0,
          life: rand(1.3, 1.8),
          size: (kind === "text" ? rand(0.26, 0.32) : rand(0.13, 0.19)) * R,
          rot: kind === "text" ? rand(-0.15, 0.15) : rand(-0.3, 0.3),
          vr: kind === "text" ? 0 : rand(-0.6, 0.6),
        });
      });
    }
  }

  // ── الحلقة: update(dt) ثم draw() ───────────────────────────────────────────

  private tick = (_time: number, deltaMs: number) => {
    if (!this.visible) return;
    const dt = Math.min(0.05, Math.max(0.001, deltaMs / 1000));
    this.update(dt);
    this.draw();
  };

  private centerClient(): Point {
    const rect = this.canvas.getBoundingClientRect();
    const k = rect.width / this.size;
    return { x: rect.left + this.pose.cx * k, y: rect.top + this.pose.cy * k };
  }

  private resolve(t: Target): Point {
    if (!(t instanceof Element)) return t;
    const r = t.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  private update(dt: number) {
    this.t += dt;
    const look = STATES[this.state];
    const asleep = this.state === "sleeping";

    // النظرة: الماوس → الهدف المؤقت → الهدف الثابت → تجوال
    let lx = 0;
    let ly = 0;
    if (!asleep) {
      let target: Point | null = null;
      if (this.t - this.pointer.moved < 2.5) target = this.pointer;
      else if (this.focus && this.t < this.focus.until) target = this.resolve(this.focus.target);
      else if (this.home) target = this.resolve(this.home);

      if (target) {
        const c = this.centerClient();
        lx = Math.tanh((target.x - c.x) / 260);
        ly = -Math.tanh((target.y - c.y) / 200);
      } else if (this.t - this.pointer.moved > 3.5) {
        if (this.t > this.wander.next) {
          const straight = Math.random() < 0.35;
          this.wander = { x: straight ? 0 : rand(-0.85, 0.85), y: straight ? 0 : rand(-0.5, 0.45), next: this.t + rand(1.8, 4.4) };
        }
        lx = this.wander.x;
        ly = this.wander.y;
      }
    }
    let tYaw = 0.62 * lx;
    let tPitch = 0.5 * ly;
    if (this.state === "thinking") {
      tYaw = 0.3 + 0.1 * lx;
      tPitch = 0.3;
    }
    if (asleep) {
      tYaw = 0;
      tPitch = -0.14;
    }
    this.yaw = approach(this.yaw, tYaw, 0.0025, dt);
    this.pitch = approach(this.pitch, tPitch, 0.0025, dt);
    const yawVel = (this.yaw - this.prevYaw) / dt;
    this.prevYaw = this.yaw;

    // الوضع: ميلة بسيطة ناحية النظرة (أبطأ من العين)
    this.tilt = approach(this.tilt, asleep ? 0.06 : 0.08 * lx, 0.0008, dt);

    // الألوان والابتسامة
    this.glow = approach(this.glow, look.glowAmount, 0.002, dt);
    this.tint = approach(this.tint, look.tintAmount, 0.002, dt);
    this.smile = approach(this.smile, look.smile, 0.002, dt);
    this.eyeScale = approach(this.eyeScale, look.eyeScale, 0.0025, dt);
    for (let i = 0; i < 3; i++) {
      this.tintRGB[i] = approach(this.tintRGB[i], look.tint[i], 0.002, dt);
      this.glowRGB[i] = approach(this.glowRGB[i], look.glow[i], 0.002, dt);
    }

    // زنبركات: الذيل (k=60, c=9) بيتأخر عن لفّة الراس وعن الطلوع والنزول
    const fyVel = (this.fx.y - this.prevFy) / dt;
    this.prevFy = this.fx.y;
    const spring = (s: { x: number; v: number }, target: number, k: number, c: number) => {
      s.v += (k * (target - s.x) - c * s.v) * dt;
      s.x += s.v * dt;
    };
    spring(this.tail, clamp(-yawVel * 0.35 - this.tilt * 2 - this.fx.rot * 2, -1, 1), 60, 9);
    spring(this.tailLift, clamp(fyVel * 0.25, -1, 1), 60, 9);
    // الفك: ω0 = 2π/0.25s, ζ = 0.6
    const w0 = (Math.PI * 2) / 0.25;
    this.jaw.v += (w0 * w0 * (this.fx.jaw - this.jaw.x) - 2 * 0.6 * w0 * this.jaw.v) * dt;
    this.jaw.x += this.jaw.v * dt;

    for (const p of this.particles) {
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
    }
    this.particles = this.particles.filter((p) => p.age < p.life);
  }

  private draw() {
    const { ctx, R, size } = this;
    const rx = LOOK.rx * R;
    const ry = LOOK.ry * R;
    const t = this.t;
    const fx = this.fx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    // ── تركيب الحركة: عوم + keyframes + رقص + انتظار ──
    const asleep = this.state === "sleeping";
    // عايمة: طلوع ونزول بطيء، والتنفس متأخر عنه (مش متزامنين)
    const float = Math.sin(1.55 * t) * 0.045 * R * (asleep ? 0.5 : 1);
    const breathe = asleep ? 0.03 : 0.012;
    const syB = 1 + breathe * Math.sin(1.8 * t + 0.9);
    const sxB = 1 - breathe * 0.6 * Math.sin(1.8 * t + 1.5);
    let dx = 0;
    let dy = 0;
    let drot = Math.sin(0.9 * t + 0.4) * 0.025;
    let dsx = 1;
    let dsy = 1;
    if (fx.dance > 0.001) {
      const beat = (t * 112) / 60;
      const hop = Math.abs(Math.sin(Math.PI * beat));
      const land = Math.pow(1 - hop, 6);
      dx += 0.08 * R * Math.sin(Math.PI * beat) * fx.dance;
      dy += -0.2 * R * hop * fx.dance;
      drot += 0.1 * Math.sin(Math.PI * beat) * fx.dance;
      dsx *= 1 + 0.045 * land * fx.dance;
      dsy *= 1 - 0.06 * land * fx.dance;
    }
    if (fx.wait > 0.001) dy += -Math.abs(Math.sin(5.2 * t)) * 0.07 * R * fx.wait;

    const groundY = size * 0.88;
    const hover = (LOOK.hover - fx.sink) * R;
    const cx = size / 2 + fx.x * R + dx;
    const cy = groundY - ry - hover + float + fx.y * R + dy;
    const sx = fx.sx * sxB * dsx;
    const sy = fx.sy * syB * dsy;
    const rot = this.tilt + fx.rot + drot;
    const roll = fx.roll;
    this.pose = { cx, cy, rot, sx, sy, roll };
    const height = clamp((groundY - (cy + ry)) / R, 0, 1.2);

    // ظل على الأرض: بيصغر ويبهت كل ما تعلى
    ctx.save();
    ctx.translate(cx, groundY);
    ctx.scale(1, 0.14);
    const sr = rx * 0.85 * (1 - height * 0.35);
    const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, sr);
    sg.addColorStop(0, `rgba(0, 0, 0, ${0.32 * (1 - height * 0.55)})`);
    sg.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(0, 0, sr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // توهج ورا الشخصية بلون الحالة
    const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1.9 * R);
    gg.addColorStop(0, rgba(this.glowRGB, this.glow * 0.5));
    gg.addColorStop(1, rgba(this.glowRGB, 0));
    ctx.fillStyle = gg;
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(sx, sy);
    ctx.rotate(roll);
    const world = rot + roll; // النور ثابت في العالم: نلف نقطه عكس لفّة الجسم
    const fill = this.bodyFill(rx, ry, world);

    // الجسم والذيل شكل واحد (اتحاد المسارين)، فاللون والظل واللمعة ماشيين عليهم سوا
    this.bodyPath(rx, ry);
    this.tailPath(rx, ry);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.save();
    ctx.clip();
    if (this.tint > 0.005) {
      const tg = ctx.createLinearGradient(0, ry, 0, -ry);
      tg.addColorStop(0, rgba(this.tintRGB, 0.7 * this.tint));
      tg.addColorStop(1, rgba(this.tintRGB, 0));
      ctx.fillStyle = tg;
      ctx.fillRect(-rx * 1.3, -ry * 1.3, rx * 2.6, ry * 2.6);
    }
    // ظل الحافة
    ctx.save();
    ctx.scale(1, ry / rx);
    const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 1.08);
    rg.addColorStop(0, "rgba(0,0,0,0)");
    rg.addColorStop(0.62, "rgba(0,0,0,0)");
    rg.addColorStop(1, LOOK.rim);
    ctx.fillStyle = rg;
    ctx.fillRect(-rx * 1.2, -rx * 1.2, rx * 2.4, rx * 2.4);
    ctx.restore();
    // لمعة: بقعة ناعمة + لمعة صغيرة حادة زي البلاستيك الطري
    const [hx, hy] = rot2(0.36 * rx, -0.48 * ry, -world);
    const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 0.48 * R);
    hg.addColorStop(0, "rgba(255,255,255,0.6)");
    hg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = hg;
    ctx.fillRect(-rx, -ry, rx * 2, ry * 2);
    const [sx2, sy2] = rot2(0.5 * rx, -0.55 * ry, -world);
    ctx.save();
    ctx.translate(sx2, sy2);
    ctx.rotate(-world - 0.6);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 0.11 * R, 0.05 * R, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    this.drawFace(rx, ry, world);
    ctx.restore(); // clip
    ctx.restore(); // body

    if (fx.say > 0.01) this.drawSay(cx, cy, rx, ry);
    this.drawParticles();
  }

  private bodyFill(rx: number, ry: number, world: number) {
    const [l1x, l1y] = rot2(0.6 * rx, -0.9 * ry, -world);
    const [l2x, l2y] = rot2(-0.7 * rx, 1.25 * ry, -world);
    const g = this.ctx.createLinearGradient(l1x, l1y, l2x, l2y);
    g.addColorStop(0, LOOK.bodyLight);
    g.addColorStop(0.45, LOOK.bodyMid);
    g.addColorStop(1, LOOK.bodyDark);
    return g;
  }

  private bodyPath(rx: number, ry: number) {
    const { ctx, unit } = this;
    const n = unit.length;
    const p = (i: number) => unit[(i + n) % n];
    const mid = (i: number) => [((p(i)[0] + p(i + 1)[0]) / 2) * rx, ((p(i)[1] + p(i + 1)[1]) / 2) * ry];
    ctx.beginPath();
    const [mx, my] = mid(n - 1);
    ctx.moveTo(mx, my);
    for (let i = 0; i < n; i++) {
      const [ex, ey] = mid(i);
      ctx.quadraticCurveTo(p(i)[0] * rx, p(i)[1] * ry, ex, ey);
    }
    ctx.closePath();
  }

  /** نقطة على حافة الجسم عند زاوية a (من المركز). */
  private edge(a: number, rx: number, ry: number) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    const n = LOOK.n;
    return [rx * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), ry * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)] as const;
  }

  /** ذيل الفقاعة: طالع من تحت شمال، بيتمرجح بزنبرك، ويهز في السلام. بيتضاف لمسار الجسم. */
  private tailPath(rx: number, ry: number) {
    const { ctx, R } = this;
    const T = LOOK.tail;
    const a = T.angle - this.yaw * 0.25;
    const [b1x, b1y] = this.edge(a - T.spread, rx * 0.86, ry * 0.86);
    const [b2x, b2y] = this.edge(a + T.spread, rx * 0.86, ry * 0.86);
    const swing = this.tail.x * 0.45 + this.tailLift.x * 0.25 + Math.sin(this.t * 14) * 0.5 * this.fx.wag;
    const dirA = a + 0.3 + swing;
    const L = T.length * R;
    const [mx, my] = this.edge(a, rx, ry);
    const tip = [mx + Math.cos(dirA) * L, my + Math.sin(dirA) * L];
    // جنب برّه مقعّر (الذيل ملفوف)، وجنب جوّه مستقيم تقريباً
    const curl = T.curl * L;
    const c1 = [mx + Math.cos(dirA) * L * 0.25 - Math.sin(dirA) * curl, my + Math.sin(dirA) * L * 0.25 + Math.cos(dirA) * curl];
    const c2 = [mx + Math.cos(dirA) * L * 0.55 + Math.sin(dirA) * curl * 0.15, my + Math.sin(dirA) * L * 0.55 - Math.cos(dirA) * curl * 0.15];
    ctx.moveTo(b1x, b1y);
    ctx.quadraticCurveTo(c1[0], c1[1], tip[0], tip[1]);
    ctx.quadraticCurveTo(c2[0], c2[1], b2x, b2y);
    ctx.closePath();
  }

  /** إسقاط ملمح على «الكرة»: (yaw, pitch) → (x, y) + تقصير + هل باين. */
  private feature(fYaw: number, fPitch: number, rx: number, ry: number) {
    const yw = fYaw + this.yaw;
    const pt = fPitch + this.pitch;
    return {
      x: Math.sin(yw) * Math.cos(pt) * rx,
      y: -Math.sin(pt) * ry,
      kx: Math.max(0.18, Math.cos(yw)),
      ky: Math.max(0.18, Math.cos(pt)),
      visible: Math.cos(yw) * Math.cos(pt) > 0.04,
    };
  }

  private drawFace(rx: number, ry: number, world: number) {
    const { ctx, R, fx } = this;
    const E = LOOK.eye;
    const r = E.r * R * this.eyeScale * fx.pop;
    const typing = fx.typing;

    // العينين (بتختفي لما الفقاعة «بتكتب»)
    if (typing < 0.99) {
      for (const s of [-1, 1] as const) {
        const f = this.feature(s * E.yaw, E.pitch, rx, ry);
        if (!f.visible) continue;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.scale(f.kx * (1 - typing), f.ky * (1 - typing));
        this.drawEye(s < 0 ? this.eyeL : this.eyeR, r, s < 0 ? fx.lidL : fx.lidR, s, world);
        ctx.restore();

        // الحاجب
        if (fx.browShow > 0.01) {
          const B = LOOK.brow;
          const bf = this.feature(s * E.yaw * 1.05, E.pitch + B.lift + 0.06 * Math.max(0, fx.brow), rx, ry);
          ctx.save();
          ctx.globalAlpha = Math.min(1, fx.browShow);
          ctx.translate(bf.x, bf.y);
          ctx.scale(bf.kx, bf.ky);
          // متضايق: الطرف الجوّاني لتحت · مرفوع: الطرف الجوّاني لفوق سنة
          ctx.rotate(-s * 0.45 * Math.max(0, -fx.brow) + s * 0.12 * Math.max(0, fx.brow));
          ctx.fillStyle = LOOK.ink;
          ctx.beginPath();
          ctx.roundRect((-B.w / 2) * R, (-B.h / 2) * R, B.w * R, B.h * R, (B.h / 2) * R);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // «بتكتب…»: تلات نقط بتتنطط مكان العينين
    if (typing > 0.01) {
      const f = this.feature(0, E.pitch, rx, ry);
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.globalAlpha = typing;
      ctx.fillStyle = LOOK.ink;
      for (let i = 0; i < 3; i++) {
        const bounce = Math.pow(Math.max(0, Math.sin(this.t * 6.5 - i * 0.75)), 2) * 0.09 * R;
        ctx.beginPath();
        ctx.arc((i - 1) * 0.2 * R, -bounce, 0.058 * R * (0.6 + 0.4 * typing), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    this.drawMouth(rx, ry);
  }

  private drawEye(shape: EyeShape, r: number, open: number, side: -1 | 1, world: number) {
    const { ctx } = this;
    const morph = this.fx.morph;
    ctx.fillStyle = LOOK.ink;
    ctx.strokeStyle = LOOK.ink;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const glossy = (rr: number, ry: number) => {
      ctx.beginPath();
      ctx.ellipse(0, 0, rr, Math.max(ry, rr * 0.1), 0, 0, Math.PI * 2);
      ctx.fill();
      if (ry > rr * 0.45) {
        // لمعة العين ثابتة ناحية النور
        const [gx, gy] = rot2(rr * 0.36, -rr * 0.38, -world);
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.beginPath();
        ctx.arc(gx, gy * (ry / rr), rr * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.arc(-gx * 0.6, -gy * 0.5 * (ry / rr), rr * 0.13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = LOOK.ink;
      }
    };
    switch (shape) {
      case "round":
        glossy(r, r * open * morph);
        break;
      case "wide":
        glossy(r * 1.16, r * 1.22 * open * morph);
        break;
      case "dot":
        glossy(r * 0.62, r * 0.62 * open * morph);
        break;
      case "tired": {
        ctx.beginPath();
        ctx.ellipse(0, 0, r, Math.max(r * open, r * 0.1), 0, 0, Math.PI);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "line":
        ctx.save();
        ctx.rotate(side * 0.18);
        ctx.beginPath();
        ctx.roundRect(-r * 1.1, -r * 0.18, r * 2.2, r * 0.36, r * 0.18);
        ctx.fill();
        ctx.restore();
        break;
      case "flat":
        ctx.beginPath();
        ctx.roundRect(-r, -r * 0.15 + r * 0.2, r * 2, r * 0.3, r * 0.15);
        ctx.fill();
        break;
      case "happy":
        ctx.lineWidth = r * 0.55;
        ctx.beginPath();
        ctx.arc(0, r * 0.38, r * 0.82 * morph, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        break;
      case "closed":
        ctx.lineWidth = r * 0.42;
        ctx.beginPath();
        ctx.arc(0, -r * 0.15, r * 0.8, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
        break;
      case "spiral": {
        ctx.lineWidth = r * 0.24;
        ctx.beginPath();
        const spin = this.t * 7 * side;
        for (let i = 0; i <= 60; i++) {
          const k = i / 60;
          const a = k * 2.2 * Math.PI * 2 + spin;
          const rr = k * r * 1.05;
          if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
          else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.stroke();
        break;
      }
      case "heart":
        ctx.fillStyle = LOOK.heart;
        this.heartPath(r * 2.3 * Math.max(open, 0.25) * morph);
        ctx.fill();
        break;
      case "star":
        ctx.fillStyle = LOOK.star;
        ctx.strokeStyle = LOOK.star;
        ctx.lineWidth = r * 0.22;
        this.starPath(r * 1.25 * morph, 5, 0.46, this.t * 0.8 * side);
        ctx.fill();
        ctx.stroke();
        break;
    }
  }

  private drawMouth(rx: number, ry: number) {
    const { ctx, R } = this;
    const f = this.feature(0, LOOK.mouth.pitch, rx, ry);
    if (!f.visible) return;
    const jaw = clamp(this.jaw.x, 0, 1.3);
    const smile = clamp(this.smile + this.fx.smile, -1, 1);
    const w = LOOK.mouth.w * R;
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.scale(f.kx, f.ky);
    if (jaw > 0.04) {
      // بُق مفتوح: نص دايرة لتحت بيكبر مع الفك
      const h = 0.15 * R * jaw;
      ctx.beginPath();
      ctx.moveTo(-w * (0.7 + 0.2 * jaw), 0);
      ctx.quadraticCurveTo(0, -h * 0.25, w * (0.7 + 0.2 * jaw), 0);
      ctx.quadraticCurveTo(w * 0.7, h * 1.4, 0, h * 1.4);
      ctx.quadraticCurveTo(-w * 0.7, h * 1.4, -w * (0.7 + 0.2 * jaw), 0);
      ctx.closePath();
      ctx.fillStyle = LOOK.mouthInside;
      ctx.fill();
      ctx.strokeStyle = LOOK.ink;
      ctx.lineWidth = 0.035 * R;
      ctx.lineJoin = "round";
      ctx.stroke();
    } else if (Math.abs(smile) > 0.04) {
      ctx.strokeStyle = LOOK.ink;
      ctx.lineWidth = 0.042 * R;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-w * 0.55, 0);
      ctx.quadraticCurveTo(0, smile * 0.16 * R, w * 0.55, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  /** فقاعة صغيرة بيضا فوقها بكلمة («هلا!»). */
  private drawSay(cx: number, cy: number, rx: number, ry: number) {
    const { ctx, R } = this;
    const k = this.fx.say;
    const bx = cx + rx * 0.62;
    const by = cy - ry * 1.18;
    ctx.save();
    ctx.translate(bx, by);
    ctx.scale(k, k);
    ctx.globalAlpha = Math.min(1, k * 1.5);
    const w = 0.95 * R;
    const h = 0.48 * R;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
    ctx.moveTo(-w * 0.2, h / 2 - 2);
    ctx.lineTo(-w * 0.34, h / 2 + 0.16 * R);
    ctx.lineTo(-w * 0.02, h / 2 - 2);
    ctx.fill();
    ctx.fillStyle = LOOK.ink;
    ctx.font = `700 ${0.24 * R}px "Alexandria Variable", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "rtl";
    ctx.fillText(this.sayText, 0, 0.01 * R);
    ctx.restore();
  }

  private drawParticles() {
    const { ctx } = this;
    for (const p of this.particles) {
      const k = p.age / p.life;
      const a = k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8;
      const s = 1 + 0.4 * k;
      ctx.save();
      ctx.globalAlpha = clamp(a, 0, 1);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(s, s);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      switch (p.kind) {
        case "heart":
          this.heartPath(p.size);
          ctx.fill();
          break;
        case "star":
          ctx.lineJoin = "round";
          ctx.lineWidth = p.size * 0.14;
          this.starPath(p.size * 0.6, 5, 0.46, 0);
          ctx.fill();
          ctx.stroke();
          break;
        case "spark":
          this.starPath(p.size * 0.6, 4, 0.3, 0);
          ctx.fill();
          break;
        case "text":
          ctx.font = `800 ${p.size}px "Alexandria Variable", system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.text ?? "", 0, 0);
          break;
      }
      ctx.restore();
    }
  }

  private heartPath(size: number) {
    const { ctx } = this;
    const s = size / 2;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.85);
    ctx.bezierCurveTo(-s * 1.1, s * 0.1, -s * 0.85, -s * 0.85, 0, -s * 0.38);
    ctx.bezierCurveTo(s * 0.85, -s * 0.85, s * 1.1, s * 0.1, 0, s * 0.85);
    ctx.closePath();
  }

  private starPath(r: number, points: number, inner: number, spin: number) {
    const { ctx } = this;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2 + spin;
      const rr = i % 2 === 0 ? r : r * inner;
      if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
      else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
  }
}
