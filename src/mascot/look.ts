// شكل الشخصية كله بيانات: النسب والألوان والحالات. أي نسخة تانية = إعدادات، مش كود جديد.
// كل المقاسات مضاعفات لـ R (R = 0.3 × عرض الـ canvas).
//
// الشخصية: فقاعة كلام زعفرانية عايمة — شغلنا رسايل وتواصل بين التاجر وعملاءه ومنصاته.
// ليها ذيل فقاعة طري، عينين لامعين، حواجب بتعبّر، وبتكتب «…» وهي بتفكر.

export type RGB = readonly [number, number, number];

export type EyeShape =
  | "round"
  | "wide"
  | "dot"
  | "line"
  | "flat"
  | "happy"
  | "closed"
  | "spiral"
  | "heart"
  | "star"
  | "tired";

export type MascotStateName = "idle" | "watching" | "thinking" | "happy" | "sleeping" | "error" | "dance";

export type EmoteName =
  | "hop"
  | "love"
  | "proud"
  | "surprised"
  | "yawn"
  | "wink"
  | "annoyed"
  | "dizzy"
  | "wave"
  | "celebrate"
  | "shake";

export const SAFFRON: RGB = [242, 162, 12];
export const RED: RGB = [229, 72, 77];
export const VIOLET: RGB = [120, 132, 255];
export const WHITE: RGB = [255, 244, 214];

export const LOOK = {
  /** أس الـ superellipse: قريب من الدايرة، بس فيه «كتف» خفيف زي فقاعة الشات. */
  n: 2.3,
  rx: 1.0,
  ry: 0.9,
  /** عايمة فوق الأرض */
  hover: 0.24,
  segments: 80,

  /** جسم زعفراني: النور من فوق يمين لتحت شمال */
  bodyLight: "#FFDA80",
  bodyMid: "#FFB52A",
  bodyDark: "#E5830A",
  rim: "rgba(122, 48, 0, 0.32)",
  ink: "#2A1607",
  mouthInside: "#7A2A0C",
  heart: "#E8345F",
  star: "#FFF4D6",

  /** ذيل الفقاعة: تحت شمال، طري وبيتمرجح بزنبرك */
  tail: { angle: 2.1, spread: 0.36, length: 0.46, curl: 0.3 },

  eye: { yaw: 0.34, pitch: 0.04, r: 0.135 },
  brow: { lift: 0.25, w: 0.15, h: 0.048 },
  mouth: { pitch: -0.3, w: 0.13 },
} as const;

export type StateLook = {
  eye: EyeShape;
  /** −1 تكشيرة … 1 ضحكة */
  smile: number;
  tint: RGB;
  tintAmount: number;
  glow: RGB;
  glowAmount: number;
  eyeScale: number;
};

export const STATES: Record<MascotStateName, StateLook> = {
  idle: { eye: "round", smile: 0.45, tint: SAFFRON, tintAmount: 0, glow: SAFFRON, glowAmount: 0.3, eyeScale: 1 },
  watching: { eye: "round", smile: 0.3, tint: SAFFRON, tintAmount: 0, glow: SAFFRON, glowAmount: 0.38, eyeScale: 1.07 },
  thinking: { eye: "round", smile: 0.1, tint: VIOLET, tintAmount: 0.2, glow: VIOLET, glowAmount: 0.45, eyeScale: 1 },
  happy: { eye: "happy", smile: 1, tint: WHITE, tintAmount: 0.18, glow: SAFFRON, glowAmount: 0.7, eyeScale: 1 },
  sleeping: { eye: "closed", smile: 0, tint: VIOLET, tintAmount: 0.12, glow: VIOLET, glowAmount: 0.14, eyeScale: 1 },
  error: { eye: "round", smile: -0.7, tint: RED, tintAmount: 0.38, glow: RED, glowAmount: 0.55, eyeScale: 0.92 },
  dance: { eye: "happy", smile: 1, tint: WHITE, tintAmount: 0.14, glow: SAFFRON, glowAmount: 0.7, eyeScale: 1 },
};

export const STATE_NAMES = Object.keys(STATES) as MascotStateName[];
export const EMOTE_NAMES: EmoteName[] = [
  "hop",
  "love",
  "proud",
  "surprised",
  "yawn",
  "wink",
  "annoyed",
  "dizzy",
  "wave",
  "celebrate",
  "shake",
];
