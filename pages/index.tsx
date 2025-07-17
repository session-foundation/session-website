import { About, Benefits, Features, Hero } from '@/components/sections';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { CMS } from '@/constants';
import { IPost } from '@/types/cms';
import { Layout } from '@/components/ui';
import { fetchBlogEntries } from '@/services/cms';
import generateRSSFeed from '@/utils/rss';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Benefits />
      <Features />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  if (process.env.NEXT_PUBLIC_SITE_ENV !== 'development') {
    const posts: IPost[] = [];
    let page = 1;
    let foundAllPosts = false;

    // Contentful only allows 100 at a time
    while (!foundAllPosts) {
      const { entries: _posts } = await fetchBlogEntries(100, page);

      if (_posts.length === 0) {
        foundAllPosts = true;
        continue;
      }

      posts.push(..._posts);
      page++;
    }

    generateRSSFeed(posts);
  }

  return {
    props: {},
    revalidate: CMS.CONTENT_REVALIDATE_RATE,
  };
};
