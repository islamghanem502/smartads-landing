// شكل الشخصية كله بيانات: النسب والألوان والحالات. أي نسخة تانية = إعدادات، مش كود جديد.
// كل المقاسات مضاعفات لـ R (R = 0.3 × عرض الـ canvas).

export type RGB = readonly [number, number, number];

export type EyeShape =
  | "pill"
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
export const GREEN: RGB = [31, 157, 107];
export const RED: RGB = [229, 72, 77];
export const VIOLET: RGB = [108, 124, 250];
export const PINK: RGB = [255, 122, 168];

export const LOOK = {
  /** أس الـ superellipse: أنعم من مستطيل مدوّر، وأثبت من بيضاوي. */
  n: 2.7,
  rx: 1.14,
  ry: 0.88,
  /** الجسم تحت نص الـ canvas بشوية، والمساحة فوق للخصلة والجزيئات. */
  drop: 0.06,
  segments: 72,

  /** جسم محايد دافي — النور من فوق يمين، والناحية البعيدة أغمق بنسبة بسيطة. */
  bodyLight: "#FAF7F2",
  bodyDark: "#D9D1C6",
  /** ظل الحافة: أسود دافي ~20%، من غير خط. */
  rim: "rgba(58, 38, 28, 0.22)",
  ink: "#1A1412",
  blush: [255, 128, 150] as RGB,
  heart: "#EC4D74",
  star: "#F2A20C",

  /**
   * عصابة زعفرانية حوالين الراس (حلقة على نفس الحجم) بعقدة على الجنب وطرفين طريين:
   * لون البراند، وإحساس «جاهز للشغل»، وحركة ثانوية بزنبرك.
   */
  bandLight: "#FFBE3B",
  bandDark: "#E08600",
  band: {
    /** ارتفاع الحلقة على الحجم (−1 فوق … 1 تحت) */
    height: -0.4,
    thickness: 0.21,
    /** الحجم متشاف من فوق شوية */
    view: 0.44,
    knotYaw: 1.0,
    knot: 0.12,
    tails: [
      { length: 0.5, width: 0.15, angle: 0.75 },
      { length: 0.4, width: 0.14, angle: 1.3 },
    ],
  },

  eye: { yaw: 0.37, pitch: -0.12, w: 0.27, h: 0.3 },
  blushSpot: { yaw: 0.582, pitch: -0.2, w: 0.17, h: 0.1 },
  mouth: { pitch: -0.36 },
  hand: { w: 0.14, h: 0.19 },
} as const;

export type StateLook = {
  eye: EyeShape;
  tint: RGB;
  tintAmount: number;
  glow: RGB;
  glowAmount: number;
  blush: number;
  eyeScale: number;
};

export const STATES: Record<MascotStateName, StateLook> = {
  idle: { eye: "pill", tint: SAFFRON, tintAmount: 0, glow: SAFFRON, glowAmount: 0.15, blush: 0.25, eyeScale: 1 },
  watching: { eye: "pill", tint: SAFFRON, tintAmount: 0.08, glow: SAFFRON, glowAmount: 0.28, blush: 0.3, eyeScale: 1.08 },
  thinking: { eye: "pill", tint: VIOLET, tintAmount: 0.3, glow: VIOLET, glowAmount: 0.45, blush: 0.15, eyeScale: 0.96 },
  happy: { eye: "happy", tint: SAFFRON, tintAmount: 0.5, glow: SAFFRON, glowAmount: 0.65, blush: 0.7, eyeScale: 1 },
  sleeping: { eye: "closed", tint: VIOLET, tintAmount: 0.08, glow: VIOLET, glowAmount: 0.1, blush: 0.4, eyeScale: 1 },
  error: { eye: "flat", tint: RED, tintAmount: 0.42, glow: RED, glowAmount: 0.6, blush: 0, eyeScale: 1 },
  dance: { eye: "happy", tint: SAFFRON, tintAmount: 0.45, glow: SAFFRON, glowAmount: 0.65, blush: 0.6, eyeScale: 1 },
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
