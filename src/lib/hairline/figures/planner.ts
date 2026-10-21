import { Cam, clamp, facing, fit, open, poly, prism, proj, ringAt, rings, rrect, seg, unproj, type Vec2, type Vec3 } from "../core/iso";
import { spring, stepS, type Spring } from "../core/motion";
import { disposer, flatDot, mk, place, pointer, put, register, solid, type FigureMount, type Solid } from "../core/stage";

/**
 * Planner: a posting calendar, three weeks of seven days on a board bound with
 * wire loops along its far edge. The days that have a post carry a tile, the
 * post itself, with its picture inset on the lid. The tiles near the pointer
 * rise on springs, the farther the less; the one nearest takes the bright edge.
 * At rest the next post up is bright. The slider is the reach, in days.
 *
 * The pattern: a field, on springs, over parts that sit apart. The pointer is
 * read on the plane of the tiles' resting lids, which never moves.
 */

const COLS = 7, ROWS = 3, CELL = 19, F = 15, M = 7, BT = 4, H0 = 3.2, LIFT = 22;
const POSTS: [number, number][] = [[1, 0], [4, 0], [6, 0], [0, 1], [3, 1], [5, 1], [2, 2], [4, 2], [6, 2]];
const NEXT = 3;
const EX = COLS * CELL, EY = ROWS * CELL;

export const range = [1, 1.7, 2.8] as const;

const falloff = (u: number) => (u <= 0 ? 1 : u <= 1 ? 1 - u * u * (3 - 2 * u) : 0);

function frame() {
  const C = Cam(45, 0.5, 1.9);
  const pts: Vec3[] = [[-M, -M, -BT], [EX + M, EY + M, -BT], [EX + M, -M, -BT], [-M, EY + M, -BT], [-M, -M, 9], [EX, -M, 9], [0, 0, H0 + LIFT]];
  fit(C, pts, 200, 166);
  return C;
}

const centre = ([i, j]: [number, number]): Vec3 => [i * CELL + CELL / 2, j * CELL + CELL / 2, H0];

export const stops: (Vec2 | null)[] = (() => {
  const P = proj(frame());
  return [...[POSTS[1], POSTS[4], POSTS[7]].map((c) => P(...centre(c))), null];
})();

export const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer();
  let reach = value;
  const C = frame(), P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(-M, -M, EX + M, EY + M, 7, 2);
  put(solid(g), prism(P, front, br, bi, -BT, 0));

  // the days: a faint square for each, posted or not
  let d = "";
  for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
    const x = i * CELL + (CELL - F) / 2, y = j * CELL + (CELL - F) / 2;
    d += poly(ringAt(P, rrect(x, y, x + F, y + F, 2, 3), 0));
  }
  mk("path", { d, class: "nf lo" }, g);

  // the binding: a wire loop over each day's column, through two holes in the board's far margin
  let wire = "", holes = "";
  for (let i = 0; i < COLS; i++) {
    const cx = i * CELL + CELL / 2, y = -M / 2, pts: Vec2[] = [];
    for (let k = 0; k <= 12; k++) { const a = (Math.PI * k) / 12; pts.push(P(cx + 3.2 * Math.cos(a), y, 7.5 * Math.sin(a))); }
    wire += open(pts);
    holes += seg(P(cx - 3.2, y - 0.8, 0), P(cx - 3.2, y + 0.8, 0)) + seg(P(cx + 3.2, y - 0.8, 0), P(cx + 3.2, y + 0.8, 0));
  }
  mk("path", { d: holes, class: "nf lo" }, g);
  mk("path", { d: wire, class: "nf sil" }, g);

  // the posts, from the far corner to the near one
  type Post = { i: number; j: number; x: number; y: number; ring: ReturnType<typeof rings>[0]; inner: ReturnType<typeof rings>[0]; pic: ReturnType<typeof rrect>; el: Solid; picEl: SVGPathElement; sun: SVGEllipseElement; sp: Spring; drawn: number };
  const posts: Post[] = POSTS.slice().sort((a, b) => a[0] + a[1] - (b[0] + b[1])).map(([i, j]) => {
    const x = i * CELL + (CELL - F) / 2, y = j * CELL + (CELL - F) / 2;
    const [ring, inner] = rings(x, y, x + F, y + F, 2.4, 0.9);
    const el = solid(g);
    const picEl = mk("path", { class: "nf lo" }, el.g);
    const sun = flatDot(el.g, C, 1.1, "dot m");
    return { i, j, x, y, ring, inner, pic: rrect(x + 2.6, y + 2.6, x + F - 2.6, y + F - 2.6, 1.2, 3), el, picEl, sun, sp: spring(H0, { eps: 0.03 }), drawn: NaN };
  });
  const next = posts.find((p) => p.i === POSTS[NEXT][0] && p.j === POSTS[NEXT][1])!;

  function draw(p: Post) {
    const h = p.sp.x;
    if (h === p.drawn) return;
    p.drawn = h;
    put(p.el, prism(P, front, p.ring, p.inner, 0, h));
    p.picEl.setAttribute("d", poly(ringAt(P, p.pic, h)));
    place(p.sun, P(p.x + F - 5.2, p.y + 5.2, h));
  }

  const L = register(stage, (dt) => {
    let moving = false;
    for (const p of posts) { if (stepS(p.sp, dt)) moving = true; draw(p); }
    return moving;
  });
  bag.add(L.unregister);

  let lit: Post | null = null;
  function light(p: Post) {
    if (p === lit) return;
    lit?.el.sil.classList.remove("hi");
    p.el.sil.classList.add("hi");
    lit = p;
  }

  let over: Vec2 | null = null;
  function retarget() {
    if (!over) {
      for (const p of posts) p.sp.t = H0;
      light(next);
      read.textContent = "rest";
    } else {
      const [ox, oy] = over;
      let near = posts[0], best = Infinity;
      for (const p of posts) {
        const dist = Math.hypot(p.x + F / 2 - ox, p.y + F / 2 - oy) / CELL;
        p.sp.t = H0 + LIFT * falloff(dist / reach);
        if (dist < best) { best = dist; near = p; }
      }
      light(near);
      const i = clamp(Math.floor(ox / CELL), 0, COLS - 1), j = clamp(Math.floor(oy / CELL), 0, ROWS - 1);
      read.textContent = `${i + 1}·${j + 1}`;
    }
    L.wake();
  }

  retarget();
  bag.add(pointer(stage, {
    move: (p) => {
      const w = unproj(C, p[0], p[1], H0);
      over = w[0] < -M || w[1] < -M || w[0] > EX + M || w[1] > EY + M ? null : w;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
};
