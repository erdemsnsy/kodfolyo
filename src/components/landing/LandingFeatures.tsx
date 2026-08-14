'use client';

import { ShieldCheck, RefreshCw, FolderGit2, Layers, Link2 } from 'lucide-react';

const FEATURES = [
  {
    icon: RefreshCw,
    title: 'Otomatik GitHub API Senkronizasyonu',
    desc: 'GitHub kullanıcı adını gir. Biyografin, en çok yıldız alan projelerin ve dil yetkinliklerin canlı çekilsin.',
  },
  {
    icon: ShieldCheck,
    title: 'Kurumsal & Yalın Tasarım',
    desc: 'Gösterişli çocuksu sarı ve pembe renkler yerine iş dünyasında fark yaratan kurumsal ve sade görünüm.',
  },
  {
    icon: FolderGit2,
    title: 'Prestijli Proje Kartları',
    desc: 'Repoların yıldız sayıları, dil etiketleri ve doğrudan GitHub linkleri ile yüksek okunabilirlikte listelenir.',
  },
  {
    icon: ShieldCheck,
    title: 'Supabase Akıllı Önbellek',
    desc: 'GitHub API rate limitlerine takılmadan yüksek performanslı ve kesintisiz yükleme garantisi.',
  },
  {
    icon: Layers,
    title: 'Kurumsal Tema Seçenekleri',
    desc: 'Executive Dark, Executive Light, Terminal Amber ve Dracula Slate temalarından tarzına uyanı seç.',
  },
  {
    icon: Link2,
    title: 'Özel CV & LinkedIn Bağlantıları',
    desc: 'Özgeçmiş PDF dosyanı ve LinkedIn profilini portfolyona dahil et (İstediğin zaman ekleyebilir veya silebilirsin).',
  },
];

export default function LandingFeatures() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-xl sm:text-3xl font-extrabold text-white">
          Neden <span className="text-slate-300">Kodfolyo</span>?
        </h2>
        <p className="text-xs sm:text-sm text-[#94a3b8]">
          Geliştiriciler ve mühendisler için iş hayatında prestij sağlayan sade altyapı
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="p-5 rounded-2xl border border-[#23272e] bg-[#141619] space-y-2 hover:border-slate-500/50 transition"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Icon className="w-4 h-4 text-slate-300" />
                <span>{feat.title}</span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
