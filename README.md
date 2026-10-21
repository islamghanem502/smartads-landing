# smartads-landing

تجربة لاندنج جديدة لـ«مسوّقك الذكي». Next.js 15 + Tailwind 4.

```bash
npm install
npm run dev   # http://localhost:3200
```

- النسخة دي `noindex` لحد ما تحل محل الموقع الحالي.
- `NEXT_PUBLIC_PIXEL_ID`: يشغّل بكسل المنصة (فاضي = مقفول).
- `NEXT_PUBLIC_APP_URL`: رابط اللوحة (الافتراضي https://ilanakdhaki.com).
- رسومات الكروت مبنية على محرك [hairline](https://github.com/lucasmarkes/hairline) (MIT)، منسوخ في `src/lib/hairline/core`. الرسومات نفسها في `src/lib/hairline/figures`.
