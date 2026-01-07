import classNames from 'classnames';
import type { GetStaticProps, GetStaticPropsContext } from 'next';
import type { ReactElement } from 'react';
import Container from '@/components/Container';
import PostCard from '@/components/cards/PostCard';
import PostList from '@/components/posts/PostList';
import Layout from '@/components/ui/Layout';
import { CMS } from '@/constants';
import METADATA from '@/constants/metadata';
import { generateRoute } from '@/services/cms';
import type { IPost } from '@/types/cms';

interface Props {
  posts: IPost[];
}

export const getStaticProps: GetStaticProps = async (_context: GetStaticPropsContext) => {
  const { fetchAllBlogEntries } = await import('@/services/cms');
  const posts = await fetchAllBlogEntries();

  const revalidate = CMS.CONTENT_REVALIDATE_RATE;

  // Log revalidation time in dev builds
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[Revalidate] Blog Index - ${revalidate}s (${Math.round(revalidate / 60)}min)`
    );
  }

  return {
    props: { posts, messages: (await import(`../../locales/${_context.locale}.json`)).default },
    revalidate,
  };
};

export default function Blog(props: Props): ReactElement {
  const { posts } = props;
  const [featuredPost, ...otherPosts] = posts;
  return (
    <Layout localeKey="blog" metadata={METADATA.BLOG_PAGE}>
      <section>
        <Container
          classes={classNames(
            'p-12 pb-1 pl-0 pr-0',
            'md:pt-24 md:pb-1 md:pl-0 md:pr-0',
            'lg:mt-16 lg:pl-24 lg:pr-24 lg:max-w-screen-xl'
          )}
        >
          <PostCard
            route={generateRoute(featuredPost.slug)}
            featured={true}
            classes={classNames('mb-5', 'md:flex')}
            key={featuredPost.id}
            {...featuredPost}
          />
        </Container>
        <PostList posts={otherPosts} />
      </section>
    </Layout>
  );
}
