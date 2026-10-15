// Sitenin herkese açık adresi. Özel alan adı bağlanınca NEXT_PUBLIC_SITE_URL ile değiştirilir.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kodfolyo.vercel.app').replace(/\/$/, '');
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');
