import { readdirSync } from 'node:fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { METADATA } from '@/constants';
import { fetchBlogEntries, fetchPages } from '@/services/cms';
import type { IRedirection } from '@/services/redirect';
import type { IPost } from '@/types/cms';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = {
    development: 'http://localhost:3000',
    test: 'http://localhost:3000',
    production: METADATA.HOST_URL,
  }[process.env.NODE_ENV];

  const staticPages = readdirSync('pages')
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
        pagePath = '';
      } else {
        pagePath = pagePath.split('.tsx')[0];
      }
      return `${baseUrl}/${pagePath}`;
    });

  const redirectPages = getConfig().serverRuntimeConfig.redirects.map((redirect: IRedirection) => {
    if (redirect.source.includes(':slug')) {
      return '';
    } else {
      return `${baseUrl}${redirect.source}`;
    }
  });

  const { entries: _dynamicPages } = await fetchPages();
  const dynamicPages = _dynamicPages.map((page) => {
    return `${baseUrl}/${page.slug}`;
  });

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

  const blogPages = _blogPages.map((page) => {
    return {
      url: `${baseUrl}/blog/${page.slug}`,
      published: page.publishedDateISO,
    };
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${[...staticPages, ...redirectPages, ...dynamicPages]
        .map((url) => {
          return `
          <url>
            <loc>${url}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
          </url>
        `;
        })
        .join('')}
      ${blogPages
        .map((post) => {
          return `
            <url>
              <loc>${post.url}</loc>
              <lastmod>${post.published}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
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
