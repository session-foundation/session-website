import type { GetStaticPaths, GetStaticPropsContext } from 'next';
import type { ReactElement } from 'react';
import BlogPost from '@/components/BlogPost';
import RichPage from '@/components/RichPage';
import { CMS, getRevalidationTime } from '@/constants';
import { fetchBlogEntries, fetchEntryBySlug, generateLinkMeta } from '@/services/cms';
import { hasRedirection } from '@/services/redirect';
import { type IPage, type IPost, isPost } from '@/types/cms';

interface Props {
  content: IPage | IPost;
  otherPosts?: IPost[];
  messages: any;
}

export default function Page(props: Props): ReactElement {
  const { content } = props;
  if (isPost(content)) {
    return <BlogPost post={content} otherPosts={props.otherPosts} />;
  } else {
    return <RichPage page={content} />;
  }
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const locale = context.locale || 'en';

  console.log(
    `Building: Page%c${context.params?.slug ? ` /${context.params?.slug}` : ''}`,
    'color: purple;'
  );
  const slug = String(context.params?.slug);

  const messages = (await import(`../locales/${locale}.json`)).default;

  const redirect = await hasRedirection(`/${slug}`);
  if (redirect) {
    return {
      props: { messages },
      redirect: redirect,
      revalidate: CMS.CONTENT_REVALIDATE_RATE,
    };
  }

  try {
    const content: IPage | IPost = await fetchEntryBySlug(slug);

    // embedded links in content body need metadata for preview
    content.body = await generateLinkMeta(content.body);

    const props: Props = { content, messages };

    if (isPost(content)) {
      // we want 6 posts excluding the current one if it's found
      const { entries: posts } = await fetchBlogEntries(7);
      props.otherPosts = posts
        .filter((post) => {
          return content.slug !== post.slug;
        })
        .slice(0, 6);
    }

    // Calculate revalidation time based on content age
    const revalidate = isPost(content)
      ? getRevalidationTime(content.publishedDateISO)
      : CMS.CONTENT_REVALIDATE_RATE;

    // Log revalidation time in dev builds
    if (process.env.NODE_ENV === 'development') {
      const contentType = isPost(content) ? 'Post' : 'Page';
      const ageInfo = isPost(content) 
        ? ` (published: ${content.publishedDate})` 
        : '';
      console.log(
        `[Revalidate] ${contentType} "/${slug}"${ageInfo} - ${revalidate}s (${Math.round(revalidate / 60)}min)`
      );
    }

    return {
      props,
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
      // Use longer revalidation for 404 pages to reduce unnecessary rebuilds
      revalidate: CMS.CONTENT_REVALIDATE_RATE_OLD,
    };
  }
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const { fetchPages, fetchAllBlogEntries } = await import('@/services/cms');
  const { entries: pages } = await fetchPages();
  const posts = await fetchAllBlogEntries();

  // Generate paths for pages (all locales) and posts (en only)
  const pagePaths = pages.flatMap((page) =>
    (locales || ['en']).map((locale) => ({
      params: {
        slug: page.slug,
      },
      locale,
    }))
  );

  const postPaths = posts.map((post) => ({
    params: {
      slug: post.slug,
    },
    locale: 'en',
  }));

  const paths = [...pagePaths, ...postPaths];

  return {
    paths,
    fallback: 'blocking',
  };
};
