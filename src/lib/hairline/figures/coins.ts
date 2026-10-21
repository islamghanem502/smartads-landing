import { Cam, circ, facing, fit, open, prism, proj, ringAt, rings, run, type Ring, type Vec2, type Vec3 } from "../core/iso";
import { tdone, tset, tval, tween, type Tween } from "../core/motion";
import { disposer, mk, pointer, put, register, solid, type FigureMount, type Solid } from "../core/stage";
import { slab } from "../slab";

/**
 * Coins: four stacks of coins on a tray, one stack per ad platform. The stack
 * under the pointer takes a share of every coin on the tray, and the others
 * give theirs up in proportion, staggered outwards from it on the 700ms lift
 * curve. The total never changes: the budget moves, it does not grow. At rest
 * the stacks are uneven and the tallest carries the bright edge. The slider is
 * the share the chosen stack takes.
 *
 * The pattern: one of many, on tweens. A hit test on the stacks' resting
 * centres along the row, so a stack growing under the pointer cannot flip it.
 */

const N = 4, D = 38, R = 14, CT = 4.6, B = 2.4, STEP = 55;
const REST = [4, 8, 3, 6];
const TOTAL = REST.reduce((a, b) => a + b, 0);
const SHARE_MAX = 0.7;
const TX0 = -1.5 * D - 22, TX1 = 1.5 * D + 22, TY0 = -23, TY1 = 23, TH = 5;

export const range = [0.4, 0.55, 0.7] as const;

const xs = Array.from({ length: N }, (_, i) => (i - (N - 1) / 2) * D);
const shift = (ring: Ring, cx: number, cy: number): Ring => ring.map((q) => ({ u: q.u + cx, v: q.v + cy, nu: q.nu, nv: q.nv }));

/** The camera, fitted to the tray with every stack at the tallest it can be. */
function frame() {
  const C = Cam(45, 0.5, 1.9);
  const pts: Vec3[] = [[TX0, TY0, -TH], [TX1, TY1, -TH], [TX1, TY0, -TH], [TX0, TY1, -TH]];
  xs.forEach((x) => pts.push([x - R, -R, SHARE_MAX * TOTAL * CT], [x + R, R, SHARE_MAX * TOTAL * CT]));
  fit(C, pts, 200, 166);
  return C;
}

/** Where the lap stops: the tall stack, the far short one, the near one, then away. */
export const stops: (Vec2 | null)[] = (() => {
  const P = proj(frame());
  return [P(xs[0], 0, REST[0] * CT), P(xs[2], 0, REST[2] * CT), P(xs[3], 0, REST[3] * CT), null];
})();

type Stack = { ring: Ring; inner: Ring; face: Ring; h: Tween; el: Solid; lines: SVGPathElement; drawn: number; cx: number };

export const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer();
  let share = value;

  const C = frame(), P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [tr, ti] = rings(TX0, TY0, TX1, TY1, 12, 2);
  put(solid(g), prism(P, front, tr, ti, -TH, 0));

  // back to front: the row runs down to the right, so ascending x is the paint order
  const stacks: Stack[] = xs.map((x, i) => {
    const ring = shift(circ(R, 48), x, 0), inner = shift(circ(R - B, 48), x, 0);
    const el = solid(g);
    const lines = mk("path", { class: "nf lo" }, el.g);
    return { ring, inner, face: run(ring, front), h: tween(REST[i]), el, lines, drawn: NaN, cx: P(x, 0, REST[i] * CT)[0] };
  });

  function draw(s: Stack, h: number) {
    if (h === s.drawn) return;
    s.drawn = h;
    const top = Math.max(0.6, h) * CT;
    put(s.el, slab(P, front, s.ring, s.inner, 0, top));
    // the coins' edges, one under each coin but the top one
    let d = "";
    for (let k = 1; k * CT < top - 0.6; k++) d += open(ringAt(P, s.face, k * CT));
    s.lines.setAttribute("d", d);
  }

  const L = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of stacks) { draw(s, tval(s.h, now)); if (!tdone(s.h, now)) moving = true; }
    return moving;
  });
  bag.add(L.unregister);

  const tallest = REST.indexOf(Math.max(...REST));
  let act = -2;

  /** Gives stack a its share and splits the rest by the stacks' resting sizes; -1 puts every coin back. */
  function setActive(a: number, force = false) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(0, act);
    act = a;
    const take = a >= 0 ? Math.max(REST[a], share * TOTAL) : 0;
    stacks.forEach((s, i) => {
      const to = a < 0 ? REST[i] : i === a ? take : ((TOTAL - take) * REST[i]) / (TOTAL - REST[a]);
      tset(s.h, to, now, Math.abs(i - from) * STEP);
      s.el.sil.classList.toggle("hi", i === (a < 0 ? tallest : a));
    });
    read.textContent = a < 0 ? "rest" : `${a + 1}·${Math.round((take / TOTAL) * 100)}`;
    L.wake();
  }

  const reach = (stacks[1].cx - stacks[0].cx) * 0.8;
  function hit([x]: Vec2) {
    let best = -1, dist = Infinity;
    stacks.forEach((s, i) => { const d = Math.abs(x - s.cx); if (d < dist) { dist = d; best = i; } });
    return dist <= reach ? best : -1;
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { share = v; if (act >= 0) setActive(act, true); },
    destroy: bag.dispose,
  };
};
