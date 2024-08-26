/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pc-kala.storage.iran.liara.space',
                pathname: '**',
            },
        ],
        domains: ['pc-kala.storage.iran.liara.space'], // Keep this line for backward compatibility
    }
};

export default nextConfig;
