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
};

export default nextConfig;
