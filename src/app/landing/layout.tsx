import type { Metadata, Viewport } from "next";
import "@fontsource-variable/rubik/index.css";
import "./landing.css";

export const metadata: Metadata = {
  title: "مسوّقك الذكي | وكالتك التسويقية، تحت أمرك",
  description: "اربط متجرك أو موقعك، ونطلق حملاتك، ونصمّم منشوراتك وفيديوهاتك وننشرها، ونرفع ظهورك في قوقل.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#111318" };

/* تجربة الهوية الجديدة: الشخصية الخليجية على خلفية #111318 مع الأبيض */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <div className="landing-root">{children}</div>;
}
