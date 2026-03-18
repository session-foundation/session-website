import { readdirSync } from 'node:fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import config from 'next.config';
import { METADATA } from '@/constants';
import { fetchPages } from '@/services/cms';
import type { IRedirection } from '@/services/redirect';
import type { IPost } from '@/types/cms';

const LOCALIZED_PAGES = ['', 'download', 'blog', 'community'];

const redirects: IRedirection[] = await config.redirects();
const locales: Array<string> = config.i18n.locales;
const defaultLocale: string = config.i18n.defaultLocale;

enum ChangeFrequency {
  // Constantly changing and include index pages on major news publications, Google News, stock market data and social bookmarking categories.
  Always = 'Always',
  // Update every hour and will also include major news publications as well as weather services and forums.
  Hourly = 'Hourly',
  // Updated on average once per day and include things like blog posts, smaller web forum pages, message boards and classified ads.
  Daily = 'Daily',
  // Updates typically occur once per week, these pages will include website directories, product info and pricing pages as well as less frequent blogs.
  Weekly = 'Weekly',
  // Updated roughly once per month and include category pages, FAQs, Help Desk articles that require occasional updates.
  Monthly = 'Monthly',
  // Updates on these pages happen on an annual basis and are typically your contact page, “About” page, login pages and registration pages.
  Yearly = 'Yearly',
  // Never ever get updates. These are really old blog posts, press releases, notifications about updates that never need updating and any completely static pages.
  Never = 'Never',
}

const changeFrequencies = Object.values(ChangeFrequency);

function isChangeFrequency(frequency: unknown): frequency is ChangeFrequency {
  return typeof frequency === 'string' && changeFrequencies.includes(frequency as ChangeFrequency);
}

interface LocalizedUrl {
  url: string;
  alternates: Array<{ locale: string; url: string }>;
  lastmod?: string;
  published?: string;
  priority?: number;
  changeFrequency?: ChangeFrequency;
}

function handlePriority(priority: number) {
  if (typeof priority !== 'number' || priority > 1 || priority < 0) {
    throw new Error('Priority must be a number between 0 and 1');
  }
  return priority;
}

const overridePageOptions: Record<string, Partial<LocalizedUrl>> = {
  '': { priority: 1.0, changeFrequency: ChangeFrequency.Weekly },
  download: { priority: 0.9, changeFrequency: ChangeFrequency.Weekly },
  blog: { priority: 0.9, changeFrequency: ChangeFrequency.Weekly },
  faq: { priority: 0.9, changeFrequency: ChangeFrequency.Weekly },
  litepaper: { priority: 0.75, changeFrequency: ChangeFrequency.Yearly },
  whitepaper: { priority: 0.75, changeFrequency: ChangeFrequency.Yearly },
};

function getOverridePageOptions(slug: string) {
  const page = overridePageOptions[slug];
  return page ?? {};
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  // Cache the sitemap for 1 hour to reduce API calls
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');

  const baseUrl = {
    development: 'http://localhost:3000',
    test: 'http://localhost:3000',
    production: METADATA.HOST_URL,
  }[process.env.NODE_ENV];

  const shouldLocalize = (slug: string): boolean => {
    return LOCALIZED_PAGES.includes(slug);
  };

  const generateLocalizedUrls = (
    slug: string,
    lastmod?: string,
    published?: string
  ): LocalizedUrl[] => {
    const overrides = getOverridePageOptions(slug);
    if (!shouldLocalize(slug)) {
      return [
        {
          url: `${baseUrl}/${slug}`,
          alternates: [{ locale: defaultLocale, url: `${baseUrl}/${slug}` }],
          lastmod,
          published,
          ...overrides,
        },
      ];
    }

    return locales.map((locale) => {
      const isDefault = locale === defaultLocale;
      const mainUrl = isDefault ? `${baseUrl}/${slug}` : `${baseUrl}/${locale}/${slug}`;

      const alternates = locales.map((altLocale) => ({
        locale: altLocale,
        url: altLocale === defaultLocale ? `${baseUrl}/${slug}` : `${baseUrl}/${altLocale}/${slug}`,
      }));

      return {
        url: mainUrl,
        alternates,
        lastmod,
        published,
        ...overrides,
      };
    });
  };

  const staticPageSlugs = readdirSync('pages')
    .filter((page) => {
      return ![
        '.DS_Store',
        '_app.tsx',
        '_document.tsx',
        '_error.tsx',
        '404.tsx',
        '[slug].tsx',
        'sitemap.xml.tsx',
        'api',
        'tag',
        'preview',
      ].includes(page);
    })
    .map((pagePath) => {
      if (pagePath.includes('index')) {
        return '';
      } else {
        return pagePath.split('.tsx')[0];
      }
    });

  const staticPages = staticPageSlugs.flatMap((slug) =>
    generateLocalizedUrls(slug, new Date().toISOString())
  );

  const redirectPageSlugs = redirects
    .filter((redirect: IRedirection) => !redirect.source.includes(':slug'))
    .map((redirect: IRedirection) => redirect.source.replace(/^\//, '')); // Remove leading slash

  const redirectPages = redirectPageSlugs.flatMap((slug) =>
    generateLocalizedUrls(slug, new Date().toISOString())
  );

  const { entries: _dynamicPages } = await fetchPages();
  const dynamicPages = _dynamicPages.flatMap((page) =>
    generateLocalizedUrls(page.slug, new Date().toISOString())
  );

  const { fetchAllBlogEntries } = await import('@/services/cms');
  const _blogPages = await fetchAllBlogEntries();

  const blogPages: LocalizedUrl[] = _blogPages.map((page) => ({
    url: `${baseUrl}/blog/${page.slug}`,
    alternates: [{ locale: defaultLocale, url: `${baseUrl}/blog/${page.slug}` }],
    lastmod: page.publishedDateISO,
    published: page.publishedDateISO,
  }));

  const allPages = [...staticPages, ...redirectPages, ...dynamicPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${allPages
        .map((page) => {
          const isLocalized = page.alternates.length > 1;

          let hreflangLinks = '';
          if (isLocalized) {
            hreflangLinks = [
              // Add x-default pointing to default locale version
              `        <xhtml:link rel="alternate" hreflang="x-default" href="${page.alternates.find((alt) => alt.locale === defaultLocale)?.url}" />`,
              // Add all locale-specific alternates
              ...page.alternates.map(
                (alt) =>
                  `        <xhtml:link rel="alternate" hreflang="${alt.locale}" href="${alt.url}" />`
              ),
            ].join('\n');
          }

          return `
          <url>
            <loc>${page.url}</loc>
            <lastmod>${page.published || page.lastmod}</lastmod>
            <changefreq>${isChangeFrequency(page.changeFrequency) ? page.changeFrequency : ChangeFrequency.Monthly}</changefreq>
            <priority>${page.priority !== undefined ? handlePriority(page.priority) : 0.5}</priority>
${hreflangLinks}
          </url>
        `;
        })
        .join('')}
    </urlset>
  `;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}
