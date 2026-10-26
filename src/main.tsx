import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/rubik/index.css";
import "./index.css";
import { App } from "./App";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// بعد البناء الصفحة جاية مرسومة، فنكمّل عليها. في التطوير فاضية، فنرسمها من الصفر.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

// بكسل المنصة يشتغل بس لما نحدد رقمه (لما النسخة دي تحل محل الموقع الحالي)
const pixel = import.meta.env.VITE_PIXEL_ID;
if (pixel) {
  const s = document.createElement("script");
  s.src = `https://ilanakdhaki.com/api/pixel.js?id=${pixel}`;
  s.async = true;
  document.head.append(s);
}
