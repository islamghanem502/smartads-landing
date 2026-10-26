// اللوحة على نفس الدومين في الإنتاج. هنا التجربة على دومين ثاني، فالروابط كاملة.
export const APP_URL: string = import.meta.env.VITE_APP_URL ?? "https://ilanakdhaki.com";
export const SIGNUP_URL = `${APP_URL}/auth/custom-signup`;
export const LOGIN_URL = `${APP_URL}/auth/login`;
