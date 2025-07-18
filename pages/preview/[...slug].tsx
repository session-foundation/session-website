import { ReactElement } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';

import {
  fetchEntryPreview,
  fetchBlogEntries,
  generateLinkMeta,
} from '../../services/cms';
import { IPost, IPage, isPost } from '../../types/cms';

import BlogPost from '../../components/BlogPost';
import RichPage from '../../components/RichPage';

export interface Props {
  content: IPage | IPost;
  otherPosts?: IPost[];
  slug: string;
}

export default function Preview(props: Props): ReactElement {
  const { content, slug } = props;
  return (
    <>
      <div
        className={
          'bg-gray text-white font-semibold w-full py-4 px-8 flex justify-between'
        }
      >
        <span>Preview Mode</span>
        <Link href={`/${slug}`}>Exit</Link>
      </div>
      {isPost(content) ? (
        <BlogPost post={content} otherPosts={props.otherPosts} />
      ) : (
        <RichPage page={content} />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const slug =
    (context.params?.slug &&
      context.params.slug.toString().split(',').join('/')) ??
    '';
  console.log(`Loading Preview %c${slug}`, 'color: purple;');

  try {
    let query = slug;
    if (slug.indexOf('blog/') >= 0) query = slug.split('blog/')[1];
    let content: IPage | IPost = await fetchEntryPreview(query);
    // embedded links in content body need metadata for preview
    content.body = await generateLinkMeta(content.body);
    const props: Props = { content, slug };

    if (isPost(content)) {
      // we want 6 posts excluding the current one if it's found
      const { entries: posts, total: totalPosts } = await fetchBlogEntries(7);
      const otherPosts = posts
        .filter((post) => {
          return content.slug !== post.slug;
        })
        .slice(0, 6);
      props.otherPosts = otherPosts;
    }

    console.log(`Built Preview %c${slug}`, 'color: purple;');
    return {
      props,
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};
