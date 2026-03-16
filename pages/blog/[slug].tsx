import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import type { ReactElement } from 'react';
import BlogPost from '@/components/BlogPost';
import { CMS, getRevalidationTime, IS_STATIC_MODE } from '@/constants';
import { fetchAllBlogEntries, fetchBlogEntries, fetchEntryBySlug, generateLinkMeta } from '@/services/cms';
import { type IPost, isPost } from '@/types/cms';

interface Props {
  post: IPost;
  otherPosts: IPost[];
  messages: any;
}

export default function BlogPostPage(props: Props): ReactElement {
  return <BlogPost post={props.post} otherPosts={props.otherPosts} />;
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const locale = context.locale || 'en';
  const slug = String(context.params?.slug);

  console.log(`[Build] Page: /blog/${slug}`);

  const messages = (await import(`../../locales/${locale}.json`)).default;

  try {
    const content = await fetchEntryBySlug(slug);

    if (!isPost(content)) {
      return { notFound: true };
    }

    content.body = await generateLinkMeta(content.body);

    const { entries: posts } = await fetchBlogEntries(7);
    const otherPosts = posts.filter((p) => p.slug !== slug).slice(0, 6);

    const revalidate = IS_STATIC_MODE ? false : getRevalidationTime(content.publishedDateISO);
    const revalidateInfo = IS_STATIC_MODE ? 'static/webhook' : `${revalidate}s`;
    console.log(`[Build] Done: /blog/${slug} (revalidate=${revalidateInfo})`);

    return {
      props: { post: content, otherPosts, messages },
      revalidate,
    };
  } catch (err) {
    if (err instanceof Error && !err.message.includes('Failed to fetch entry')) {
      console.error(err);
    }
    return {
      notFound: true,
      revalidate: IS_STATIC_MODE ? false : CMS.CONTENT_REVALIDATE_RATE_OLD,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchAllBlogEntries();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
    locale: 'en',
  }));
  return { paths, fallback: 'blocking' };
};
