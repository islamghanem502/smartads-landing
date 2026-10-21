import { Cam, clamp, facing, fillet, fit, hull, open, poly, proj, rad, ringAt, rrect, run, seg, type Projector, type Ring, type Sample, type Vec2 } from "../core/iso";
import { tdone, tset, tval, tween, type Tween } from "../core/motion";
import { disposer, mk, pointer, register, type FigureMount } from "../core/stage";

/**
 * Creatives: a tray of six portrait ad cards, the shape a story ad takes. Each
 * card has its picture, a button along its foot, and the story bar across its
 * head, cut into as many segments as its place in the tray. The card under the
 * pointer stands up and lifts; the ones in front lean forward and the ones
 * behind lean back, staggered outwards from it. The slider is the stagger.
 *
 * Borrowed from Riffle: discrete items on tweens, and a hit test on static
 * bands along the resting top edges.
 */

const N = 6, W = 50, H = 80, G = 12, TK = 1.4;
const REST = -11, BACK = -22, FWD = 18, LIFT = 14;
const X0 = -5, X1 = W + 5, Y0 = -9, Y1 = (N - 1) * G + 9, WH = 14, WR = 6, WT = 2.4;

export const range = [0, 40, 90] as const;

const LR = (pts: Vec2[]) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());
const SHAPE = fillet([[0, 0], [W, 0], [W, H], [0, H]], [4, 4, 4, 4]);
const PIC = rrect(4, 17, W - 4, H - 11, 2, 3);
const BTN = rrect(6, 5, W - 6, 11.5, 3.25, 4);

function frame() {
  const C = Cam(45, 0.5, 1.46);
  fit(C, [[X0, Y0, 0], [X1, Y1, -8], [X1, Y0, 0], [X0, Y1, 0], [X0, Y0, H], [X1, Y0, H + LIFT]], 200, 166);
  return C;
}

/** The resting top edge of card i, where its hit band runs. */
const topOf = (P: Projector, i: number) => P(W / 2, i * G + H * Math.sin(rad(REST)), H * Math.cos(rad(REST)));

export const stops: (Vec2 | null)[] = (() => {
  const P = proj(frame());
  return [topOf(P, 1), topOf(P, 3), topOf(P, 5), null];
})();

function tray(P: Projector, front: (q: Sample) => boolean, outer: Ring, inner: Ring) {
  const far: [string, string][] = [
    [poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WH)))), "sil"],
    [poly(ringAt(P, inner, WH)), "nf"],
    [open(ringAt(P, run(inner, (q) => !front(q)), 2.5)), "nf lo"],
  ];
  const iF = LR(ringAt(P, run(inner, front), WH)), oT = LR(ringAt(P, run(outer, front), WH)), oB = LR(ringAt(P, run(outer, front), 0));
  const near: [string, string][] = [
    [poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), "fo"],
    [open(oT), "nf lo"],
    [open(iF), "nf"],
    [open([oT[0], ...oB, oT[oT.length - 1]]), "nf sil"],
  ];
  return { far, near };
}

/** Card i leaning th degrees (negative leans back) and lifted by `lift`. */
function pose(P: Projector, i: number, th: number, lift: number, segs: number) {
  const yb = i * G, s = Math.sin(rad(th)), c = Math.cos(rad(th));
  const w = (u: number, v: number) => P(u, yb + v * s, v * c + lift);
  const wb = (u: number, v: number) => P(u, yb + v * s - TK * c, v * c + TK * s + lift);
  // the story bar: segs segments across the head, with a gap between each
  const gap = 2, len = (W - 10 - gap * (segs - 1)) / segs;
  let bar = "";
  for (let k = 0; k < segs; k++) bar += seg(w(5 + k * (len + gap), H - 5), w(5 + k * (len + gap) + len, H - 5));
  return {
    back: poly(SHAPE.map((p) => wb(p[0], p[1]))),
    face: poly(SHAPE.map((p) => w(p[0], p[1]))),
    pic: poly(PIC.map((q) => w(q.u, q.v))),
    btn: poly(BTN.map((q) => w(q.u, q.v))),
    bar,
  };
}

export const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer();
  let stag = value;
  const C = frame(), P = proj(C), front = facing(C);
  const outer = rrect(X0, Y0, X1, Y1, WR, 6), inner = rrect(X0 + WT, Y0 + WT, X1 - WT, Y1 - WT, WR - WT, 6);
  const paths = tray(P, front, outer, inner);

  const g = mk("g", {}, svg);
  for (const [d, cls] of paths.far) mk("path", { d, class: cls }, g);

  type Card = { segs: number; back: SVGPathElement; face: SVGPathElement; pic: SVGPathElement; btn: SVGPathElement; bar: SVGPathElement; a: Tween; z: Tween };
  const cards: Card[] = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", {}, g);
    cards.push({
      segs: N - i,
      back: mk("path", { class: "lo" }, grp),
      face: mk("path", { class: "sil" }, grp),
      pic: mk("path", { class: "nf lo" }, grp),
      btn: mk("path", { class: "nf" }, grp),
      bar: mk("path", { class: "nf lo" }, grp),
      a: tween(REST), z: tween(0),
    });
  }
  for (const [d, cls] of paths.near) mk("path", { d, class: cls }, g);

  // hit bands along the RESTING top edges: they never move, and nothing draws them
  const c0 = topOf(P, 0), c1 = topOf(P, 1), d = [c1[0] - c0[0], c1[1] - c0[1]];
  const px0 = P(0, 0, 0), px1 = P(1, 0, 0), ex = [px1[0] - px0[0], px1[1] - px0[1]];
  const HALF = W / 2 + 6, det = d[0] * ex[1] - d[1] * ex[0];
  function hit([x, y]: Vec2) {
    const qx = x - c0[0], qy = y - c0[1];
    const s = (qx * ex[1] - qy * ex[0]) / det, r = (d[0] * qy - d[1] * qx) / det;
    if (Math.abs(r) > HALF || s < -0.5 || s > N + 1) return -1;
    return clamp(Math.round(s), 0, N - 1);
  }

  function draw(i: number, th: number, lift: number) {
    const cd = cards[i], q = pose(P, i, th, lift, cd.segs);
    cd.back.setAttribute("d", q.back);
    cd.face.setAttribute("d", q.face);
    cd.pic.setAttribute("d", q.pic);
    cd.btn.setAttribute("d", q.btn);
    cd.bar.setAttribute("d", q.bar);
  }

  const L = register(stage, (_dt, now) => {
    let moving = false;
    cards.forEach((cd, i) => { draw(i, tval(cd.a, now), tval(cd.z, now)); if (!tdone(cd.a, now) || !tdone(cd.z, now)) moving = true; });
    return moving;
  });
  bag.add(L.unregister);

  let act = -2;
  function setActive(a: number) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(0, act);
    act = a;
    cards.forEach((cd, i) => {
      const delay = Math.abs(i - from) * stag;
      tset(cd.a, a < 0 ? REST : i < a ? BACK : i > a ? FWD : 0, now, delay);
      tset(cd.z, a === i ? LIFT : 0, now, delay);
      cd.face.classList.toggle("hi", i === a);
      // at rest the front card's button is the one bright mark
      cd.btn.classList.toggle("hi", a < 0 ? i === N - 1 : i === a);
      cd.bar.classList.toggle("lo", i !== a);
    });
    read.textContent = a < 0 ? "rest" : String(N - a).padStart(2, "0");
    L.wake();
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { stag = v; }, destroy: bag.dispose };
};
