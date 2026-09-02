'use client';

import { ShieldCheck, RefreshCw, FolderGit2, Layers, Link2, Sparkles } from 'lucide-react';
import Kodi from '@/components/mascot/Kodi';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

const FEATURES = [
  {
    icon: RefreshCw,
    title: 'Otomatik GitHub API Senkronizasyonu',
    desc: 'GitHub kullanıcı adını gir. Biyografin, en çok yıldız alan projelerin ve dil yetkinliklerin canlı çekilsin.',
    wide: true,
  },
  {
    icon: Sparkles,
    title: 'Canlı & Karakterli Tasarım',
    desc: 'Şablon gibi durmayan, enerjik bir kimlikle öne çık — sosyal medyada paylaşılınca fark yaratır.',
    wide: false,
  },
  {
    icon: FolderGit2,
    title: 'Prestijli Proje Kartları',
    desc: 'Repoların yıldız sayıları, dil etiketleri ve doğrudan GitHub linkleri ile yüksek okunabilirlikte listelenir.',
    wide: false,
  },
  {
    icon: ShieldCheck,
    title: 'Supabase Akıllı Önbellek',
    desc: 'GitHub API rate limitlerine takılmadan yüksek performanslı ve kesintisiz yükleme garantisi.',
    wide: false,
  },
  {
    icon: Layers,
    title: 'Kurumsal Tema Seçenekleri',
    desc: 'Executive Dark, Executive Light, Terminal Amber ve Dracula Slate temalarından tarzına uyanı seç.',
    wide: false,
  },
  {
    icon: Link2,
    title: 'Özel CV & LinkedIn Bağlantıları',
    desc: 'Özgeçmiş PDF dosyanı ve LinkedIn profilini portfolyona dahil et (İstediğin zaman ekleyebilir veya silebilirsin).',
    wide: true,
  },
];

const CHIP_COLORS = ['#1fd88f', '#f0b429', '#ff5c8a'];

export default function LandingFeatures() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        className="text-center space-y-2 mb-10 relative"
      >
        <div className="hidden sm:block absolute -top-4 right-4">
          <Kodi pose="idle" size={56} />
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-[#f2f7f0]">
          Neden <span className="text-[#f0b429]">Kodfolyo</span>?
        </h2>
        <p className="text-xs sm:text-sm text-[#c9d1cb]">
          Geliştiriciler ve mühendisler için iş hayatında prestij sağlayan sade altyapı
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          const chipColor = CHIP_COLORS[idx % CHIP_COLORS.length];
          return (
            <motion.div
              key={feat.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (idx % 2) * 0.08 }}
              className={`p-5 rounded-3xl border border-[#384139] bg-[#17201b] space-y-3 shadow-[4px_4px_0_0_#0d1310] hover:-translate-y-1 transition-transform ${feat.wide ? 'md:col-span-2' : ''}`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: chipColor, boxShadow: `3px 3px 0 0 #0d1310` }}
              >
                <Icon className="w-5 h-5 text-[#0d1310]" />
              </div>
              <div className="text-sm font-bold text-[#f2f7f0]">{feat.title}</div>
              <p className="text-xs text-[#c9d1cb] leading-relaxed">{feat.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
