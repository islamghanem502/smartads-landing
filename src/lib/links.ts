// اللوحة على نفس الدومين في الإنتاج. هنا التجربة على دومين ثاني، فالروابط كاملة.
export const APP_URL: string = import.meta.env.VITE_APP_URL ?? "https://ilanakdhaki.com";
/** الـ API على نفس دومين اللوحة (/api). صفحة الدخول تكلّمه مباشرة */
export const API_URL: string = import.meta.env.VITE_API_URL ?? APP_URL;
export const SIGNUP_URL = `${APP_URL}/auth/custom-signup`;
/** صفحتنا (login/index.html) */
export const LOGIN_URL = "/login/";
