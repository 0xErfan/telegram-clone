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
    }
};

export default nextConfig;
