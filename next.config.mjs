/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'uhcwogrfbacpeeczxigy.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
        // SSG için görsel optimizasyonu
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 gün cache
    },
    // SSG performans optimizasyonları
    experimental: {
        optimizePackageImports: ['@supabase/supabase-js'],
    },
    // CDN için cache headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
