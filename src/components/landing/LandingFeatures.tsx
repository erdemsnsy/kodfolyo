'use client';

import { ShieldCheck, RefreshCw, FolderGit2, Layers, Link2, Sparkles } from 'lucide-react';
import Kodi from '@/components/mascot/Kodi';

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

const CHIP_COLORS = ['#ff5a3c', '#38bdf8'];

export default function LandingFeatures() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div className="text-center space-y-2 mb-10 relative">
        <div className="hidden sm:block absolute -top-4 right-4">
          <Kodi pose="idle" size={56} />
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-[#fdf6ec]">
          Neden <span className="text-[#38bdf8]">Kodfolyo</span>?
        </h2>
        <p className="text-xs sm:text-sm text-[#d6d0c7]">
          Geliştiriciler ve mühendisler için iş hayatında prestij sağlayan sade altyapı
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          const chipColor = CHIP_COLORS[idx % CHIP_COLORS.length];
          return (
            <div
              key={feat.title}
              className={`p-5 rounded-3xl border border-[#3a3530] bg-[#1f1a16] space-y-3 shadow-[4px_4px_0_0_#14110f] hover:-translate-y-0.5 transition-transform ${feat.wide ? 'md:col-span-2' : ''}`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: chipColor }}
              >
                <Icon className="w-4 h-4 text-[#14110f]" />
              </div>
              <div className="text-xs font-bold text-[#fdf6ec]">{feat.title}</div>
              <p className="text-xs text-[#d6d0c7] leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
