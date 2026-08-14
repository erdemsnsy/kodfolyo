'use client';

import { useState } from 'react';
import { ThemeType } from '@/types';
import { Palette, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => Promise<void>;
}

interface ThemeOption {
  id: ThemeType;
  name: string;
  desc: string;
  bgPreview: string;
  borderPreview: string;
  accentPreview: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'corporate-dark',
    name: 'Executive Dark',
    desc: 'Kurumsal obsidiyen siyah zemin, yüksek kontrastlı gümüş beyaz tipografi.',
    bgPreview: 'bg-[#0c0d0e] text-white',
    borderPreview: 'border-[#23272e]',
    accentPreview: 'bg-white',
  },
  {
    id: 'cyber-indigo',
    name: 'Cyber Indigo ✨',
    desc: 'Siber çivit tonları, gece mavisi radyal zemin ve neon indigo vurgular.',
    bgPreview: 'bg-[#0b0d1e] text-indigo-300',
    borderPreview: 'border-indigo-500/40',
    accentPreview: 'bg-indigo-500',
  },
  {
    id: 'matrix-mint',
    name: 'Matrix Mint ✨',
    desc: 'Derin Matrix koyu yeşil zemin, naneli canlı cam yeşili vurgular.',
    bgPreview: 'bg-[#040d08] text-emerald-300',
    borderPreview: 'border-emerald-500/40',
    accentPreview: 'bg-emerald-400',
  },
  {
    id: 'terminal-amber',
    name: 'Terminal Amber ✨',
    desc: 'Koyu antrasit zemin üzerine kehribar sarısı CRT hacker komut vurguları.',
    bgPreview: 'bg-[#0f1115] text-amber-400',
    borderPreview: 'border-amber-500/40',
    accentPreview: 'bg-amber-500',
  },
  {
    id: 'dracula-slate',
    name: 'Dracula Slate ✨',
    desc: 'Koyu çelik mavisi zemin üzerine camgöbeği (cyan) ve pembe neonlar.',
    bgPreview: 'bg-[#14151f] text-cyan-300',
    borderPreview: 'border-cyan-400/40',
    accentPreview: 'bg-cyan-400',
  },
  {
    id: 'emerald-slate',
    name: 'Emerald Slate ✨',
    desc: 'Koyu kayrak mavisi zemin ve zümrüt yeşili yetkinlik vurguları.',
    bgPreview: 'bg-[#0b1324] text-emerald-300',
    borderPreview: 'border-teal-500/40',
    accentPreview: 'bg-teal-400',
  },
  {
    id: 'paper-light',
    name: 'Paper Cream',
    desc: 'Sıcak krem kağıt zemin, vintage espresso ve taş renkleri.',
    bgPreview: 'bg-[#fcfbf7] text-[#1c1917]',
    borderPreview: 'border-[#d8cebb]',
    accentPreview: 'bg-[#1c1917]',
  },
  {
    id: 'corporate-light',
    name: 'Executive Light',
    desc: 'Temiz off-white kağıt zemin, kurumsal lacivert-siyah tipografi.',
    bgPreview: 'bg-[#f8fafc] text-[#0f172a]',
    borderPreview: 'border-[#cbd5e1]',
    accentPreview: 'bg-[#0f172a]',
  },
  {
    id: 'modern-dark',
    name: 'Modern Obsidian',
    desc: 'Minimalist saf obsidian siyahı, ultra keskin çinko çizgiler.',
    bgPreview: 'bg-[#050505] text-white',
    borderPreview: 'border-[#27272a]',
    accentPreview: 'bg-zinc-200',
  },
  {
    id: 'minimal-light',
    name: 'Minimal Pure',
    desc: 'Sade saf beyaz minimalist tasarım, yüksek okunabilirlik.',
    bgPreview: 'bg-white text-[#18181b]',
    borderPreview: 'border-[#e4e4e7]',
    accentPreview: 'bg-[#18181b]',
  },
];

export default function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  const [prevTheme, setPrevTheme] = useState<ThemeType>(currentTheme);

  if (currentTheme !== prevTheme) {
    setPrevTheme(currentTheme);
  }

  return (
    <div className="rounded-2xl border border-[#23272e] bg-[#141619] p-6 sm:p-8 shadow-xl space-y-5">
      <div className="flex items-center gap-3 border-b border-[#23272e] pb-5">
        <div className="p-2 rounded-lg bg-white/5 text-white border border-white/10">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#f8fafc]">Portfolyo Teması</h2>
          <p className="text-xs text-[#94a3b8]">
            Bir tema seçin — değişikliklerinizi en üstteki kaydet butonuyla uygulayın.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {THEME_OPTIONS.map((t) => {
          const isSelected = currentTheme === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTheme(t.id)}
              className={`relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'border-white bg-white/10 ring-2 ring-white/40 shadow-lg scale-[1.01]'
                  : 'border-[#23272e] bg-[#0c0d0e] hover:border-[#3d4352] hover:bg-[#111318] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${t.accentPreview}`} />
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  </div>
                  {isSelected && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-slate-950 font-black shadow">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#94a3b8] leading-snug">{t.desc}</p>
              </div>

              {/* Önizleme Kutusu */}
              <div className={`mt-3 p-2 rounded-lg border text-[10px] ${t.borderPreview} ${t.bgPreview} flex items-center justify-between`}>
                <span className="font-semibold">Tema Önizleme</span>
                <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${isSelected ? 'bg-white text-slate-950' : 'bg-black/30 text-white'}`}>
                  {isSelected ? '✓ Seçildi' : 'Seç'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
