import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import Container from '@/components/Container';
import PostCard from '@/components/cards/PostCard';
import Headline from '@/components/ui/Headline';
import { generateRoute } from '@/services/cms';
import type { IPost } from '@/types/cms';

interface Props {
  posts: IPost[];
  gridStyle?: 'blog' | 'normal';
  showHeading?: boolean;
  hoverEffect?: boolean;
  compact?: boolean;
  classes?: string;
}

export default function PostList(props: Props): ReactElement {
  const { posts, gridStyle = 'normal', showHeading = true, hoverEffect, compact, classes } = props;
  const t = useTranslations('blog');
  const cardClasses = classNames('md:w-1/2 mb-5', 'lg:w-1/3 lg:max-w-sm lg:px-3');
  const gridClasses = [
    gridStyle === 'normal' && 'lg:max-w-screen-xl',
    gridStyle === 'blog' && 'lg:max-w-screen-lg',
  ];
  return (
    <div className={classNames('mt-8', 'lg:mt-0', classes)}>
      {showHeading && (
        <Headline
          color="gray-dark"
          classes={classNames('text-sm font-mono pb-4', 'md:pb-0', 'lg:pb-4')}
          containerWidths={{
            small: '8rem',
            medium: '24rem',
            large: '1024px',
            huge: gridStyle === 'blog' ? '1024px' : '1280px',
          }}
        >
          {t('morePosts')}
        </Headline>
      )}
      <Container
        classes={classNames(
          'px-0 pb-0 flex flex-wrap justify-center max-w-screen-md',
          'md:px-0 md:pb-0 md:justify-start',
          'lg:pl-24 lg:pr-24',
          gridClasses
        )}
      >
        {posts?.map((post) => {
          return (
            <PostCard
              route={generateRoute(post.slug)}
              hoverEffect={hoverEffect}
              compact={compact}
              classes={classNames(cardClasses)}
              key={post.id}
              {...post}
            />
          );
        })}
      </Container>
    </div>
  );
}
