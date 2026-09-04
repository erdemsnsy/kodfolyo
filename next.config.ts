import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Kodi maskot avatarı (public/kodi-avatar.svg) next/image ile render edilebilsin diye —
    // kaynak bizim kendi statik dosyamız, kullanıcı yüklemesi değil.
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
