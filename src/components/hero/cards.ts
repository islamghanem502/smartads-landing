import type { FigureMount, Tour } from "@/lib/hairline/core/stage";
import * as coins from "@/lib/hairline/figures/coins";
import * as creatives from "@/lib/hairline/figures/creatives";
import * as mailboxes from "@/lib/hairline/figures/mailboxes";
import * as planner from "@/lib/hairline/figures/planner";

export type Fig = { mount: FigureMount; range: readonly number[]; stops: Tour };

export type CardDef = {
  id: "events" | "ads" | "budget" | "posts";
  title: string;
  /** الجملة تحت الرسمة لما ما أحد لامسها. */
  rest: string;
  /** من قراءة الرسمة (اللي تحت المؤشر) لجملة يفهمها التاجر. */
  say: (read: string) => string | null;
  fig: Fig;
  label: string;
  /** مكانها على اللوح في الشاشات العريضة: x نسبة من العرض (المنتصف)، y بالبكسل، وميلانها. */
  at: { x: number; y: number; rot: number };
};

const PLATFORMS = ["سناب", "تيك توك", "ميتا", "قوقل"];
const FORMATS = ["إعلان بحث في قوقل", "ستوري في سناب", "فيديو في تيك توك", "ريلز في انستقرام", "إعلان متعدد الصور في ميتا", "فيديو في يوتيوب"];
const DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export const CARDS: CardDef[] = [
  {
    id: "events",
    title: "كل طلب يوصل للمنصات",
    rest: "أي شراء في متجرك يوصل لسناب وتيك توك وميتا وقوقل، فتعرف إعلاناتك مين يشتري.",
    say: (r) => {
      const i = Number(r) - 1;
      return PLATFORMS[i] ? `وصل الطلب ل${PLATFORMS[i]} أول، وبعده للباقي على طول.` : null;
    },
    fig: mailboxes,
    label: "أربعة صناديق بريد، لكل منصة إعلانية صندوق، وكل طلب يرفع علم الصناديق كلها",
    at: { x: 14, y: 70, rot: -4 },
  },
  {
    id: "ads",
    title: "حملات جاهزة لكل منصة",
    rest: "نجهّز الإعلان والجمهور والميزانية، ونطلق الحملة على المنصة اللي تناسب منتجك.",
    say: (r) => {
      const f = FORMATS[Number(r) - 1];
      return f ? `${f}: جاهز ومنطلق.` : null;
    },
    fig: creatives,
    label: "صف إعلانات بمقاس الستوري، والإعلان اللي تختاره يوقف قدامك",
    at: { x: 86, y: 56, rot: 3.5 },
  },
  {
    id: "budget",
    title: "الميزانية تروح للي يبيع",
    rest: "نقرأ النتائج كل يوم، ونحرّك الميزانية للمنصة اللي تجيب لك مبيعات أكثر.",
    say: (r) => {
      const [a, pct] = r.split("·").map(Number);
      const p = PLATFORMS[a - 1];
      return p ? `${p} يبيع أكثر هالأسبوع، فصار له ${pct}٪ من الميزانية.` : null;
    },
    fig: coins,
    label: "أربع كومات عملات، والكومة اللي تبيع أكثر تاخذ من الباقي",
    at: { x: 31, y: 446, rot: 2.5 },
  },
  {
    id: "posts",
    title: "ننشر في حساباتك",
    rest: "نكتب المنشور ونصمّمه ونجدوله في انستقرام وتيك توك، وأنت توافق بضغطة.",
    say: (r) => {
      const d = DAYS[Number(r.split("·")[0]) - 1];
      return d ? `منشور يوم ${d}: مكتوب ومصمّم ومجدول.` : null;
    },
    fig: planner,
    label: "تقويم نشر لثلاثة أسابيع، والأيام اللي فيها منشور تطلع لك",
    at: { x: 69, y: 460, rot: -2.5 },
  },
];
