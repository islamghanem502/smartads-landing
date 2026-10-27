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

فيه ثلاث صفحات: الرئيسية (`index.html`)، والدخول (`login/index.html`)، وحساب جديد (`signup/index.html`، نفس صفحة الدخول بعنوان «اربط متجرك»).
`npm run build` يبنيهم، وبعدها يرسم كل صفحة HTML جاهز (`scripts/prerender.mjs`، والصفحات في `src/entry-server.tsx`)،
عشان قوقل ومعاينة الروابط يشوفون الكلام بدون جافاسكربت. في المتصفح React يكمّل على نفس الـ HTML.
يعني أي كود يلمس `window` أو `document` لازم يكون داخل `useEffect` أو `useGSAP`، مو وقت الرسم.

## الملفات

- `src/components/Nav.tsx`: النافبار.
- `src/components/hero/Hero.tsx`: الهيرو والتخطيط (التعليق فوقه يشرح كل مقاس).
- `src/components/hero/Team.tsx`: كرت «فريقك التسويقي» وحركته.
- `src/components/hero/Mascot.tsx`: الشخصية في الهيرو.
- `src/components/MascotFace.tsx`: وجه الشخصية المرسوم بالكود فوق شاشتها (ثابت ويرمش)، نفسه في الهيرو وصفحة الدخول.
- `src/login/`: صفحة الدخول (سلة، زد، موقعك الخاص) والشخصية الصغيرة القاعدة على الكرت (`Sitter.tsx`).
- `src/components/logos.tsx`: شعارات المنصات.
- `src/index.css`: الألوان (`@theme`) وكم كلاس ما تنكتب بـ Tailwind.

## متغيرات البيئة

- `VITE_APP_URL`: رابط اللوحة (الافتراضي https://ilanakdhaki.com).
- `VITE_API_URL`: رابط الـ API لصفحة الدخول (الافتراضي نفس رابط اللوحة). الدخول بالإيميل يحتاج الصفحة
  على نفس دومين المنصة، لأن كوكي الجلسة `SameSite=Lax` والـ API ما يسمح إلا لدوميناته (CORS).
- `VITE_PIXEL_ID`: يشغّل بكسل المنصة (فاضي = مقفول).

النسخة دي `noindex` لحد ما تحل محل الموقع الحالي. التصميم القديم (Next.js) محفوظ في فرع `legacy-next`.

شعارات المنصات من [Simple Icons](https://simpleicons.org) (CC0)، وشعار زد من zid.sa. كلها علامات تجارية لأصحابها.
