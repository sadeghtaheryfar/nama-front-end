/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
        appDir: true,
        enableUndici: false,
    },
    reactStrictMode: false,
    missingSuspenseWithCSRBailout: false,

    async headers() {
        return [
            {
                source: "/api/:path((?!profile$).*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-store, no-cache, must-revalidate, proxy-revalidate",
                    },
                    {
                        key: "Pragma",
                        value: "no-cache",
                    },
                    {
                        key: "Expires",
                        value: "0",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
