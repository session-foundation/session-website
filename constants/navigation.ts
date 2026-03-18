import type { Messages } from 'next-intl';

export interface INavItem {
  href: string;
  target: '_self' | '_blank';
  rel?: string;
  items?: INavList;
}
export type NavItemKey = keyof Omit<Messages['navigation'], 'aria'>;

type INavList = Record<NavItemKey | string, INavItem>;

const NAV_ITEMS: INavList = {
  pro: {
    href: '/pro',
    target: '_self',
  },
  resources: {
    href: '/resources',
    target: '_self',
    items: {
      blog: {
        href: '/blog',
        target: '_self',
      },
      github: {
        href: 'https://github.com/session-foundation',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      docs: {
        href: 'https://docs.getsession.org',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      whitepaper: {
        href: '/whitepaper',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      litepaper: {
        href: '/litepaper',
        target: '_self',
      },
    },
  },
  network: {
    href: '/network',
    target: '_self',
    items: {
      'session token': {
        href: 'https://token.getsession.org/',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    },
  },
  help: {
    href: '/help',
    target: '_self',
    items: {
      faq: {
        href: '/faq',
        target: '_self',
      },
      support: {
        href: 'https://sessionapp.zendesk.com/hc/en-us',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    },
  },
  donate: {
    href: '/donate',
    target: '_self',
  },
};

const NAVIGATION = {
  NAV_ITEMS,
};

export default NAVIGATION;
