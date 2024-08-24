/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['pc-kala.storage.iran.liara.space'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pc-kala.storage.iran.liara.space',
                port: '',
                pathname: '*',
            },
        ],
    }
};

export default nextConfig;
