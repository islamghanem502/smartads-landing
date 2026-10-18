import gsap from "gsap";
import { LOOK, STATES, type EmoteName, type EyeShape, type MascotStateName, type RGB } from "./look";

// ── رياضيات الحركة ──────────────────────────────────────────────────────────
// متابعة مستقلة عن الـ frame rate: value += (target − value)·(1 − b^dt)
const approach = (v: number, target: number, b: number, dt: number) => v + (target - v) * (1 - Math.pow(b, dt));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const rot2 = (x: number, y: number, a: number) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)] as const;
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`;

// الـ easings من الـ brief بأسماء GSAP:
// out = 1 − (1 − t)^3 → power2.out · inOut = cubic → power2.inOut · back (c1 = 1.7) → back.out(1.7)
const OUT = "power2.out";
const IN_OUT = "power2.inOut";
const BACK = "back.out(1.7)";

type Point = { x: number; y: number };
type Target = Point | Element;
type ParticleKind = "heart" | "star" | "spark" | "z";
type Particle = {
  kind: ParticleKind;
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

const BLINKABLE: EyeShape[] = ["pill", "wide", "dot", "tired", "heart", "star"];

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
  hand: number;
  jaw: number;
  smile: number;
  blushBoost: number;
  dance: number;
  wait: number;
};

const NEUTRAL: Partial<Fx> = { x: 0, y: 0, sx: 1, sy: 1, rot: 0, pop: 1, hand: 0, jaw: 0, smile: 0, blushBoost: 0 };

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
  private tintRGB: [number, number, number] = [...STATES.idle.tint];
  private glowRGB: [number, number, number] = [...STATES.idle.glow];
  private blush = STATES.idle.blush;
  private eyeScale = 1;

  private fx: Fx = { x: 0, y: 0, sx: 1, sy: 1, rot: 0, roll: 0, lidL: 1, lidR: 1, morph: 1, pop: 1, hand: 0, jaw: 0, smile: 0, blushBoost: 0, dance: 0, wait: 0 };
  private prevFy = 0;
  private eyeL: EyeShape = "pill";
  private eyeR: EyeShape = "pill";
  private emoteEyes = false;

  // زنبركات
  private cloth = { x: 0, v: 0 };
  private clothLift = { x: 0, v: 0 };
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
  private pose = { cx: 0, groundY: 0, x: 0, y: 0, rot: 0, sx: 1, sy: 1, roll: 0 };
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

    if (name === "error") this.triggerEmote("shake", { sound: true });
    if (name === "happy") this.triggerEmote("hop");
    if (name === "sleeping") {
      const z = () => {
        this.spawn("z", 2, LOOK.ink, { fromSide: true });
        this.stateCalls.push(gsap.delayedCall(2.6, z));
      };
      this.stateCalls.push(gsap.delayedCall(0.8, z));
    }
  }

  triggerEmote(name: EmoteName, opts: EmoteOptions = {}) {
    const tl = this.startEmote();
    const m = this.reduced ? 0 : 1; // حركة كبيرة؟ بتتلغي مع «تقليل الحركة»
    const play = (k: SoundKind) => opts.sound && this.play(k);

    switch (name) {
      case "hop":
        play("hop");
        this.hop(tl, 0.2 * m);
        break;

      case "celebrate":
        play("hop");
        tl.call(() => this.setEyes("happy", "happy", true));
        this.hop(tl, 0.24 * m);
        tl.call(() => this.spawn("spark", 6, LOOK.star), [], 0.12);
        tl.to(this.fx, { blushBoost: 0.4, duration: 0.25, ease: OUT }, 0);
        this.endEmote(tl, 0.9);
        break;

      case "love":
        play("love");
        tl.to(this.fx, { sy: 0.92, sx: 1.06, duration: 0.09, ease: OUT });
        tl.call(() => this.setEyes("heart", "heart", true));
        tl.to(this.fx, { blushBoost: 0.6, duration: 0.3, ease: OUT }, "<");
        this.hop(tl, 0.12 * m);
        tl.call(() => this.spawn("heart", 4, LOOK.heart), [], 0.15);
        this.endEmote(tl, 1.5);
        break;

      case "proud":
        play("proud");
        tl.to(this.fx, { sy: 0.94, sx: 1.05, duration: 0.08, ease: OUT });
        tl.call(() => this.setEyes("star", "star", true));
        tl.to(this.fx, { sy: 1.04, sx: 0.97, rot: -0.14, duration: 0.35, ease: BACK });
        tl.call(() => this.spawn("star", 4, LOOK.star), [], "<");
        this.endEmote(tl, 1.4);
        break;

      case "surprised":
        play("hop");
        tl.call(() => this.setEyes("dot", "dot", true));
        tl.to(this.fx, { pop: 1.25, jaw: 0.55, duration: 0.12, ease: OUT });
        this.hop(tl, 0.3 * m, "<");
        this.endEmote(tl, 0.8);
        break;

      case "yawn":
        tl.call(() => this.setEyes("tired", "tired", false));
        tl.to(this.fx, { sy: 1 + 0.12 * (m || 0.4), sx: 1 - 0.06 * (m || 0.4), jaw: 1, duration: 0.55, ease: IN_OUT });
        tl.to(this.fx, { duration: 0.7 }); // hold
        tl.call(() => this.setEyes("closed", "closed", true));
        tl.to(this.fx, { sy: 1, sx: 1, jaw: 0, duration: 0.45, ease: OUT });
        tl.call(() => this.spawn("z", 2, LOOK.ink, { fromSide: true }));
        this.endEmote(tl, 1.4);
        break;

      case "wink":
        play("tap");
        tl.call(() => this.setEyes(this.eyeL, "happy", true));
        tl.to(this.fx, { rot: 0.07, smile: 1, duration: 0.25, ease: BACK }, 0);
        tl.call(() => this.spawn("spark", 1, LOOK.star), [], 0.1);
        this.endEmote(tl, 0.55);
        break;

      case "annoyed":
        tl.to(this.fx, { sy: 0.95, sx: 1.05, rot: -0.05, duration: 0.18, ease: OUT });
        tl.call(() => this.setEyes("line", "line", true), [], 0.05);
        this.endEmote(tl, 1.3);
        break;

      case "dizzy": {
        play("dizzy");
        tl.call(() => this.setEyes("spiral", "spiral", true));
        if (m) {
          tl.to(this.fx, { sy: 0.9, sx: 1.08, duration: 0.1, ease: OUT });
          tl.to(this.fx, { roll: Math.PI * 4, y: -0.12, sy: 1, sx: 1, duration: 1.3, ease: IN_OUT });
          tl.set(this.fx, { roll: 0 });
          tl.to(this.fx, { y: 0, duration: 0.35, ease: BACK });
          tl.to(this.fx, { rot: 0.08, duration: 0.25, ease: IN_OUT, yoyo: true, repeat: 3 });
        } else {
          tl.to(this.fx, { duration: 1.6 });
        }
        this.endEmote(tl, 0.5);
        break;
      }

      case "wave":
        play("greet");
        tl.call(() => this.setEyes("happy", "happy", true));
        tl.to(this.fx, { hand: 1, smile: 1, duration: 0.18, ease: OUT });
        tl.to(this.fx, { duration: 1.3 });
        tl.to(this.fx, { hand: 0, smile: 0, duration: 0.3, ease: IN_OUT });
        this.endEmote(tl, 0);
        break;

      case "shake":
        play("error");
        if (m) {
          tl.to(this.fx, { x: 0.08, duration: 0.05, ease: OUT })
            .to(this.fx, { x: -0.08, duration: 0.07, ease: IN_OUT })
            .to(this.fx, { x: 0.05, duration: 0.07, ease: IN_OUT })
            .to(this.fx, { x: 0, duration: 0.09, ease: OUT });
        }
        this.endEmote(tl, 0.2);
        break;
    }
  }

  greet() {
    this.triggerEmote("wave", { sound: true });
    if (!this.reduced) this.emoteTl?.add(this.hopTl(0.1), 0.05);
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
      // لفّة اتقطعت في النص: نكمّلها لأقرب صفر من مكانها، من غير قفزة
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

  /** نطة: استعداد صغير، طلوع 150ms (out)، نزول 300ms (back)، وضغطة وقت الهبوط. */
  private hopTl(h: number) {
    const tl = gsap.timeline();
    if (!h) return tl;
    // الضغطة وقت الهبوط على قد النطة، والحجم ثابت تقريباً (sx·sy ≈ 1)
    const k = clamp(h / 0.2, 0.4, 1.3);
    tl.to(this.fx, { sy: 0.92, sx: 1.06, duration: 0.07, ease: OUT })
      .to(this.fx, { y: -h, sy: 1.05, sx: 0.96, duration: 0.15, ease: OUT })
      .to(this.fx, { y: 0, sy: 1, sx: 1, duration: 0.3, ease: BACK })
      .to(this.fx, { sy: 1 - 0.18 * k, sx: 1 + 0.14 * k, duration: 0.07, ease: OUT }, "-=0.2")
      .to(this.fx, { sy: 1 + 0.08 * k, sx: 1 - 0.04 * k, duration: 0.13, ease: OUT })
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
    if (soft) gsap.fromTo(this.fx, { morph: 0.72 }, { morph: 1, duration: 0.3, ease: BACK, overwrite: "auto" });
  }

  // ── الرمش ────────────────────────────────────────────────────────────────

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
    // ضغطة: تتهرس (حجم ثابت تقريباً) + تعبير + صوت
    this.play("tap");
    gsap
      .timeline()
      .to(this.fx, { sy: 0.78, sx: 1.16, duration: 0.07, ease: OUT })
      .to(this.fx, { sy: 1.1, sx: 0.95, duration: 0.13, ease: OUT })
      .to(this.fx, { sy: 1, sx: 1, duration: 0.17, ease: OUT });
    const pick = (["wink", "love", "happy"] as const)[Math.floor(Math.random() * 3)];
    if (pick === "happy") {
      const tl = this.startEmote();
      tl.call(() => this.setEyes("happy", "happy", true), [], 0.07);
      tl.to(this.fx, { smile: 1, blushBoost: 0.35, duration: 0.2, ease: OUT }, 0.07);
      this.endEmote(tl, 0.5);
    } else {
      this.later(0.2, () => this.triggerEmote(pick));
    }
  };

  private hit(px: number, py: number) {
    const p = this.pose;
    const rx = LOOK.rx * this.R;
    const ry = LOOK.ry * this.R;
    let [x, y] = rot2(px - (p.cx + p.x), py - (p.groundY + p.y), -p.rot);
    x /= p.sx;
    y = y / p.sy + ry;
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
          greet: [600, 900, 0.16, "sine"],
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

  private spawn(kind: ParticleKind, count: number, color: string, opts: { fromSide?: boolean } = {}) {
    const R = this.R;
    const k = R / 72;
    for (let i = 0; i < count; i++) {
      this.later(i * 0.14, () => {
          const p = this.pose;
          const top = p.groundY + p.y - LOOK.ry * R * 2 * p.sy;
          const side = opts.fromSide;
          this.particles.push({
            kind,
            color,
            x: p.cx + p.x + (side ? LOOK.rx * R * 0.55 + i * 0.12 * R : rand(-0.7, 0.7) * R),
            y: top + (side ? 0.15 * R : rand(-0.05, 0.15) * R),
            vx: (side ? rand(6, 14) : rand(-12, 12)) * k,
            vy: -rand(26, 42) * k * (this.reduced ? 0.25 : 1),
            age: 0,
            life: rand(1.3, 1.8),
            size: (kind === "z" ? rand(0.2, 0.26) : rand(0.13, 0.19)) * R,
            rot: rand(-0.3, 0.3),
            vr: rand(-0.6, 0.6),
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
    const cyCss = this.size / 2 + LOOK.drop * this.R;
    return { x: rect.left + (this.size / 2) * k, y: rect.top + cyCss * k };
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
      tPitch = 0.32;
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
    this.tilt = approach(this.tilt, asleep ? 0.05 : 0.07 * lx, 0.0008, dt);

    // الألوان
    this.glow = approach(this.glow, look.glowAmount, 0.002, dt);
    this.tint = approach(this.tint, look.tintAmount, 0.002, dt);
    this.blush = approach(this.blush, Math.min(1, look.blush + this.fx.blushBoost), 0.002, dt);
    this.eyeScale = approach(this.eyeScale, look.eyeScale, 0.0025, dt);
    for (let i = 0; i < 3; i++) {
      this.tintRGB[i] = approach(this.tintRGB[i], look.tint[i], 0.002, dt);
      this.glowRGB[i] = approach(this.glowRGB[i], look.glow[i], 0.002, dt);
    }

    // زنبركات: طرفين العصابة (k=60, c=9) بيتأخروا عن لفّة الراس وعن الطلوع والنزول
    const fyVel = (this.fx.y - this.prevFy) / dt;
    this.prevFy = this.fx.y;
    const spring = (s: { x: number; v: number }, target: number, k: number, c: number) => {
      s.v += (k * (target - s.x) - c * s.v) * dt;
      s.x += s.v * dt;
    };
    spring(this.cloth, clamp(-yawVel * 0.35 - this.tilt * 2 - this.fx.rot * 2, -1, 1), 60, 9);
    spring(this.clothLift, clamp(fyVel * 0.25, -1, 1), 60, 9);
    // الفك: ω0 = 2π/0.25s, ζ = 0.6
    const w0 = (Math.PI * 2) / 0.25;
    this.jaw.v += (w0 * w0 * (this.fx.jaw - this.jaw.x) - 2 * 0.6 * w0 * this.jaw.v) * dt;
    this.jaw.x += this.jaw.v * dt;

    // الجزيئات
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

    // ── تركيب الحركة: keyframes + تنفس + رقص + انتظار ──
    let sxB: number;
    let syB: number;
    if (this.state === "sleeping") {
      syB = 1 + 0.035 * Math.sin(1.8 * t);
      sxB = 1 - 0.02 * Math.sin(1.8 * t);
    } else {
      // تنفس خفيف، والعرض متأخر عن الطول (مش متزامنين)
      syB = 1 + 0.012 * Math.sin(2.1 * t);
      sxB = 1 - 0.008 * Math.sin(2.1 * t + 0.6);
    }
    let dx = 0;
    let dy = 0;
    let drot = 0;
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
    if (fx.hand > 0.001) drot += (-0.06 + 0.07 * Math.sin(Math.PI * 2 * 1.2 * t)) * fx.hand;

    const cx = size / 2;
    const groundY = size / 2 + LOOK.drop * R + ry;
    const x = fx.x * R + dx;
    const y = fx.y * R + dy;
    const sx = fx.sx * sxB * dsx;
    const sy = fx.sy * syB * dsy;
    const rot = this.tilt + fx.rot + drot;
    const roll = fx.roll;
    this.pose = { cx, groundY, x, y, rot, sx, sy, roll };
    const lift = clamp(-y / R, 0, 0.6);

    // ── ظل التلامس (ناعم، مش drop shadow) ──
    ctx.save();
    ctx.translate(cx + x, groundY + 0.03 * R);
    ctx.scale(1, 0.13);
    const sr = rx * 0.95 * sx * (1 - lift * 0.45);
    const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, sr);
    sg.addColorStop(0, `rgba(40, 28, 20, ${0.2 * (1 - lift)})`);
    sg.addColorStop(1, "rgba(40, 28, 20, 0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(0, 0, sr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ── التوهج ورا الشخصية بلون الحالة ──
    const gcy = groundY + y - ry * sy;
    const gg = ctx.createRadialGradient(cx + x, gcy, 0, cx + x, gcy, 1.8 * R);
    gg.addColorStop(0, rgba(this.glowRGB, this.glow * 0.55));
    gg.addColorStop(1, rgba(this.glowRGB, 0));
    ctx.fillStyle = gg;
    ctx.fillRect(0, 0, size, size);

    // ── الجسم ──
    ctx.save();
    ctx.translate(cx + x, groundY + y);
    ctx.rotate(rot);
    ctx.scale(sx, sy);
    ctx.translate(0, -ry);
    ctx.rotate(roll);
    const world = rot + roll; // النور ثابت في العالم: نلف نقطه عكس لفّة الجسم

    const band = this.bandGeometry(rx, ry);
    if (!band.knot.visible) this.drawTails(band, world);

    this.bodyPath(rx, ry);
    const [l1x, l1y] = rot2(0.62 * rx, -0.88 * ry, -world);
    const [l2x, l2y] = rot2(-0.78 * rx, 0.95 * ry, -world);
    const bg = ctx.createLinearGradient(l1x, l1y, l2x, l2y);
    bg.addColorStop(0, LOOK.bodyLight);
    bg.addColorStop(1, LOOK.bodyDark);
    ctx.fillStyle = bg;
    ctx.fill();

    ctx.save();
    ctx.clip();
    // لون الحالة من تحت لفوق (مش إعادة دهان)
    if (this.tint > 0.005) {
      const tg = ctx.createLinearGradient(0, ry, 0, -ry);
      tg.addColorStop(0, rgba(this.tintRGB, 0.72 * this.tint));
      tg.addColorStop(1, rgba(this.tintRGB, 0));
      ctx.fillStyle = tg;
      ctx.fillRect(-rx * 1.3, -ry * 1.3, rx * 2.6, ry * 2.6);
    }
    this.drawBand(band, world);
    // ظل الحافة (بيغمّق العصابة كمان عند الأطراف)
    ctx.save();
    ctx.scale(1, ry / rx);
    const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 1.1);
    rg.addColorStop(0, "rgba(0,0,0,0)");
    rg.addColorStop(0.6, "rgba(0,0,0,0)");
    rg.addColorStop(1, LOOK.rim);
    ctx.fillStyle = rg;
    ctx.fillRect(-rx * 1.2, -rx * 1.2, rx * 2.4, rx * 2.4);
    ctx.restore();
    // لمعة واحدة ناحية النور
    const [hx, hy] = rot2(0.34 * rx, -0.46 * ry, -world);
    const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 0.42 * R);
    hg.addColorStop(0, "rgba(255,255,255,0.55)");
    hg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = hg;
    ctx.fillRect(-rx, -ry, rx * 2, ry * 2);

    this.drawBlush(rx, ry);
    this.drawEyes(rx, ry);
    this.drawMouth(rx, ry);
    ctx.restore(); // clip
    if (band.knot.visible) this.drawTails(band, world);
    if (fx.hand > 0.01) this.drawHand(rx, ry, world);
    ctx.restore(); // body

    this.drawParticles();
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

  private drawBlush(rx: number, ry: number) {
    if (this.blush < 0.01) return;
    const { ctx, R } = this;
    const b = LOOK.blushSpot;
    for (const s of [-1, 1]) {
      const f = this.feature(s * b.yaw, b.pitch, rx, ry);
      if (!f.visible) continue;
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.scale(f.kx * (b.w / b.h), f.ky);
      const r = b.h * R;
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, rgba(LOOK.blush, 0.5 * this.blush));
      g.addColorStop(1, rgba(LOOK.blush, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawEyes(rx: number, ry: number) {
    const { R, fx } = this;
    const e = LOOK.eye;
    const w = e.w * R * this.eyeScale * fx.pop;
    const h = e.h * R * this.eyeScale * fx.pop * fx.morph;
    for (const s of [-1, 1] as const) {
      const f = this.feature(s * e.yaw, e.pitch, rx, ry);
      if (!f.visible) continue;
      const shape = s < 0 ? this.eyeL : this.eyeR;
      const open = s < 0 ? fx.lidL : fx.lidR;
      this.ctx.save();
      this.ctx.translate(f.x, f.y);
      this.ctx.scale(f.kx, f.ky);
      this.drawEye(shape, w, h, open, s);
      this.ctx.restore();
    }
  }

  private drawEye(shape: EyeShape, w: number, h: number, open: number, side: -1 | 1) {
    const { ctx } = this;
    ctx.fillStyle = LOOK.ink;
    ctx.strokeStyle = LOOK.ink;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const pill = (pw: number, ph: number, dy = 0) => {
      ctx.beginPath();
      ctx.roundRect(-pw / 2, -ph / 2 + dy, pw, ph, Math.min(pw, ph) / 2);
      ctx.fill();
    };
    switch (shape) {
      case "pill":
        pill(w, Math.max(h * open, w * 0.16));
        break;
      case "wide":
        pill(w * 1.12, Math.max(h * 1.22 * open, w * 0.16));
        break;
      case "dot": {
        const r = w * 0.36;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, Math.max(r * open, r * 0.12), 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "tired": {
        const th = Math.max(h * 0.55 * open, w * 0.16);
        ctx.beginPath();
        ctx.roundRect(-w / 2, h / 2 - th, w, th, [w * 0.12, w * 0.12, w / 2, w / 2]);
        ctx.fill();
        break;
      }
      case "line":
        ctx.save();
        ctx.rotate(side * 0.16); // الطرف الداخلي لتحت = متضايق
        pill(w * 1.18, h * 0.17, -h * 0.05);
        ctx.restore();
        break;
      case "flat":
        pill(w * 1.12, h * 0.15, h * 0.08);
        break;
      case "happy":
        ctx.lineWidth = w * 0.3;
        ctx.beginPath();
        ctx.arc(0, h * 0.18, w * 0.42, Math.PI * 1.12, Math.PI * 1.88);
        ctx.stroke();
        break;
      case "closed":
        ctx.lineWidth = w * 0.24;
        ctx.beginPath();
        ctx.arc(0, -h * 0.05, w * 0.42, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
        break;
      case "spiral": {
        ctx.lineWidth = w * 0.13;
        ctx.beginPath();
        const turns = 2.2;
        const spin = this.t * 7 * side;
        for (let i = 0; i <= 60; i++) {
          const k = i / 60;
          const a = k * turns * Math.PI * 2 + spin;
          const r = k * w * 0.55;
          if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.stroke();
        break;
      }
      case "heart":
        ctx.fillStyle = LOOK.heart;
        this.heartPath(w * 1.25 * Math.max(open, 0.25));
        ctx.fill();
        break;
      case "star":
        ctx.fillStyle = LOOK.star;
        ctx.strokeStyle = LOOK.star;
        ctx.lineWidth = w * 0.12;
        this.starPath(w * 0.72, 5, 0.46, this.t * 0.8 * side);
        ctx.fill();
        ctx.stroke();
        break;
    }
  }

  private drawMouth(rx: number, ry: number) {
    const { ctx, R, fx } = this;
    const jaw = clamp(this.jaw.x, 0, 1.3);
    if (jaw < 0.03 && fx.smile < 0.03) return;
    const f = this.feature(0, LOOK.mouth.pitch, rx, ry);
    if (!f.visible) return;
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.scale(f.kx, f.ky);
    if (jaw >= 0.03) {
      ctx.fillStyle = LOOK.ink;
      ctx.beginPath();
      ctx.ellipse(0, jaw * 0.04 * R, (0.06 + 0.035 * jaw) * R, 0.11 * R * jaw, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = `rgba(26, 20, 18, ${fx.smile})`;
      ctx.lineWidth = 0.045 * R;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(0, -0.04 * R, 0.08 * R, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * العصابة: حلقة على الحجم عند ارتفاع ثابت. نص قطرها من ringR(y) = (1 − |y|^n)^(1/n)،
   * ومتشافة من فوق شوية، وبتتبع 40% بس من ميلة الراس عشان ما تتقلبش.
   */
  private bandGeometry(rx: number, ry: number) {
    const B = LOOK.band;
    const ring = Math.pow(1 - Math.pow(Math.abs(B.height), LOOK.n), 1 / LOOK.n);
    const a = ring * rx * 1.02;
    const view = B.view - 0.4 * this.pitch;
    const b = Math.max(0.04, ring * ry * Math.sin(view));
    const frontY = -Math.sin(Math.asin(-B.height) + 0.4 * this.pitch) * ry;
    const cy = frontY - b;
    const th = B.thickness * this.R;
    const k = B.knotYaw + this.yaw;
    const knot = {
      x: Math.sin(k) * a,
      y: cy + Math.cos(k) * b + th / 2,
      depth: Math.cos(k),
      visible: Math.cos(k) > -0.15,
    };
    return { a, b, cy, th, knot };
  }

  private bandFill(x1: number, y1: number, x2: number, y2: number, world: number) {
    const [p1x, p1y] = rot2(x1, y1, -world);
    const [p2x, p2y] = rot2(x2, y2, -world);
    const g = this.ctx.createLinearGradient(p1x, p1y, p2x, p2y);
    g.addColorStop(0, LOOK.bandLight);
    g.addColorStop(1, LOOK.bandDark);
    return g;
  }

  private drawBand(band: ReturnType<MascotEngine["bandGeometry"]>, world: number) {
    const { ctx, R } = this;
    const { a, b, cy, th, knot } = band;
    ctx.beginPath();
    ctx.ellipse(0, cy, a, b, 0, 0, Math.PI);
    ctx.ellipse(0, cy + th, a, b, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fillStyle = this.bandFill(a * 0.6, cy - th, -a, cy + th * 2, world);
    ctx.fill();
    // حافة سفلية أغمق سنة: سُمك من غير خط
    ctx.beginPath();
    ctx.ellipse(0, cy + th, a, b, 0, 0, Math.PI);
    ctx.ellipse(0, cy + th * 0.82, a, b, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fillStyle = "rgba(150, 70, 0, 0.18)";
    ctx.fill();
    if (knot.visible) {
      const r = LOOK.band.knot * R;
      const kx = Math.max(0.35, knot.depth);
      ctx.save();
      ctx.translate(knot.x, knot.y);
      ctx.scale(kx, 1);
      ctx.beginPath();
      ctx.roundRect(-r, -r * 0.95, r * 2, r * 1.9, r * 0.7);
      ctx.fillStyle = this.bandFill(r, -r, -r, r, world);
      ctx.fill();
      ctx.fillStyle = "rgba(150, 70, 0, 0.16)";
      ctx.fill();
      ctx.restore();
    }
  }

  /** طرفين العصابة: شرايط قماش طرية من العقدة، آخرها مقصوص V، بتتمرجح بزنبرك وبتتنطط مع النطة. */
  private drawTails(band: ReturnType<MascotEngine["bandGeometry"]>, world: number) {
    const { ctx, R } = this;
    const { knot } = band;
    const swing = this.cloth.x;
    const lift = this.clothLift.x;
    const side = knot.x < 0 ? -1 : 1;
    const persp = 0.7 + 0.3 * Math.abs(Math.sin(LOOK.band.knotYaw + this.yaw));
    ctx.save();
    ctx.translate(knot.x, knot.y);
    LOOK.band.tails.forEach((tail, i) => {
      const L = tail.length * R * persp;
      const w = tail.width * R;
      // الزاوية من «لتحت»: موجبة = ناحية برّه
      const ang = side * (tail.angle + swing * 0.5 * (i ? 1.25 : 1) - lift * 0.3);
      const bend = side * (swing * 0.55 + Math.sin(this.t * 2.1 + i * 1.9) * 0.05);
      // منحنى الشريط: نقطة نص بتتأخر عن الطرف (bend) فيتلوى
      const p0 = [0, 0];
      const p1 = [Math.sin(ang) * L * 0.5, Math.cos(ang) * L * 0.5];
      const p2 = [Math.sin(ang + bend) * L, Math.cos(ang + bend) * L];
      const at = (u: number) => {
        const a = (1 - u) * (1 - u);
        const b = 2 * (1 - u) * u;
        const c = u * u;
        const x = a * p0[0] + b * p1[0] + c * p2[0];
        const y = a * p0[1] + b * p1[1] + c * p2[1];
        const dx = 2 * (1 - u) * (p1[0] - p0[0]) + 2 * u * (p2[0] - p1[0]);
        const dy = 2 * (1 - u) * (p1[1] - p0[1]) + 2 * u * (p2[1] - p1[1]);
        const m = Math.hypot(dx, dy) || 1;
        return { x, y, nx: -dy / m, ny: dx / m, tx: dx / m, ty: dy / m };
      };
      const N = 14;
      const left: [number, number][] = [];
      const right: [number, number][] = [];
      for (let k = 0; k <= N; k++) {
        const u = k / N;
        const q = at(u);
        const half = (w / 2) * (0.75 + 0.35 * u); // بيوسع شوية ناحية الطرف
        left.push([q.x + q.nx * half, q.y + q.ny * half]);
        right.push([q.x - q.nx * half, q.y - q.ny * half]);
      }
      const end = at(1);
      const notch = [end.x - end.tx * w * 0.45, end.y - end.ty * w * 0.45];
      ctx.beginPath();
      ctx.moveTo(left[0][0], left[0][1]);
      left.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.lineTo(notch[0], notch[1]);
      for (let k = right.length - 1; k >= 0; k--) ctx.lineTo(right[k][0], right[k][1]);
      ctx.closePath();
      ctx.lineJoin = "round";
      ctx.fillStyle = this.bandFill(p2[0] + R * 0.2, p2[1] - R * 0.3, -R * 0.1, R * 0.15, world);
      ctx.fill();
      // الشريط اللي ورا أغمق سنة
      if (i === 1) {
        ctx.fillStyle = "rgba(150, 70, 0, 0.16)";
        ctx.fill();
      }
    });
    ctx.restore();
  }

  /** الإيد: كفّ صغير بيطلع على جنب الجسم ناحية النور ويسلّم (13 rad/s)، بظل ناعم تحته. */
  private drawHand(rx: number, ry: number, world: number) {
    const { ctx, R, fx } = this;
    const k = fx.hand;
    const hx = rx * (0.78 + 0.22 * k);
    const hy = ry * (0.3 - 0.55 * k);
    const w = LOOK.hand.w * R;
    const h = LOOK.hand.h * R;
    const a = 0.35 + (-0.25 + 0.38 * Math.sin(13 * this.t)) * k;
    ctx.save();
    ctx.globalAlpha = Math.min(1, k * 3);
    // ظل التلامس على الجسم
    ctx.save();
    this.bodyPath(rx, ry);
    ctx.clip();
    const sg = ctx.createRadialGradient(hx - w * 0.5, hy + h * 0.5, 0, hx - w * 0.5, hy + h * 0.5, h * 1.5);
    sg.addColorStop(0, "rgba(58, 38, 28, 0.2)");
    sg.addColorStop(1, "rgba(58, 38, 28, 0)");
    ctx.fillStyle = sg;
    ctx.fillRect(hx - h * 2.5, hy - h * 1.5, h * 4, h * 4);
    ctx.restore();
    ctx.translate(hx, hy);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    const [l1x, l1y] = rot2(w, -h, -(world + a));
    const [l2x, l2y] = rot2(-w, h, -(world + a));
    const g = ctx.createLinearGradient(l1x, l1y, l2x, l2y);
    g.addColorStop(0, LOOK.bodyLight);
    g.addColorStop(1, LOOK.bodyDark);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  private drawParticles() {
    const { ctx } = this;
    for (const p of this.particles) {
      const k = p.age / p.life;
      const a = k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8;
      const s = 1 + 0.4 * k;
      ctx.save();
      ctx.globalAlpha = clamp(a, 0, 1) * (p.kind === "z" ? 0.7 : 1);
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
        case "z":
          ctx.font = `700 ${p.size}px "Alexandria Variable", system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("z", 0, 0);
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
