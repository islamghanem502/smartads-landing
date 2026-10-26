import { renderToString } from "react-dom/server";
import { App } from "./App";

/** يستخدمه scripts/prerender.mjs وقت البناء بس. */
export const render = () => renderToString(<App />);
