import { Cam, facing, fillet, fit, hull, open, poly, proj, rad, ringAt, rrect, run, seg, type Projector, type Ring, type Sample, type Vec2 } from "../core/iso";
import { tset, tval, tween, type Tween } from "../core/motion";
import { disposer, mk, register, type FigureMount } from "../core/stage";

/**
 * Publish: the creatives tray, in colour, publishing on its own. Every few
 * seconds the front post stands up, lifts out of the tray and rises off the
 * top of the frame: it has gone to an account. The cards behind it step
 * forward, and the post that left comes back in at the back as the next one.
 * Posts are pictures (a sun over hills) or videos (a play mark).
 *
 * Not one of hairline's quiet figures: it fills its pictures with colour and
 * runs without a pointer, because the page asks it to show publishing happen.
 * The tray and the strokes keep the hairline drawing.
 */

const N = 5, W = 50, H = 80, G = 13, TK = 1.4, PERIOD = 2600;
const REST = -11, FRONT = -3, LIFT = 20, AWAY = 150;
const X0 = -5, X1 = W + 5, Y0 = -9, Y1 = (N - 1) * G + 9, WH = 14, WR = 6, WT = 2.4;

const TONES = [
  { pic: "#cfe5d6", ink: "#2e7d55" },
  { pic: "#f3d3cc", ink: "#b8412f" },
  { pic: "#efe0bb", ink: "#a37a22" },
  { pic: "#d2deee", ink: "#3a669a" },
  { pic: "#e4d6ec", ink: "#7d5a92" },
];
const KINDS = ["img", "vid", "img", "img", "vid"] as const;

export const range = [0, 1, 1] as const;
export const stops = null;

const LR = (pts: Vec2[]) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());
const SHAPE = fillet([[0, 0], [W, 0], [W, H], [0, H]], [4, 4, 4, 4]);
const PIC = rrect(4, 22, W - 4, H - 6, 2, 3);
const HILLS: Vec2[] = [[4, 22], [4, 32], [14, 42], [22, 35], [33, 47], [W - 4, 33], [W - 4, 22]];
const PLAY: Vec2[] = [[W / 2 - 4, 44], [W / 2 - 4, 56], [W / 2 + 6, 50]];

function frame() {
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[X0, Y0, 0], [X1, Y1, -8], [X1, Y0, 0], [X0, Y1, 0], [X0, Y0, H], [X1, Y0, H + LIFT]], 200, 190);
  return C;
}

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

type Card = {
  k: number; grp: SVGGElement; back: SVGPathElement; face: SVGPathElement; pic: SVGPathElement; mark: SVGPathElement; sun: SVGPathElement; text: SVGPathElement;
  s: Tween; a: Tween; z: Tween; o: Tween;
};

export const mount: FigureMount = ({ stage, svg, read }) => {
  const bag = disposer();
  const C = frame(), P = proj(C), front = facing(C);
  const outer = rrect(X0, Y0, X1, Y1, WR, 6), inner = rrect(X0 + WT, Y0 + WT, X1 - WT, Y1 - WT, WR - WT, 6);
  const paths = tray(P, front, outer, inner);

  const g = mk("g", {}, svg);
  for (const [d, cls] of paths.far) mk("path", { d, class: cls }, g);
  const deck = mk("g", {}, g);
  for (const [d, cls] of paths.near) mk("path", { d, class: cls }, g);

  const cards: Card[] = [];
  for (let k = 0; k < N; k++) {
    const t = TONES[k];
    const grp = mk("g", {}, deck);
    cards.push({
      k, grp,
      back: mk("path", { class: "lo" }, grp),
      face: mk("path", { class: "sil", style: "fill:#f4f4f1" }, grp),
      pic: mk("path", { class: "nf", style: `fill:${t.pic};stroke:none` }, grp),
      mark: mk("path", { class: "nf", style: `fill:${t.ink};stroke:none` }, grp),
      sun: mk("path", { class: "nf", style: `fill:#fff;fill-opacity:.85;stroke:none` }, grp),
      text: mk("path", { class: "nf", style: "stroke:#b9b9b2" }, grp),
      s: tween(k), a: tween(k === N - 1 ? FRONT : REST), z: tween(0), o: tween(1, 500),
    });
    // a video's play mark sits on its round, so it is drawn after it
    const c = cards[k];
    if (KINDS[k] === "vid") c.sun.after(c.mark);
  }

  function draw(cd: Card, now: number) {
    const s = tval(cd.s, now), th = tval(cd.a, now), lift = tval(cd.z, now);
    const yb = s * G, sn = Math.sin(rad(th)), cs = Math.cos(rad(th));
    const w = (u: number, v: number) => P(u, yb + v * sn, v * cs + lift);
    const wb = (u: number, v: number) => P(u, yb + v * sn - TK * cs, v * cs + TK * sn + lift);
    cd.back.setAttribute("d", poly(SHAPE.map((p) => wb(p[0], p[1]))));
    cd.face.setAttribute("d", poly(SHAPE.map((p) => w(p[0], p[1]))));
    cd.pic.setAttribute("d", poly(PIC.map((q) => w(q.u, q.v))));
    const vid = KINDS[cd.k] === "vid";
    cd.mark.setAttribute("d", poly((vid ? PLAY : HILLS).map((p) => w(p[0], p[1]))));
    // the sun of a picture, or the round of a video's play mark
    const cx = vid ? W / 2 : W - 13, cy = vid ? 50 : H - 17, r = vid ? 10 : 4.2, ring: Vec2[] = [];
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; ring.push(w(cx + r * Math.cos(a), cy + r * Math.sin(a))); }
    cd.sun.setAttribute("d", poly(ring));
    cd.text.setAttribute("d", seg(w(6, 15), w(W - 6, 15)) + seg(w(6, 9), w(W - 20, 9)));
    cd.grp.setAttribute("opacity", tval(cd.o, now).toFixed(3));
  }

  let next = 0, count = 0, phase = 0;
  const L = register(stage, (_dt, now) => {
    if (!next) next = now + 900;
    if (now >= next) {
      const lead = cards.reduce((a, b) => (tval(b.s, now) > tval(a.s, now) ? b : a));
      if (phase === 0) {
        // the front post stands up and lifts clear of the tray
        tset(lead.a, 0, now, 0); tset(lead.z, LIFT, now, 0);
        lead.face.classList.add("hi");
        phase = 1; next = now + 650;
      } else if (phase === 1) {
        // up and away, to the account
        tset(lead.z, AWAY, now, 0); tset(lead.o, 0, now, 120);
        phase = 2; next = now + 700;
        count++;
        read.textContent = `${count}:${KINDS[lead.k]}`;
      } else {
        // the rest step forward, and the post that left comes back in at the back
        for (const c of cards) if (c !== lead) {
          const to = tval(c.s, now) + 1;
          tset(c.s, to, now, (N - 1 - tval(c.s, now)) * 60);
          tset(c.a, to === N - 1 ? FRONT : REST, now, (N - 1 - tval(c.s, now)) * 60);
        }
        lead.face.classList.remove("hi");
        lead.s = tween(0); lead.a = tween(REST); lead.z = tween(-18); lead.o = tween(0, 500);
        tset(lead.z, 0, now, 200); tset(lead.o, 1, now, 200);
        deck.prepend(lead.grp);
        phase = 0; next = now + PERIOD - 1350;
      }
    }
    for (const c of cards) draw(c, now);
    return true;
  });
  bag.add(L.unregister);
  bag.add(() => svg.replaceChildren());

  return { set: () => {}, destroy: bag.dispose };
};
