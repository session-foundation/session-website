import classNames from 'classnames';
import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import type { ReactElement } from 'react';
import Container from '@/components/Container';
import PostList from '@/components/posts/PostList';
import Layout from '@/components/ui/Layout';
import { CMS, IS_STATIC_MODE, METADATA } from '@/constants';
import { fetchBlogEntriesByTag, fetchTagList } from '@/services/cms';
import type { IPost, ITagList } from '@/types/cms';

interface Props {
  tag: string;
  posts: IPost[];
}

export default function Tag(props: Props): ReactElement {
  const { tag, posts } = props;
  return (
    <Layout title={`${tag} Archives`} metadata={METADATA.BLOG_PAGE}>
      <section>
        <Container
          classes={classNames(
            'p-12 pb-0 pl-3 pr-3',
            'md:pt-16 md:pb-0 md:pl-3 md:pr-3',
            'lg:pt-8 lg:pb-16 lg:pl-24 lg:pr-24 lg:max-w-screen-xl'
          )}
        >
          <h1
            className={classNames(
              'border border-gray-200 bg-gray-50 px-2 py-3 font-bold text-4xl text-primary-dark',
              'lg:mx-3',
              'xl:max-w-4xl'
            )}
          >
            {tag}
          </h1>
        </Container>
        <PostList posts={posts} showHeading={false} />
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  console.log(`[Build] Page: /tag/${context.params?.tag}`);
  const tag = String(context.params?.tag);

  const revalidate = IS_STATIC_MODE ? false : CMS.CONTENT_REVALIDATE_RATE;

  try {
    const { entries: posts } = await fetchBlogEntriesByTag(tag);

    return {
      props: {
        tag,
        posts,
        messages: (await import(`../../locales/${context.locale}.json`)).default,
      },
      revalidate,
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
      revalidate,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tags: ITagList = await fetchTagList();
  const paths = Object.values(tags).map((tag) => {
    return {
      params: {
        tag,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};
