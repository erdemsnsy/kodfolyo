'use client';

import { useState } from 'react';
import { QrCode, Copy, Check, X, Share2 } from 'lucide-react';
import { generateQRCodeSVG } from '@/lib/qr';
import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';

interface ShareModalProps {
  username: string;
  themeType?: ThemeType;
  customAccent?: string | null;
  onClose: () => void;
}

export default function ShareModal({ username, themeType, customAccent, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const theme = getTheme(themeType, customAccent);

  const portfolioUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${username}`
    : `https://kodfolyo.dev/${username}`;

  const qrSvg = generateQRCodeSVG(portfolioUrl, 180, '#09090b', '#ffffff');

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const shareText = encodeURIComponent(`@${username} Kodfolyo Yazılımcı Portfolyosu ve Projeleri`);
  const encodedUrl = encodeURIComponent(portfolioUrl);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-[#23272e] bg-[#141619] p-6 shadow-2xl space-y-6">
        {/* Modal Başlık */}
        <div className="flex items-center justify-between border-b border-[#23272e] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Portfolyonu Paylaş</h3>
              <p className="text-xs text-[#94a3b8]">@{username} adresine özel QR kod ve bağlantı</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#23272e] bg-[#0c0d0e] text-[#64748b] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Kod Alanı */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-[#23272e] bg-[#0c0d0e] space-y-3">
          <div
            dangerouslySetInnerHTML={{ __html: qrSvg }}
            className="shadow-xl rounded-xl overflow-hidden"
          />
          <p className="text-[11px] text-[#94a3b8] flex items-center gap-1 font-mono">
            <QrCode className="w-3.5 h-3.5 text-slate-400" />
            Kamera veya QR okuyucu ile tara
          </p>
        </div>

        {/* Bağlantı Kopyalama Kutusu */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">Portfolyo Bağlantın</label>
          <div className="flex items-center gap-2 p-2 rounded-xl border border-[#23272e] bg-[#0c0d0e]">
            <input
              type="text"
              readOnly
              value={portfolioUrl}
              className="w-full bg-transparent text-xs text-white outline-none px-2 font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold shadow transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sosyal Medya Paylaşım Butonları */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold transition"
          >
            <span>WhatsApp</span>
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-semibold transition"
          >
            <span>Twitter / X</span>
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-semibold transition"
          >
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}
