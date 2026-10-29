import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/rubik/index.css";
import "../index.css";
import { BlogIndex } from "./BlogIndex";
import { BlogPost } from "./BlogPost";

// تجربة المدونة: /blog/ صفحة المقالات، و /blog/post/ مقال (نفس الشي في entry-server.tsx)
const root = document.getElementById("root")!;
const app = <StrictMode>{location.pathname.startsWith("/blog/post") ? <BlogPost /> : <BlogIndex />}</StrictMode>;
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
