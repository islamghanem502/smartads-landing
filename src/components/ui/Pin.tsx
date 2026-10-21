/* دبوس ضغط: مرسوم مسطّح بس يبان مجسّم. رأس مقبّب بإضاءة من فوق يسار، حافة غامقة تحته،
   إبرة مايلة شوي، وظل واقع على الورقة. نقطة التثبيت هي مركز الرأس (16, 14). */

export const PIN_BOX = 40;
export const PIN_AT = { x: 16, y: 14 };

/** يتحط مرة وحدة في الصفحة، وكل دبوس يستخدمه بـ <use>. */
export function PinDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <radialGradient id="pin-dome" cx="36%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ff8a7a" />
          <stop offset=".38" stopColor="#e2321f" />
          <stop offset=".8" stopColor="#a8150a" />
          <stop offset="1" stopColor="#7d0e06" />
        </radialGradient>
        <linearGradient id="pin-collar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e0b05" />
          <stop offset=".5" stopColor="#9b1408" />
          <stop offset="1" stopColor="#5a0904" />
        </linearGradient>
        <filter id="pin-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <symbol id="pushpin" viewBox={`0 0 ${PIN_BOX} ${PIN_BOX}`} overflow="visible">
          {/* الظل على الورقة، تحت يمين */}
          <ellipse cx="22.5" cy="24.5" rx="8.5" ry="5" fill="rgba(0,0,0,.42)" filter="url(#pin-blur)" />
          {/* الإبرة: تطلع من تحت الرأس وتدخل الورقة عند الظل */}
          <path d="M17.4 18.6 21.6 25" stroke="#c9c9c2" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18.2 18.8 21.9 24.6" stroke="#ffffff" strokeOpacity=".55" strokeWidth=".5" strokeLinecap="round" />
          {/* الحافة تحت الرأس */}
          <ellipse cx="16.4" cy="17.4" rx="7.4" ry="4.4" fill="url(#pin-collar)" />
          {/* الرأس */}
          <circle cx="16" cy="13.6" r="8" fill="url(#pin-dome)" />
          <path d="M9.6 11.2a7 7 0 0 1 6.6-4.6" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1" strokeLinecap="round" />
          <ellipse cx="13" cy="10.4" rx="2.6" ry="1.7" fill="#fff" fillOpacity=".78" transform="rotate(-32 13 10.4)" />
        </symbol>
      </defs>
    </svg>
  );
}

/** دبوس في HTML: مركز رأسه على النقطة اللي تحطه فيها. */
export function Pin({ className = "", size = 30 }: { className?: string; size?: number }) {
  const s = size / PIN_BOX;
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      className={`pointer-events-none absolute ${className}`}
      style={{ marginLeft: -PIN_AT.x * s, marginTop: -PIN_AT.y * s }}
    >
      <use href="#pushpin" width={size} height={size} />
    </svg>
  );
}
