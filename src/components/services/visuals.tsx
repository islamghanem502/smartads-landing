/*
 * رسمات صغيرة بالكود بين كلام الكرت والشخصية: هيكل واجهة هادي (رمادي فاتح) وعنصر واحد بلون الكرت يحمل الفكرة.
 * كلها نفس المقاس (280×76) ونفس الخطوط والزوايا، وبدون كلام ولا شارات.
 */

type V = { accent: string; soft: string };

const FILL = "#eceef2"; // هيكل
const LINE = "#e1e4ea"; // حدود
const MUTED = "#c6cad3"; // عناصر رمادية أغمق

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 280 76" role="img" aria-label={label} className="block h-auto w-full" fill="none">
      {children}
    </svg>
  );
}

/** الإعلانات: خط أداء فيه نقطة مراجعة كل ربع ساعة، وآخر مراجعة هي اللي رفعته. */
export function AdsVisual({ accent, soft }: V) {
  const pts = [[10, 58], [53, 54], [96, 56], [140, 46], [183, 41], [226, 31], [270, 15]];
  const grey = pts.slice(0, -1).map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <Frame label="مراجعة الحملة كل ربع ساعة والأداء يرتفع">
      <path d="M4 70H276" stroke={LINE} strokeWidth="1.5" />
      {pts.map(([x], i) => <path key={i} d={`M${x} 66V70`} stroke={LINE} strokeWidth="1.5" />)}
      <polyline points={grey} stroke={MUTED} strokeWidth="2" strokeLinejoin="round" />
      <path d="M226 31L270 15" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      {pts.slice(0, -1).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke={MUTED} strokeWidth="1.5" />)}
      <circle cx="270" cy="15" r="10" fill={soft} />
      <circle cx="270" cy="15" r="4.5" fill={accent} />
    </Frame>
  );
}

/** تتبّع المبيعات: متجرك يرسل كل طلب للمنصات الثلاث. */
export function TrackingVisual({ accent, soft }: V) {
  const ys = [14, 38, 62];
  return (
    <Frame label="كل طلب من متجرك يوصل للمنصات الإعلانية">
      {ys.map((y) => <path key={y} d={`M232 38C150 38 110 ${y} 33 ${y}`} stroke={LINE} strokeWidth="1.5" />)}
      {ys.map((y) => <circle key={y} cx="130.6" cy={(38 + y) / 2} r="3" fill={accent} />)}
      {ys.map((y) => (
        <g key={y}>
          <circle cx="24" cy={y} r="9" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <circle cx="24" cy={y} r="3" fill={MUTED} />
        </g>
      ))}
      <rect x="226" y="18" width="48" height="40" rx="12" fill={soft} />
      <rect x="236" y="26" width="28" height="24" rx="8" fill={accent} />
      <path d="M244 32v-2.5a6 6 0 0 1 12 0V32" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </Frame>
  );
}

/** تصميم الإعلانات: نفس الإعلان بمقاس كل منصة (مربع، طولي، ستوري). */
export function DesignVisual({ accent }: V) {
  const photo = (x: number, y: number, w: number, h: number) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={FILL} />
      <circle cx={x + w * 0.3} cy={y + h * 0.32} r="4" fill={MUTED} />
      <path d={`M${x + 6} ${y + h - 8}l${w * 0.3} -${h * 0.3} ${w * 0.22} ${h * 0.18} ${w * 0.12} -${h * 0.1} ${w * 0.36 - 12} ${h * 0.22}Z`} fill={MUTED} />
    </g>
  );
  return (
    <Frame label="صور وفيديوهات بمقاس كل منصة">
      {photo(59, 18, 52, 52)}
      {photo(125, 12, 46, 58)}
      <rect x="185" y="6" width="36" height="64" rx="8" fill={accent} />
      <path d="M199 31.5v13l10-6.5z" fill="#fff" />
    </Frame>
  );
}

/** النشر: أسبوع فيه منشورات بانتظام، والجاي منها ملوّن. */
export function PublishingVisual({ accent, soft }: V) {
  return (
    <Frame label="منشورات منتظمة على أيام الأسبوع">
      {Array.from({ length: 7 }, (_, i) => {
        const x = 11 + i * 38, post = i % 2 === 0, next = i === 4;
        return (
          <g key={i}>
            <rect x={x} y="23" width="30" height="30" rx="8" fill={next ? soft : "#fff"} stroke={next ? accent : LINE} strokeWidth="1.5" />
            {post && <circle cx={x + 15} cy="38" r="4" fill={next ? accent : MUTED} />}
          </g>
        );
      })}
    </Frame>
  );
}

/** السيو: نتيجة متجرك هي الأولى في البحث. */
export function SeoVisual({ accent, soft }: V) {
  return (
    <Frame label="متجرك أول نتيجة في البحث">
      <rect x="4" y="2" width="272" height="22" rx="11" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      <circle cx="262" cy="12" r="4.5" stroke={MUTED} strokeWidth="1.8" />
      <path d="M265.3 15.3l3 3" stroke={MUTED} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="150" y="11" width="100" height="4" rx="2" fill={FILL} />
      <rect x="4" y="30" width="272" height="17" rx="8.5" fill={soft} />
      <circle cx="265" cy="38.5" r="6" fill={accent} />
      <text x="265" y="41.3" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">1</text>
      <rect x="130" y="36.5" width="124" height="4" rx="2" fill={accent} fillOpacity=".55" />
      <circle cx="265" cy="56" r="5" fill={FILL} />
      <rect x="150" y="54" width="104" height="4" rx="2" fill={FILL} />
      <circle cx="265" cy="70" r="5" fill={FILL} />
      <rect x="170" y="68" width="84" height="4" rx="2" fill={FILL} />
    </Frame>
  );
}

/** التقارير: تقرير يوصلك في رسالة، ورد من المستشار. */
export function ReportsVisual({ accent, soft }: V) {
  const bars = [10, 16, 13, 22, 30];
  return (
    <Frame label="تقرير أسبوعي في رسالة، ومستشار يرد عليك">
      <path d="M128 4h136a12 12 0 0 1 12 12v26a12 12 0 0 1-12 12h-8l4 8-14-8H128a12 12 0 0 1-12-12V16a12 12 0 0 1 12-12z" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      {bars.map((h, i) => (
        <rect key={i} x={146 + i * 21} y={46 - h} width="12" height={h} rx="3" fill={i === bars.length - 1 ? accent : FILL} />
      ))}
      <rect x="4" y="44" width="96" height="28" rx="12" fill={soft} />
      <rect x="16" y="52" width="60" height="4" rx="2" fill={accent} fillOpacity=".5" />
      <rect x="16" y="61" width="40" height="4" rx="2" fill={accent} fillOpacity=".3" />
    </Frame>
  );
}
