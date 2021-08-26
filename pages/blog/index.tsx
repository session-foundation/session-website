import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import classNames from 'classnames';

import { IPost } from '@/types/cms';
import { fetchBlogEntries, generateRoute } from '@/services/cms';
import METADATA from '@/constants/metadata';

import { Layout } from '@/components/ui';
import Container from '@/components/Container';
import { PostCard } from '@/components/cards';
import { PostList } from '@/components/posts';

interface Props {
  posts: IPost[];
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { entries: posts, total: totalPosts } = await fetchBlogEntries();

  return {
    props: { posts },
    revalidate: 3600, // refresh hourly
  };
};

export default function Blog(props: Props): ReactElement {
  const { posts } = props;
  const [featuredPost, ...otherPosts] = posts;
  return (
    <Layout title={'Blog'} metadata={METADATA.BLOG_PAGE}>
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
