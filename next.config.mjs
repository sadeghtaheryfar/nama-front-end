/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ارورهای ESLint رو نادیده می‌گیره
  },
  typescript: {
    ignoreBuildErrors: true, // ارورهای TypeScript رو نادیده می‌گیره
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
    appDir: true,
    enableUndici: false, // بعضی ارورهای مربوط به فچینگ رو کم می‌کنه
  },
  reactStrictMode: false, // ارورهای شدید React رو خاموش می‌کنه
  missingSuspenseWithCSRBailout: false,
  
  // تنظیمات جدید برای جلوگیری از کش شدن API ها
  async headers() {
      return [
          {
              source: '/api/:path*',
              headers: [
                  {
                      key: 'Cache-Control',
                      value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                  },
                  {
                      key: 'Pragma',
                      value: 'no-cache',
                  },
                  {
                      key: 'Expires',
                      value: '0',
                  },
              ],
          },
      ];
  },
};

export default nextConfig;