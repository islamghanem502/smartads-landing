import { renderToString } from "react-dom/server";
import { App } from "./App";
import { BlogIndex } from "./blog/BlogIndex";
import { BlogPost } from "./blog/BlogPost";
import { Login } from "./login/Login";

/** يستخدمه scripts/prerender.mjs وقت البناء بس: كل صفحة HTML ووش ينرسم فيها. */
export const pages: Record<string, () => string> = {
  "index.html": () => renderToString(<App />),
  "login/index.html": () => renderToString(<Login />),
  "signup/index.html": () => renderToString(<Login fresh />),
  "blog/index.html": () => renderToString(<BlogIndex />),
  "blog/post/index.html": () => renderToString(<BlogPost />),
};
