import { Cam, facing, fillet, fit, hull, poly, prism, proj, rad, rings, type Vec2, type Vec3 } from "../core/iso";
import { tdone, tset, tval, tween, type Tween } from "../core/motion";
import { disposer, mk, place, pointer, put, register, solid, type FigureMount } from "../core/stage";

/**
 * Mailboxes: four mailboxes on posts along a kerb, one per ad platform. The
 * box under the pointer raises its flag first, and the others raise theirs
 * after it, staggered outwards: one order, delivered to every box. At rest one
 * flag is up and bright. The slider is the stagger, in ms.
 *
 * The pattern: one of many, on tweens, with a stagger by distance. A hit test
 * on the boxes' resting centres along the row.
 */

const N = 4, D = 42, HW = 9, BH = 9, Y0 = -14, Y1 = 14, PZ = 24, DOOR = 1.5;
const FX = HW + 0.7, PY = Y0 + 5, PZ_F = PZ + 6.5;
const REST = [0, 90, 0, 0], UP = 90;

export const range = [60, 130, 240] as const;

const xs = Array.from({ length: N }, (_, i) => (i - (N - 1) / 2) * D);

/** The box's end profile, in (u across, z up from its floor): flat floor, straight sides, an arched roof. */
const profile = (inset: number): Vec2[] => {
  const r = HW - inset, pts: Vec2[] = [[r, inset]];
  for (let k = 0; k <= 16; k++) { const a = (Math.PI * k) / 16; pts.push([r * Math.cos(a), BH + r * Math.sin(a)]); }
  pts.push([-r, inset]);
  return pts;
};
const PROF = fillet(profile(0), [1.2, ...Array(17).fill(0), 1.2], 3);
const DOORP = fillet(profile(DOOR), [0.8, ...Array(17).fill(0), 0.8], 3);
// the flag in its own plane: an arm along a, the flag standing off it along b
const FLAG = fillet([[-1.6, -1.2], [18, -1.2], [18, 7.5], [11, 7.5], [11, 1.2], [-1.6, 1.2]], [1, 0.8, 1, 0.8, 0.6, 1]);

function frame() {
  const C = Cam(45, 0.5, 1.98);
  const pts: Vec3[] = [];
  xs.forEach((x) => pts.push([x - HW, Y0, -4], [x + HW, Y1, -4], [x - HW, Y1, -4], [x + HW, Y0, -4], [x, PY, PZ_F + 19], [x, PY - 8, PZ_F + 19], [x, Y0, PZ + BH + HW]));
  fit(C, pts, 200, 170);
  return C;
}

export const stops: (Vec2 | null)[] = (() => {
  const P = proj(frame());
  return [P(xs[0], 0, PZ + BH), P(xs[2], 0, PZ + BH), P(xs[3], 0, PZ + BH), null];
})();

export const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer();
  let stag = value;
  const C = frame(), P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [kr, ki] = rings(xs[0] - 18, -11, xs[N - 1] + 18, 11, 9, 2);
  put(solid(g), prism(P, front, kr, ki, -4, 0));

  const boxes = xs.map((x, i) => {
    const [pr, pi] = rings(x - 2.4, -2.4, x + 2.4, 2.4, 1, 0.7);
    put(solid(g), prism(P, front, pr, pi, 0, PZ));
    const at = (y: number) => (q: Vec2) => P(x + q[0], y, PZ + q[1]);
    const body = mk("path", { class: "sil", d: poly(hull(PROF.map(at(Y0)).concat(PROF.map(at(Y1))))) }, g);
    mk("path", { class: "nf", d: poly(PROF.map(at(Y1))) }, g);
    mk("path", { class: "nf lo", d: poly(DOORP.map(at(Y1 + 0.01))) }, g);
    // the door's latch
    const latch = mk("circle", { r: 1.1, class: "dot m" }, g);
    place(latch, P(x, Y1, PZ + BH + HW - 3.2));
    const flag = mk("path", { class: "sil" }, g);
    const pin = mk("circle", { r: 0.9, class: "dot off" }, g);
    place(pin, P(x + FX, PY, PZ_F));
    return { x, body, flag, f: tween(REST[i]), drawn: NaN };
  });

  function drawFlag(b: (typeof boxes)[number], deg: number) {
    if (deg === b.drawn) return;
    b.drawn = deg;
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
    b.flag.setAttribute("d", poly(FLAG.map(([a, k]) => P(b.x + FX, PY + a * c - k * s, PZ_F + a * s + k * c))));
  }

  const L = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of boxes) { drawFlag(b, tval(b.f, now)); if (!tdone(b.f, now)) moving = true; }
    return moving;
  });
  bag.add(L.unregister);

  const lit = REST.indexOf(UP);
  let act = -2;
  function setActive(a: number) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(0, act);
    act = a;
    boxes.forEach((b, i) => {
      tset(b.f, a < 0 ? REST[i] : UP, now, Math.abs(i - from) * stag);
      b.flag.classList.toggle("hi", i === (a < 0 ? lit : a));
    });
    read.textContent = a < 0 ? "rest" : String(a + 1);
    L.wake();
  }

  const cx = xs.map((x) => P(x, 0, PZ + BH)[0]);
  const reach = (cx[1] - cx[0]) * 0.8;
  function hit([x]: Vec2) {
    let best = -1, dist = Infinity;
    cx.forEach((c, i) => { const d = Math.abs(x - c); if (d < dist) { dist = d; best = i; } });
    return dist <= reach ? best : -1;
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { stag = v; }, destroy: bag.dispose };
};
