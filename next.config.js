const withSvgr = require('@newhighsco/next-plugin-svgr');

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' ${
    process.env.NODE_ENV == 'development'
      ? "'unsafe-eval' 'unsafe-inline' "
      : ''
  }*.ctfassets.net *.youtube.com *.twitter.com;
  child-src 'self' *.ctfassets.net *.youtube.com player.vimeo.com *.twitter.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src 'self' blob: data: *.ctfassets.net *.youtube.com *.twitter.com;
  media-src 'self' *.youtube.com;
  connect-src *;
  font-src 'self' blob: data: fonts.gstatic.com maxcdn.bootstrapcdn.com;
  worker-src 'self' blob:;
`;

const securityHeaders = () => {
  const headers = [
    {
      key: 'X-DNS-Prefetch-Control',
      value: 'on',
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block',
    },
    {
      key: 'X-Frame-Options',
      value: 'SAMEORIGIN',
    },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'Content-Security-Policy',
      value: ContentSecurityPolicy.replace(/\n/g, ''),
    },
  ];
  return headers;
};

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
  trailingSlash: false,
  productionBrowserSourceMaps: false,

  env: {
    STAGING_SECRET: process.env.STAGING_SECRET,
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENVIRONMENT_ID: process.env.CONTENTFUL_ENVIRONMENT_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_PREVIEW_TOKEN: process.env.CONTENTFUL_PREVIEW_TOKEN,
    CAMPAIGN_MONITOR_CLIENT_ID: process.env.CAMPAIGN_MONITOR_CLIENT_ID,
    CAMPAIGN_MONITOR_API_KEY: process.env.CAMPAIGN_MONITOR_API_KEY,
    CAMPAIGN_MONITOR_LIST_SESSION_ID:
      process.env.CAMPAIGN_MONITOR_LIST_SESSION_ID,
    CAMPAIGN_MONITOR_LIST_MARKET_RESEARCH_ID:
      process.env.CAMPAIGN_MONITOR_LIST_MARKET_RESEARCH_ID,
    MAILERLITE_API_KEY: process.env.MAILERLITE_API_KEY,
    MAILERLITE_GROUP_ID: process.env.MAILERLITE_GROUP_ID,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders(),
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [{
      hostname: 'downloads.ctfassets.net'
    }, {
      hostname: 'images.ctfassets.net'
    }],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 86400,
  },

  async redirects() {
    return [
      {
        source: '/android',
        destination:
          'https://play.google.com/store/apps/details?id=network.loki.messenger',
        permanent: true,
      },
      {
        source: '/apk',
        destination:
          'https://github.com/session-foundation/session-android/releases',
        permanent: true,
      },
      {
        source: '/iphone',
        destination:
          'https://apps.apple.com/app/session-private-messenger/id1470168868?ls=1',
        permanent: true,
      },
      {
        source: '/f-droid',
        destination: 'https://fdroid.getsession.org/',
        permanent: true,
      },
      {
        source: '/whitepaper',
        destination: 'https://arxiv.org/pdf/2002.04609.pdf',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/feed',
        destination: '/api/feed/rss',
      },
      {
        source: '/feed/:slug',
        destination: '/api/feed/:slug',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/linux',
        destination: '/api/download/linux',
      },
      {
        source: '/litepaper/pdf',
        destination: '/api/litepaper',
      },
      {
        source: '/login',
        destination: '/api/login',
      },
      {
        source: '/logout',
        destination: '/api/logout',
      },
      {
        source: '/mac',
        destination: '/api/download/mac-arm64',
      },
      {
        source: '/mac-arm64',
        destination: '/api/download/mac-arm64',
      },
      {
        source: '/mac-x64',
        destination: '/api/download/mac-x64',
      },
      {
        source: '/windows',
        destination: '/api/download/windows',
      },
      {
        source: '/blog/:slug',
        destination: '/:slug',
      },
    ];
  },

  // Webpack optimizations for better bundle splitting
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },
};

module.exports = withSvgr(nextConfig);
