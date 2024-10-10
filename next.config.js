/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    images: {
        remotePatterns: [
            {
                hostname: 'lh3.googleusercontent.com',
                protocol: 'https',
            },
            {
                hostname: 'www.hollandsevelden.nl',
                protocol: 'https',
            },
        ],
    },
};

module.exports = nextConfig;
