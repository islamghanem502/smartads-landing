import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3200 },
  preview: { port: 3200 },
  // الرئيسية، والدخول (/login/)، وحساب جديد (/signup/)
  build: { rollupOptions: { input: { main: "index.html", login: "login/index.html", signup: "signup/index.html" } } },
  // نحزمها مع نسخة السيرفر، عشان Node ما يتعثر في طريقة تصديرها وقت ما نرسم الصفحة
  ssr: { noExternal: ["gsap", "@gsap/react"] },
});
