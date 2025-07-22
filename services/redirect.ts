import config from 'next.config';
import { CMS } from '@/constants';

// https://nextjs.org/docs/api-reference/next.config.js/redirects
export interface IRedirection {
  source: string;
  destination: string;
  permanent: boolean;
}

// NOTE should update periodically
let fallbackVersion = '1.16.0';
// NOTE begin checking from when server is started
let lastChecked = Date.now();

async function fetchLatestVersion(repo: string) {
  const now = Date.now();
  // Only update once per revalidation
  if (now - lastChecked > 1000 * CMS.GITHUB_API_RATE) {
    const res = await fetch(
      `https://api.github.com/repos/session-foundation/${repo}/releases/latest`
    );
    const data = await res.json();
    if (!data) return fallbackVersion;

    if (res.status !== 200) {
      console.warn(
        `Redirect Service: Code ${res.status} | ${data.message}`,
        `${data.documentation && `| See ${data.documentation}`}`
      );
      console.log(
        `Redirect Service: Falling back to version ${fallbackVersion}. Last checked on ${new Date(
          lastChecked
        ).toUTCString()}.}`
      );
      return fallbackVersion;
    }

    const foundVersion = data.tag_name.split('v')[1];

    if (foundVersion && foundVersion !== fallbackVersion) {
      fallbackVersion = foundVersion;
      lastChecked = Date.now();
      console.log(
        `Redirect Service: Fetched new version from GitHub ${fallbackVersion} at ${new Date(
          lastChecked
        ).toUTCString()}.`
      );
    }
  }
  // NOTE used for debugging purposes
  // else {
  //   console.log(
  //     'Too early to revalidate. Revalidating in',
  //     (1000 * CMS.GITHUB_API_RATE - (now - lastChecked)) / 1000,
  //     'seconds.'
  //   );
  // }

  return fallbackVersion;
}

async function fetchDynamicRedirects() {
  const desktopVersion = await fetchLatestVersion('session-desktop');
  const redirects: IRedirection[] = [
    {
      source: '/linux',
      destination: `https://github.com/session-foundation/session-desktop/releases/download/v${desktopVersion}/session-desktop-linux-x86_64-${desktopVersion}.AppImage`,
      permanent: false,
    },
    {
      source: '/mac-arm64',
      destination: `https://github.com/session-foundation/session-desktop/releases/download/v${desktopVersion}/session-desktop-mac-arm64-${desktopVersion}.dmg`,
      permanent: false,
    },
    {
      source: '/mac-x64',
      destination: `https://github.com/session-foundation/session-desktop/releases/download/v${desktopVersion}/session-desktop-mac-x64-${desktopVersion}.dmg`,
      permanent: false,
    },
    {
      source: '/windows',
      destination: `https://github.com/session-foundation/session-desktop/releases/download/v${desktopVersion}/session-desktop-win-x64-${desktopVersion}.exe`,
      permanent: false,
    },
  ];
  return redirects;
}

export async function getDynamicRedirection(url: string) {
  const dynamicRedirects = await fetchDynamicRedirects();
  let redirection = '';
  dynamicRedirects.forEach((dynamicRedirection) => {
    if (url === dynamicRedirection.source) {
      redirection = dynamicRedirection.destination;
      return;
    }
  });
  return redirection;
}

const redirects: IRedirection[] = await config.redirects();

export async function hasRedirection(url: string) {
  return redirects.find((redirect) => redirect.source === url);
}
