export interface IMetadata {
  DESCRIPTION: string;
  TYPE?: string;
  CANONICAL_URL?: string;
  OG_IMAGE?: {
    URL: string;
    WIDTH: number;
    HEIGHT: number;
    ALT: string;
  };
  TAGS?: string[];
  ARTICLE_SECTION?: string;
  PUBLISHED_TIME?: string;
}

const METADATA = {
  HOST_URL:
    process.env.NEXT_PUBLIC_SITE_ENV === 'production'
      ? 'https://getsession.org'
      : 'https://staging.getsession.org',
  SITE_NAME: 'Session',
  TITLE: 'Session | Send Messages, Not Metadata. | Private Messenger',
  DESCRIPTION:
    'Session is a private messenger that aims to remove any chance of metadata collection by routing all messages through an onion routing network.',
  TAGS: [
    'Privacy',
    'co-op',
    'Community contribution',
    'decentralisation',
    'decentralised',
    'messaging',
    'Private messaging',
  ],
  OG_TYPE: 'website',
  OG_IMAGE: {
    URL: '/assets/images/logo-black.png',
    WIDTH: 804,
    HEIGHT: 665,
    ALT: 'Session Logo Black Background',
  },
  LOCALE: 'en_US',
  FAVICON: {
    MEDIUM: '/favicon-32x32.png',
    SMALL: '/favicon-16x16.png',
    APPLE_TOUCH_ICON: '/apple-touch-icon.png',
  },
  MANIFEST: '/site.webmanifest',
  MASK_ICON: { PATH: '/safari-pinned-tab.svg', COLOR: '#00f782' },
  MSAPPLICATION_TILECOLOR: '#343132',
  THEME_COLOR: '#ffffff',
  TWITTER_CREATOR: 'session_app',
  ITUNES_ID: 'app-id=1470168868',
  404: {
    DESCRIPTION: 'It looks like the link pointing here was faulty.',
  },
  BLOG_PAGE: {
    TYPE: 'article',
    DESCRIPTION:
      'View the Session Blogs. | Session is an end-to-end encrypted messenger that removes sensitive metadata collection.',
    OG_IMAGE: {
      URL: '/assets/images/send-messages-not-metadata.jpg',
      WIDTH: 1024,
      HEIGHT: 1024,
      ALT: 'Mysterious man on the phone. Heading is Use Session.',
    },
  },
  DOWNLOAD_PAGE: {
    TYPE: 'article',
    DESCRIPTION:
      'Download Session Today | Session is an end-to-end encrypted messenger that removes sensitive metadata collection for all operating systems.',
    OG_IMAGE: {
      URL: '/assets/images/send-messages-not-metadata.jpg',
      WIDTH: 1024,
      HEIGHT: 1024,
      ALT: 'Mysterious man on the phone. Heading is Use Session.',
    },
  },
  FAQ_PAGE: {
    TYPE: 'FAQPage',
    DESCRIPTION:
      "Session's FAQ. Find answers to some of the most frequently asked questions about Session — info on the team, the tech, and the technicalities.",
    OG_IMAGE: {
      URL: '/assets/images/faq.png',
      WIDTH: 800,
      HEIGHT: 800,
      ALT: 'Frequently Asked Questions heading with redacted text below',
    },
  },
  HELP_PAGE: {
    DESCRIPTION: 'How you can help. A Session Community Help Guide Document.',
  },
  LITEPAPER_PAGE: {
    DESCRIPTION:
      'Session is a decentralised messenger that supports completely private, secure, and anonymous communications.',
    OG_IMAGE: {
      URL: '/assets/images/litepaper.png',
      WIDTH: 1200,
      HEIGHT: 627,
      ALT: 'Black background with a neon white Session logo with Litepaper written as a heading',
    },
    TAGS: [
      'Session',
      'Session Foundation',
      'litepaper',
      'lightpaper',
      'metadata',
      'messenger',
      'encryption',
      'encrypted',
      'onion routing',
      'decentralisation',
      'Oxen',
      'blockchain',
      'messaging',
      'private',
      'privacy',
    ],
  },
  COMMUNITY_PAGE: {
    DESCRIPTION:
      'Join the Session Community and meet the vibrant group of people building, running, and using Session.',
    OG_IMAGE: {
      URL: '/assets/images/faq.png',
      WIDTH: 1024,
      HEIGHT: 1024,
      ALT: 'Frequently Asked Questions heading with redacted text below',
    },
  },
};

export default METADATA;
