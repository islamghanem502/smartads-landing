import { SiGoogle, SiMeta, SiSnapchat, SiTiktok } from "react-icons/si";

export type Platform = "meta" | "google" | "tiktok" | "snap";

export const PLATFORMS: Record<Platform, { name: string; Icon: typeof SiMeta; color: string; bg: string }> = {
  meta: { name: "ميتا", Icon: SiMeta, color: "#0866FF", bg: "#E8F0FF" },
  google: { name: "قوقل", Icon: SiGoogle, color: "#4285F4", bg: "#EAF1FE" },
  tiktok: { name: "تيك توك", Icon: SiTiktok, color: "#111111", bg: "#EEEFF1" },
  snap: { name: "سناب", Icon: SiSnapchat, color: "#1B2230", bg: "#FFFC00" },
};

export function PlatformMark({ platform, size = 32 }: { platform: Platform; size?: number }) {
  const { Icon, color, bg, name } = PLATFORMS[platform];
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[10px]"
      style={{ width: size, height: size, background: bg, color }}
      role="img"
      aria-label={name}
    >
      <Icon size={Math.round(size * 0.55)} aria-hidden />
    </span>
  );
}
