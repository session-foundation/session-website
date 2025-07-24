import { readdirSync } from 'node:fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import config from 'next.config';
import { METADATA } from '@/constants';
import { fetchBlogEntries, fetchPages } from '@/services/cms';
import type { IRedirection } from '@/services/redirect';
import type { IPost } from '@/types/cms';

const LOCALIZED_PAGES = ['', 'download', 'blog', 'community'];

const redirects: IRedirection[] = await config.redirects();
const locales: Array<string> = config.i18n.locales;
const defaultLocale: string = config.i18n.defaultLocale;

interface LocalizedUrl {
  url: string;
  alternates: Array<{ locale: string; url: string }>;
  lastmod?: string;
  published?: string;
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
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
    if (!shouldLocalize(slug)) {
      return [
        {
          url: `${baseUrl}/${slug}`,
          alternates: [{ locale: defaultLocale, url: `${baseUrl}/${slug}` }],
          lastmod,
          published,
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

  const _blogPages: IPost[] = [];
  let currentPage = 1;
  let foundAllPosts = false;

  // Contentful only allows 100 at a time
  while (!foundAllPosts) {
    const { entries: _posts } = await fetchBlogEntries(100, currentPage);

    if (_posts.length === 0) {
      foundAllPosts = true;
      continue;
    }

    _blogPages.push(..._posts);
    currentPage++;
  }

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
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
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
