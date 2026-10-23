import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "مسوّقك الذكي | اربط متجرك، والتسويق كله علينا",
  description:
    "أول وكالة تسويق بالذكاء الاصطناعي في الوطن العربي. نسوي حملاتك، ونوصّل كل طلب من متجرك للمنصات الإعلانية، وننشر في حساباتك.",
  // نسخة تجريبية: ما تتأرشف عشان ما تنافس الموقع الحالي في البحث.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#161616",
};

// بكسل المنصة يشتغل بس لما نحدد رقمه (لما النسخة دي تحل محل الموقع الحالي).
const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* الحركة تخفي العناصر قبل ما تدخل. لو الجافاسكربت ما اشتغل، تبان بعد ثانيتين ونص */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.add('shown')},2500)" }} />
      </head>
      <body>
        {PIXEL_ID ? (
          <Script src={`https://ilanakdhaki.com/api/pixel.js?id=${PIXEL_ID}`} strategy="afterInteractive" />
        ) : null}
        {children}
      </body>
    </html>
  );
}
