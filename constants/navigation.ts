export interface INavItem {
  href: string;
  alt: string;
  target: '_self' | '_blank';
  rel?: string;
  items?: INavList;
}

interface INavList {
  [key: string]: INavItem; // key is what user sees
}

const NAV_ITEMS: INavList = {
  Blog: {
    href: '/blog',
    alt: `Link to Session's blogposts`,
    target: '_self',
  },
  Resources: {
    href: '/resources',
    alt: 'Heading of Session Resources Links',
    target: '_self',
    items: {
      GitHub: {
        href: 'https://github.com/session-foundation',
        alt: 'Link to Session Foundation GitHub page',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      Docs: {
        href: 'https://docs.getsession.org',
        alt: 'Link to Session Docs website',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      Whitepaper: {
        href: '/whitepaper',
        alt: 'Link to Session Whitepaper',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      Litepaper: {
        href: '/litepaper',
        alt: 'Link to Session Litepaper',
        target: '_self',
      },
    },
  },
  Network: {
    href: '/network',
    alt: 'Heading of Session Network Links',
    target: '_self',
    items: {
      'Session Token': {
        href: 'https://token.getsession.org/',
        alt: 'Link to Session Token website',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    },
  },
  Help: {
    href: '/help',
    alt: 'Heading of Session Help Links',
    target: '_self',
    items: {
      FAQ: { href: '/faq', alt: `Link to Session's FAQs`, target: '_self' },
      Support: {
        href: 'https://sessionapp.zendesk.com/hc/en-us',
        alt: 'Link to Session Support via Zendesk',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    },
  },
};

const NAVIGATION = {
  NAV_ITEMS,
};

export default NAVIGATION;
