// يرسم الصفحات HTML جاهزة وقت البناء: قوقل ومعاينة واتساب يشوفون الكلام بدون ما يشغّلون جافاسكربت،
// وبعدها React يكمّل عليها في المتصفح (hydrate). الصفحات وش ينرسم فيها في src/entry-server.tsx
import { readFile, rm, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const { pages } = await import(new URL(".ssr/entry-server.js", dist).href);

for (const [file, render] of Object.entries(pages)) {
  const page = new URL(file, dist);
  const html = await readFile(page, "utf8");
  if (!html.includes("<!--app-->")) throw new Error(`dist/${file}: ما لقيت <!--app-->`);
  await writeFile(page, html.replace("<!--app-->", render()));
  console.log(`prerendered dist/${file}`);
}
await rm(new URL(".ssr/", dist), { recursive: true });
