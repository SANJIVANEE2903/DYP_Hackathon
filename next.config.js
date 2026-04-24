/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Allow the ngrok host for development HMR
    allowedDevOrigins: ['semidaily-unamusedly-nerissa.ngrok-free.dev'],

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3001/api/:path*',
            },
        ];
    },

    turbopack: {
        root: __dirname,
    },
};

module.exports = nextConfig;