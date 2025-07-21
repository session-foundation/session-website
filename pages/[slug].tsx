import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { IPage, IPost, isPost } from '@/types/cms';
import {
  fetchBlogEntries,
  fetchEntryBySlug,
  fetchPages,
  generateLinkMeta,
} from '@/services/cms';

import BlogPost from '@/components/BlogPost';
import { CMS } from '@/constants';
import { ReactElement } from 'react';
import RichPage from '@/components/RichPage';
import { hasRedirection } from '@/services/redirect';

interface Props {
  content: IPage | IPost;
  otherPosts?: IPost[];
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
  console.log(
    `Building: Page%c${
      context.params?.slug ? ` /${context.params?.slug}` : ''
    }`,
    'color: purple;'
  );
  const slug = String(context.params?.slug);
  const redirect = await hasRedirection(`/${slug}`);
  if (redirect) {
    return {
      redirect: redirect,
      revalidate: CMS.CONTENT_REVALIDATE_RATE,
    };
  }

  try {
    const content: IPage | IPost = await fetchEntryBySlug(slug);

    // embedded links in content body need metadata for preview
    content.body = await generateLinkMeta(content.body);
    const props: Props = { content };

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

    return {
      props,
      revalidate: CMS.CONTENT_REVALIDATE_RATE,
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
      revalidate: CMS.CONTENT_REVALIDATE_RATE,
    };
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { entries: pages, total: totalPages } = await fetchPages();
  const pagePaths = pages.map((page) => {
    return {
      params: {
        slug: page.slug,
      },
    };
  });

  const posts: IPost[] = [];
  let currentPage = 1;
  let foundAllPosts = false;

  // Contentful only allows 100 at a time
  while (!foundAllPosts) {
    const { entries: _posts } = await fetchBlogEntries(100, currentPage);

    if (_posts.length === 0) {
      foundAllPosts = true;
      continue;
    }

    posts.push(..._posts);
    currentPage++;
  }

  const postPaths = posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });

  return {
    paths: [...pagePaths, ...postPaths],
    fallback: 'blocking',
  };
};
