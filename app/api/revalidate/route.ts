import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import nextConfig from 'next.config';
import { CACHE_TAGS, fetchTagList } from '@/services/cms';

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
export async function POST(request: NextRequest) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ message: 'Webhook revalidation is not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get('secret') !== secret) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  // Only act on publish / unpublish / delete — ignore save, auto_save, create, archive, etc.
  const topic = request.headers.get('x-contentful-topic');
  if (!topic || !REVALIDATE_TOPICS.has(topic)) {
    return NextResponse.json({ revalidated: false, reason: 'Ignored topic', topic });
  }

  let payload: Record<string, any>;
  try {
    // App Router automatically handles any Content-Type including
    // application/vnd.contentful.management.v1+json
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    // sys.contentType is present on all events, including delete (sys.type === 'DeletedEntry')
    const contentType: string | undefined = payload?.sys?.contentType?.sys?.id;

    // fields is only present on publish events; unpublish/delete send tombstone payloads with no fields
    const slugField = payload?.fields?.slug;
    const slug: string | null = slugField?.['en-US'] ?? slugField?.['en'] ?? null;

    // metadata.tags (tag references) is only present on publish events
    const tagRefs: Array<{ sys: { id: string } }> = payload?.metadata?.tags ?? [];

    // Invalidate the Next.js data cache for the affected content type so that
    // getStaticProps fetches fresh data from Contentful when pages regenerate.
    if (contentType === 'post') {
      revalidateTag(CACHE_TAGS.POSTS);
    } else if (contentType === 'page') {
      revalidateTag(CACHE_TAGS.PAGES);
    } else if (contentType === 'faq_item') {
      revalidateTag(CACHE_TAGS.FAQ);
    } else {
      return NextResponse.json({ revalidated: false, reason: 'Unhandled content type', contentType });
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
      // For page unpublish/delete without a slug the cache tag has already been busted above;
      // we can't target a specific path without the slug.
    } else if (contentType === 'faq_item') {
      paths.push(...localizedPaths('faq'));
    }

    // Revalidate all paths. revalidatePath() works for both Pages Router and App Router pages.
    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({ revalidated: true, topic, contentType, slug, paths });
  } catch (err) {
    console.error('[Revalidate] Unexpected error:', err);
    return NextResponse.json({ message: 'Revalidation failed', error: String(err) }, { status: 500 });
  }
}
