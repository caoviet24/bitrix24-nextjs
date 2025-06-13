import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    experimental: {
        serverActions: {
            allowedOrigins: ['*'],
        },
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            return config;
        }
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            os: false,
        };

        return config;
    },
};

export default nextConfig;
