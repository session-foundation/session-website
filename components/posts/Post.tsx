import { ReactElement } from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import classNames from 'classnames';

import { IPost } from '@/types/cms';
import PostList from '@/components/posts/PostList';
import RichBody from '@/components/RichBody';
import { useScreen } from '@/contexts/screen';
import Container from '@/components/Container';

interface Props {
  post: IPost;
  otherPosts?: IPost[];
}

export default function Post(props: Props): ReactElement {
  const { isSmall, isMedium } = useScreen();
  const { post, otherPosts } = props;
  const {
    title,
    subtitle,
    author,
    tags,
    publishedDate,
    featureImage,
    fullHeader,
    description,
    body,
  } = post;
  const renderTags = (() => {
    return tags.map((tag, index) => {
      return (
        <span key={index}>
          <Link
            href={`/tag/${tag}`}
            className="transition-colors duration-300 hover:text-primary"
          >
            {tag}
          </Link>
          {index < tags.length - 1 && ', '}
        </span>
      );
    });
  })();
  return (
    <section>
      <Container
        fullWidth={fullHeader}
        classes={classNames(
          'pt-16 pb-8',
          fullHeader
            ? ['lg:pt-8']
            : ['md:pt-20 md:pb-8 md:px-28', 'lg:py-8 lg:px-40']
        )}
      >
        {featureImage?.imageUrl && (
          <div
            className={classNames(
              'relative',
              fullHeader ? 'w-screen' : ['w-full h-48', 'md:h-80', 'lg:h-120']
            )}
          >
            {fullHeader ? (
              <Image
                src={`${featureImage?.imageUrl}${
                  isSmall ? '?w=300' : isMedium ? '?w=600' : ''
                }`}
                alt={featureImage?.description ?? title}
                width={featureImage?.width}
                height={featureImage?.height}
                layout="responsive"
                priority={true}
              />
            ) : (
              <Image
                src={`${featureImage?.imageUrl}${
                  isSmall ? '?w=300' : isMedium ? '?w=600' : ''
                }`}
                alt={featureImage?.description ?? title}
                layout="fill"
                priority={true}
                className={classNames('object-cover')}
              />
            )}
          </div>
        )}
      </Container>
      <Container
        classes={classNames(
          'text-gray break-words pt-0',
          'md:pt-0 md:pb-8 md:px-28',
          'lg:pb-8 lg:px-40'
        )}
      >
        <h1 className={classNames('text-4xl font-bold leading-normal mb-1')}>
          {title}
        </h1>
        <p
          className={classNames(
            'font-mono font-medium text-sm mb-3',
            'lg:mb-8'
          )}
        >
          <span>{publishedDate}</span>
          {author && author.name && <span> / {author.name}</span>}
          <span className={classNames('block mt-1')}>{renderTags}</span>
        </p>
        <RichBody
          body={body}
          classes={classNames('text-sm text-gray', 'lg:text-base')}
        />
      </Container>
      {otherPosts && (
        <PostList
          posts={otherPosts}
          gridStyle={'blog'}
          hoverEffect={false}
          compact={true}
          classes={classNames('my-16', 'lg:mb-24')}
        />
      )}
    </section>
  );
}
