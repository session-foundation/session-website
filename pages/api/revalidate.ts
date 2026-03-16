import type { NextApiRequest, NextApiResponse } from 'next';
import { revalidateTag } from 'next/cache';
import nextConfig from 'next.config';
import { CACHE_TAGS, fetchTagList } from '@/services/cms';

// Disable Next.js body parser — Contentful sends Content-Type: application/vnd.contentful.management.v1+json
// which Next.js won't auto-parse. We read and parse the raw body manually.
export const config = { api: { bodyParser: false } };

const locales: string[] = nextConfig.i18n.locales;
const defaultLocale: string = nextConfig.i18n.defaultLocale;

/**
 * Contentful topic values this handler acts on.
 * All other topics (save, auto_save, create, archive, unarchive) are acknowledged but ignored.
 */
const REVALIDATE_TOPICS = new Set([
  'ContentManagement.Entry.publish',
  'ContentManagement.Entry.unpublish',
  'ContentManagement.Entry.delete',
]);

/**
 * Contentful content is not localized — all locale variants of a page serve the
 * same Contentful data with statically-bundled UI translations. However, Next.js
 * ISR caches each locale variant independently, so all of them must be revalidated
 * when Contentful content changes.
 *
 * Exception: posts are built for locale 'en' only in getStaticPaths, so they have
 * no locale-prefixed variants and only need a single path revalidated.
 */
function localizedPaths(slug: string): string[] {
  return locales.map((locale) =>
    locale === defaultLocale ? `/${slug}` : `/${locale}/${slug}`
  );
}

function readRawBody(req: NextApiRequest): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => {
      data += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Contentful webhook handler — triggers on-demand ISR revalidation.
 *
 * Configure Contentful to POST to:
 *   https://<your-domain>/api/revalidate?secret=<WEBHOOK_SECRET>
 *
 * The webhook fires on publish, unpublish, and delete events. Note that
 * unpublish/delete payloads are tombstones — they contain only `sys` with no
 * `fields`, so we cannot determine the specific slug. In those cases we still
 * bust the data cache and revalidate all top-level listing pages (blog index,
 * faq) so stale content is removed from lists.
 *
 * Supported content types:
 *   - post       → revalidates the post page (if slug known), /blog (all locales,
 *                  also regenerates RSS), and tag pages (all locales)
 *   - page       → revalidates the page slug (all locales, if slug known)
 *   - faq_item   → revalidates /faq (all locales)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    return res.status(503).json({ message: 'Webhook revalidation is not configured' });
  }

  if (req.query.secret !== secret) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Only act on publish / unpublish / delete — ignore save, auto_save, create, archive, etc.
  const topic = req.headers['x-contentful-topic'] as string | undefined;
  if (!topic || !REVALIDATE_TOPICS.has(topic)) {
    return res.status(200).json({ revalidated: false, reason: 'Ignored topic', topic });
  }

  try {
    const payload = (await readRawBody(req)) as Record<string, any>;

    // sys.contentType is present on all events, including delete (sys.type === 'DeletedEntry')
    const contentType: string | undefined = payload?.sys?.contentType?.sys?.id;

    // fields is only present on publish events; unpublish/delete send tombstone payloads with no fields
    const slugField = payload?.fields?.slug;
    const slug: string | null = slugField?.['en-US'] ?? slugField?.['en'] ?? null;

    // metadata.tags (tag references) is only present on publish events
    const tagRefs: Array<{ sys: { id: string } }> = payload?.metadata?.tags ?? [];

    // Invalidate the Next.js data cache for the affected content type.
    // revalidateTag() busts all unstable_cache entries carrying that tag so
    // getStaticProps fetches fresh data from Contentful when pages regenerate.
    if (contentType === 'post') {
      revalidateTag(CACHE_TAGS.POSTS);
    } else if (contentType === 'page') {
      revalidateTag(CACHE_TAGS.PAGES);
    } else if (contentType === 'faq_item') {
      revalidateTag(CACHE_TAGS.FAQ);
    }

    // Build the list of paths to revalidate
    const paths: string[] = [];

    if (contentType === 'post') {
      // Always revalidate the blog index (lists all posts and regenerates the RSS feed)
      paths.push(...localizedPaths('blog'));

      if (slug) {
        // The post itself — posts are English-only, no locale-prefixed variants
        paths.push(`/${slug}`);

        // Tag pages for each tag on this post (only available on publish events)
        if (tagRefs.length > 0) {
          const taglist = await fetchTagList();
          for (const ref of tagRefs) {
            const tagName = taglist[ref.sys.id];
            if (tagName) {
              paths.push(...localizedPaths(`tag/${encodeURIComponent(tagName)}`));
            }
          }
        }
      }
    } else if (contentType === 'page') {
      if (slug) {
        paths.push(...localizedPaths(slug));
      }
      // For page unpublish/delete without a slug, the data cache tag has already been busted
      // above. Next requests will fetch fresh data; we can't target a specific path without the slug.
    } else if (contentType === 'faq_item') {
      paths.push(...localizedPaths('faq'));
    } else {
      // Unknown content type — acknowledge the webhook but revalidate nothing
      return res.status(200).json({ revalidated: false, reason: 'Unhandled content type', contentType });
    }

    // Revalidate all paths concurrently; collect any failures without aborting
    const results = await Promise.allSettled(paths.map((path) => res.revalidate(path)));

    const failed = results
      .map((result, i) => (result.status === 'rejected' ? paths[i] : null))
      .filter((p): p is string => p !== null);

    if (failed.length > 0) {
      console.error('[Revalidate] Failed to revalidate paths:', failed);
    }

    return res.status(200).json({
      revalidated: true,
      topic,
      contentType,
      slug,
      paths,
      ...(failed.length > 0 && { failed }),
    });
  } catch (err) {
    console.error('[Revalidate] Unexpected error:', err);
    return res.status(500).json({ message: 'Revalidation failed', error: String(err) });
  }
}
