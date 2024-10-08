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
        ],
    },
};

module.exports = nextConfig;
