// Site genelinde tek imza hareket dili — buton/kart hover'ları ve scroll-reveal'lar
// aynı yaylı eğriyi kullanır (spec: "App Shell Redesign" tasarım dokümanı).
export const BOUNCE_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: BOUNCE_EASE } },
};

export const fadeUpStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// Scroll'a girince bir kere oynayan, sonra sabitlenen reveal — her bölüm için ortak ayar.
export const revealOnce = {
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true, amount: 0.25 },
};
