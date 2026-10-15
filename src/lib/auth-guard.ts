/**
 * Profil yazma/okuma yetkisi.
 * - Oturum varsa: sadece kendi kullanıcı adı.
 * - Oturum yoksa: yalnızca geliştirme ortamında (misafir mod); canlıda GitHub girişi şart.
 */
export function checkProfileAccess(
  sessionUsername: string | undefined,
  targetUsername: string
): { ok: true } | { ok: false; status: 401 | 403; error: string } {
  if (sessionUsername) {
    if (sessionUsername.toLowerCase() !== targetUsername.toLowerCase()) {
      return { ok: false, status: 403, error: 'Bu profili düzenleme yetkiniz yok.' };
    }
    return { ok: true };
  }
  if (process.env.NODE_ENV === 'production') {
    return { ok: false, status: 401, error: 'Bu işlem için GitHub ile giriş yapmalısın.' };
  }
  return { ok: true };
}
