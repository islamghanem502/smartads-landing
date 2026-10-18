import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/readex-pro/index.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-400.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-500.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-600.css";
import "@fontsource/ibm-plex-sans-arabic/latin-400.css";
import "@fontsource/aref-ruqaa/arabic-400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "مسوّقك الذكي — وكالة تسويق يشغّلها الذكاء الاصطناعي",
  description: "نسوي حملاتك على ميتا وقوقل وتيك توك وسناب، ونتابعها كل يوم. وكل قرار تشوفه قدامك.",
  // نسخة تجريبية: ما تتأرشف عشان ما تنافس الموقع الحالي في البحث.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

// بكسل المنصة يشتغل بس لما نحدد رقمه (لما النسخة دي تحل محل الموقع الحالي).
const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {PIXEL_ID ? (
          <Script src={`https://ilanakdhaki.com/api/pixel.js?id=${PIXEL_ID}`} strategy="afterInteractive" />
        ) : null}
        {children}
      </body>
    </html>
  );
}
