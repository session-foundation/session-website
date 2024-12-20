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
  GitHub: {
    href: 'https://github.com/session-foundation',
    alt: 'Link to Session Foundation GitHub page',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  Blog: {
    href: '/blog',
    alt: `Link to Session's blogposts`,
    target: '_self',
  },
  Technicals: {
    href: '/technicals',
    alt: 'Heading of Session Technical Links',
    target: '_self',
    items: {
      Litepaper: {
        href: '/litepaper',
        alt: 'Link to Session Litepaper',
        target: '_self',
      },
      Whitepaper: {
        href: '/whitepaper',
        alt: 'Link to Session Whitepaper',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      Documentation: {
        href: 'https://docs.oxen.io/products-built-on-oxen/session',
        alt: 'Link to Session Docs on the Oxen website',
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
