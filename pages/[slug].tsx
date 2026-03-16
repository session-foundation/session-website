import type { GetStaticPaths, GetStaticPropsContext } from 'next';
import type { ReactElement } from 'react';
import RichPage from '@/components/RichPage';
import { CMS, IS_STATIC_MODE } from '@/constants';
import { fetchEntryBySlug, generateLinkMeta } from '@/services/cms';
import { hasRedirection } from '@/services/redirect';
import { type IPage, isPost } from '@/types/cms';

interface Props {
  content: IPage;
  messages: any;
}

export default function Page(props: Props): ReactElement {
  return <RichPage page={props.content} />;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const locale = context.locale || 'en';

  console.log(`[Build] Page: /${context.params?.slug ?? ''}`);
  const slug = String(context.params?.slug);

  const messages = (await import(`../locales/${locale}.json`)).default;

  const redirect = await hasRedirection(`/${slug}`);
  if (redirect) {
    return {
      props: { messages },
      redirect: redirect,
      revalidate: IS_STATIC_MODE ? false : CMS.CONTENT_REVALIDATE_RATE,
    };
  }

  try {
    const content = await fetchEntryBySlug(slug);

    // Posts have moved to /blog/[slug] — redirect permanently so existing links are preserved
    if (isPost(content)) {
      return {
        redirect: { destination: `/blog/${slug}`, permanent: true },
      };
    }

    // embedded links in content body need metadata for preview
    content.body = await generateLinkMeta(content.body);

    const revalidate = IS_STATIC_MODE ? false : CMS.CONTENT_REVALIDATE_RATE;
    console.log(`[Build] Done: /${slug} (page, revalidate=${IS_STATIC_MODE ? 'static/webhook' : `${revalidate}s`})`);

    return {
      props: { content, messages },
      revalidate,
    };
  } catch (err) {
    // Log 404s in dev builds to help identify problematic access patterns
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[404] Page not found: "/${slug}"`);
    }

    // For non-dev, only log actual errors (not 404s from regular navigation)
    if (err instanceof Error && !err.message.includes('Failed to fetch entry')) {
      console.error(err);
    }

    return {
      props: { messages },
      notFound: true,
      revalidate: IS_STATIC_MODE ? false : CMS.CONTENT_REVALIDATE_RATE_OLD,
    };
  }
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const { fetchPages } = await import('@/services/cms');
  const { entries: pages } = await fetchPages();

  // Only pre-build CMS pages. Post slugs are handled by pages/blog/[slug].tsx.
  // Any /{post-slug} hit falls through to getStaticProps which issues a permanent redirect.
  const paths = pages.flatMap((page) =>
    (locales || ['en']).map((locale) => ({
      params: { slug: page.slug },
      locale,
    }))
  );

  return { paths, fallback: 'blocking' };
};
