/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.iran.liara.space',
                port: '',
                pathname: '/pc-kala/**',
            },
        ],
    },
};

export default nextConfig;
