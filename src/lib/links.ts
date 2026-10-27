// اللوحة على نفس الدومين في الإنتاج. هنا التجربة على دومين ثاني، فالروابط كاملة.
export const APP_URL: string = import.meta.env.VITE_APP_URL ?? "https://ilanakdhaki.com";
/** الـ API على نفس دومين اللوحة (/api). صفحة الدخول تكلّمه مباشرة */
export const API_URL: string = import.meta.env.VITE_API_URL ?? APP_URL;
/** صفحاتنا (signup/ و login/ في نفس الموقع). حالياً نصمم، فما نودي لصفحات المنصة */
export const SIGNUP_URL = "/signup/";
export const LOGIN_URL = "/login/";
