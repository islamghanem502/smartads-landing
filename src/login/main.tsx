import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/rubik/index.css";
import "../index.css";
import { Login } from "./Login";

// نفس الصفحة الرئيسية: بعد البناء جاية مرسومة فنكمّل عليها، وفي التطوير نرسمها من الصفر.
// /signup/ و /login/ نفس الصفحة (fresh يفرق بينهم)، ونفس الشي في entry-server.tsx
const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <Login fresh={location.pathname.startsWith("/signup")} />
  </StrictMode>
);
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
