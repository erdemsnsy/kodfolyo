/**
 * Kodfolyo AI Biyografi Oluşturucu Altyapısı (Devre Dışı / Hazırlık Aşaması)
 * 
 * Bu modül ileride OpenAI, Google Gemini veya Anthropic Claude gibi bir LLM API'si
 * entegre edilmek üzere mimari olarak hazır tutulmaktadır.
 * Varsayılan olarak IS_AI_ENABLED = false modundadır.
 */

export const IS_AI_ENABLED = true;

export interface AIBioRequest {
  username: string;
  name?: string;
  company?: string;
  location?: string;
  topLanguages?: string[];
  tone?: 'professional' | 'creative' | 'minimal';
}

export interface AIBioResponse {
  success: boolean;
  suggestedBios: string[];
  message?: string;
}

/**
  AI Biyografi Öneri Fonksiyonu
 */
export async function generateBioSuggestions(req: AIBioRequest): Promise<AIBioResponse> {
  const displayName = req.name || `@${req.username}`;
  const locationText = req.location ? ` | ${req.location}` : '';
  const companyText = req.company ? ` @ ${req.company}` : '';
  const langs = req.topLanguages && req.topLanguages.length > 0 ? req.topLanguages.join(', ') : 'Web & Yazılım';

  if (req.tone === 'creative') {
    return {
      success: true,
      suggestedBios: [
        `🚀 ${displayName}${companyText} | ${langs} ile fikirleri üretime dönüştüren tutkulu geliştirici.${locationText}`,
        `💻 Kod yazmayı, açık kaynak ekosistemine katkı sunmayı ve yeni teknolojiler keşfetmeyi seven yazılım tutkunu.`,
        `⚡ ${langs} tabanlı modern çözümler geliştiren ve kullanıcı odaklı dijital ürünler inşa eden geliştirici.`,
      ],
    };
  }

  if (req.tone === 'minimal') {
    return {
      success: true,
      suggestedBios: [
        `${displayName} — ${langs} Developer${companyText}.`,
        `Yazılım Geliştirici | ${langs}${locationText}.`,
        `Temiz kod, modern web mimarisi ve ${langs} projeleri.`,
      ],
    };
  }

  // Varsayılan: Professional
  return {
    success: true,
    suggestedBios: [
      `${displayName} | ${langs} teknolojilerinde uzmanlaşmış yazılım geliştiricisi${companyText}. Temiz kod ve ölçeklenebilir sistemler üzerine çalışmaktadır.${locationText}`,
      `Geliştirici & Tasarım Odaklı Mühendis | Ana odak: ${langs}. Açık kaynak ve performans odaklı web projeleri inşa etmektedir.`,
      `${displayName} — Modern web ve mobil mimarileri geliştiren ${langs} uygulayıcısı.${locationText}`,
    ],
  };
}
