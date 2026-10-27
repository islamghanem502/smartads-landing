import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3200 },
  preview: { port: 3200 },
  // صفحتين: الرئيسية وصفحة الدخول (/login/)
  build: { rollupOptions: { input: { main: "index.html", login: "login/index.html" } } },
  // نحزمها مع نسخة السيرفر، عشان Node ما يتعثر في طريقة تصديرها وقت ما نرسم الصفحة
  ssr: { noExternal: ["gsap", "@gsap/react"] },
});
