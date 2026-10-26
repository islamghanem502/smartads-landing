# smartads-landing

صفحة الهبوط الجديدة لـ«مسوّقك الذكي». React 19 + Vite + Tailwind 4 + GSAP.

```bash
npm install
npm run dev      # http://localhost:3200
npm run build    # dist/ جاهز للرفع على أي استضافة ملفات ثابتة
npm run preview  # يشغّل نسخة البناء نفسها
npm run check    # TypeScript
```

## كيف يشتغل البناء

`npm run build` يبني الموقع، وبعدها يرسم الصفحة HTML جاهز (`scripts/prerender.mjs`)،
عشان قوقل ومعاينة الروابط يشوفون الكلام بدون جافاسكربت. في المتصفح React يكمّل على نفس الـ HTML.
يعني أي كود يلمس `window` أو `document` لازم يكون داخل `useEffect` أو `useGSAP`، مو وقت الرسم.

## الملفات

- `src/components/Nav.tsx`: النافبار.
- `src/components/hero/Hero.tsx`: الهيرو والتخطيط (التعليق فوقه يشرح كل مقاس).
- `src/components/hero/ServiceTree.tsx`: شجرة الخدمات والمنصات وحركتها.
- `src/components/hero/Mascot.tsx`: الشخصية ووجهها المرسوم بالكود (يرمش، يلحق المؤشر، يبتسم).
- `src/components/logos.tsx`: شعارات المنصات.
- `src/index.css`: الألوان (`@theme`) وكم كلاس ما تنكتب بـ Tailwind.

## متغيرات البيئة

- `VITE_APP_URL`: رابط اللوحة (الافتراضي https://ilanakdhaki.com).
- `VITE_PIXEL_ID`: يشغّل بكسل المنصة (فاضي = مقفول).

النسخة دي `noindex` لحد ما تحل محل الموقع الحالي. التصميم القديم (Next.js) محفوظ في فرع `legacy-next`.

شعارات المنصات من [Simple Icons](https://simpleicons.org) (CC0)، وشعار زد من zid.sa. كلها علامات تجارية لأصحابها.
