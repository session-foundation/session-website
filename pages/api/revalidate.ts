import type { NextApiRequest, NextApiResponse } from 'next';
import nextConfig from 'next.config';
import { fetchTagList } from '@/services/cms';

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
 * Contentful webhook handler — triggers on-demand ISR revalidation via res.revalidate().
 *
 * revalidateTag() is intentionally not used here: it requires App Router context and
 * throws in Pages Router API routes. Instead, unstable_cache uses a short TTL in static
 * mode (see services/cms.ts) so data is always fresh when ISR regeneration runs.
 *
 * Configure Contentful to POST to:
 *   https://<your-domain>/api/revalidate?secret=<WEBHOOK_SECRET>
 *
 * Supported content types:
 *   - post       → revalidates the post page, /blog (all locales, also regenerates RSS),
 *                  and tag pages (all locales)
 *   - page       → revalidates the page slug (all locales)
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

    // Build the list of paths to revalidate
    const paths: string[] = [];

    if (contentType === 'post') {
      // Always revalidate the blog index (lists all posts and regenerates the RSS feed)
      paths.push(...localizedPaths('blog'));

      if (slug) {
        // Posts live at /blog/{slug} in pages/blog/[slug].tsx.
        // Posts are built for locale 'en' only so there are no locale-prefixed variants.
        paths.push(`/blog/${slug}`);

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
    } else if (contentType === 'faq_item') {
      paths.push(...localizedPaths('faq'));
    } else {
      return res.status(200).json({ revalidated: false, reason: 'Unhandled content type', contentType });
    }

    console.log(`[Revalidate] topic=${topic} contentType=${contentType} slug=${slug ?? 'none'} paths=${paths.join(', ') || 'none'}`);

    // res.revalidate() is the correct Pages Router mechanism for on-demand ISR.
    // It marks the path as stale so the next request triggers background regeneration.
    const results = await Promise.allSettled(paths.map((path) => res.revalidate(path)));

    const failed = results
      .map((result, i) => (result.status === 'rejected' ? paths[i] : null))
      .filter((p): p is string => p !== null);

    if (failed.length > 0) {
      console.error('[Revalidate] Failed paths:', failed);
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
