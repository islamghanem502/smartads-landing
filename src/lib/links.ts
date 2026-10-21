// اللوحة على نفس الدومين في الإنتاج. هنا التجربة على دومين تاني، فالروابط كاملة.
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ilanakdhaki.com";
export const SIGNUP_URL = `${APP_URL}/auth/custom-signup`;
export const LOGIN_URL = `${APP_URL}/auth/login`;
