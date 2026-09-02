'use client';

import { useState } from 'react';
import { ThemeType } from '@/types';
import { themes, getTheme } from '@/lib/theme';
import { Palette, Check, RotateCcw } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  currentAccent: string | null;
  onSelectTheme: (theme: ThemeType) => Promise<void>;
  onSelectAccent: (accent: string | null) => Promise<void>;
}

const ACCENT_SWATCHES = ['#1fd88f', '#f0b429', '#ff5c8a', '#10b981', '#ec4899', '#8b5cf6', '#f43f5e'];

export default function ThemeSelector({ currentTheme, currentAccent, onSelectTheme, onSelectAccent }: ThemeSelectorProps) {
  const currentIsLight = getTheme(currentTheme).isLight;
  const [group, setGroup] = useState<'dark' | 'light'>(currentIsLight ? 'light' : 'dark');
  const [hexInput, setHexInput] = useState(currentAccent ?? '');

  const visibleThemes = Object.values(themes).filter((t) => t.isLight === (group === 'light'));

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      onSelectAccent(value);
    }
  };

  return (
    <div className="rounded-3xl border border-[#384139] bg-[#17201b] p-6 sm:p-8 shadow-[5px_5px_0_0_#0d1310] space-y-5">
      <div className="flex items-center justify-between gap-4 border-b border-[#384139] pb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#1fd88f]/10 text-[#1fd88f] border border-[#1fd88f]/25">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#f2f7f0]">Portfolyo Teması</h2>
            <p className="text-xs text-[#c9d1cb]">
              Bir tema seçin, isterseniz vurgu rengini özelleştirin — değişikliklerinizi en üstteki kaydet butonuyla uygulayın.
            </p>
          </div>
        </div>

        <div className="flex bg-[#0d1310] border border-[#384139] rounded-full p-1 gap-0.5">
          {(['dark', 'light'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                group === g ? 'bg-[#1fd88f] text-[#0d1310]' : 'text-[#c9d1cb]'
              }`}
            >
              {g === 'dark' ? 'Koyu' : 'Açık'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleThemes.map((t) => {
          const isSelected = currentTheme === t.id;
          const previewAccent = isSelected && currentAccent ? currentAccent : t.accentColor;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTheme(t.id)}
              className={`relative flex flex-col gap-2.5 p-4 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'border-[#1fd88f] bg-[#1e2a23] shadow-[3px_3px_0_0_#1fd88f]'
                  : 'border-[#384139] bg-[#0d1310] hover:border-[#93a297]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: previewAccent }} />
                  <h4 className="text-sm font-bold text-[#f2f7f0]">{t.name}</h4>
                </div>
                {isSelected && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1fd88f] text-[#0d1310]">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                )}
              </div>

              {/* Canlı önizleme — theme.ts'nin gerçek renklerinden üretilir */}
              <div
                className="rounded-xl p-2.5 flex flex-col gap-2"
                style={{ background: t.bgHex, border: `1px solid ${t.borderHex}` }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: previewAccent }} />
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="h-1.5 rounded-full" style={{ width: '55%', background: t.textPrimaryHex }} />
                    <span className="h-1 rounded-full opacity-70" style={{ width: '35%', background: t.textSecondaryHex }} />
                  </div>
                </div>
                <span
                  className="self-start text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: previewAccent, color: '#ffffff' }}
                >
                  @kullaniciadi
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#384139] pt-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[11px] font-bold text-[#c9d1cb] uppercase tracking-wide">Accent Rengi</span>
            <p className="text-[11px] text-[#93a297]">Opsiyonel — seçili temanın üzerine uygulanır.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setHexInput('');
              onSelectAccent(null);
            }}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#c9d1cb] hover:text-[#f2f7f0] border border-[#384139] bg-[#0d1310] px-3 py-1.5 rounded-full transition"
          >
            <RotateCcw className="w-3 h-3" />
            Sıfırla
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {ACCENT_SWATCHES.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => {
                setHexInput(hex);
                onSelectAccent(hex);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: hex,
                boxShadow: currentAccent === hex ? '0 0 0 2px #0d1310, 0 0 0 4px #f2f7f0' : 'none',
              }}
            >
              {currentAccent === hex && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </button>
          ))}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border border-[#384139]" style={{ backgroundColor: hexInput || '#0d1310' }} />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#RRGGBB"
              className="w-28 px-3 py-2 rounded-lg border border-[#384139] bg-[#0d1310] text-[#f2f7f0] font-mono text-xs focus:border-[#1fd88f] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
