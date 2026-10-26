// يرسم الصفحة HTML جاهز وقت البناء: قوقل ومعاينة واتساب يشوفون الكلام بدون ما يشغّلون جافاسكربت،
// وبعدها React يكمّل عليها في المتصفح (hydrate).
import { readFile, rm, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const { render } = await import(new URL(".ssr/entry-server.js", dist).href);

const page = new URL("index.html", dist);
const html = await readFile(page, "utf8");
if (!html.includes("<!--app-->")) throw new Error("dist/index.html: ما لقيت <!--app-->");

await writeFile(page, html.replace("<!--app-->", render()));
await rm(new URL(".ssr/", dist), { recursive: true });
console.log("prerendered dist/index.html");
