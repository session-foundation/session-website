import classNames from 'classnames';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import type { IPost } from '@/types/cms';

interface Props extends IPost {
  route: string;
  featured?: boolean;
  hoverEffect?: boolean;
  compact?: boolean;
  classes?: string;
}

export default function PostCard(props: Props): ReactElement {
  const t = useTranslations('blog');
  const {
    title,
    description,
    featureImage,
    publishedDate,
    author,
    route,
    featured,
    hoverEffect = !featured,
    compact = false,
    classes,
  } = props;
  const headingClasses = 'cursor-pointer text-2xl font-bold mb-3';
  // parent container must have 'flex' class
  return (
    <div className={classNames('p-3 text-gray-dark leading-none', 'lg:text-3xl', classes)}>
      {featureImage?.imageUrl && (
        <Link href={route} legacyBehavior>
          <div
            className={classNames(
              'relative mb-4 w-full overflow-hidden',
              'md:px-16',
              'lg:px-20',
              compact ? 'h-48 md:h-60 lg:h-44' : 'h-60 lg:h-56',
              featured && 'md:mr-4 md:w-1/2 lg:mr-3 lg:h-96 lg:w-3/5',
              hoverEffect && 'rounded-lg'
            )}
          >
            <Image
              src={`${featureImage?.imageUrl}${featured ? '?w=700' : '?w=400'}`}
              alt={featureImage?.description ?? title}
              layout="fill"
              priority={featured}
              loading={featured ? 'eager' : 'lazy'}
              className={classNames(
                'cursor-pointer rounded-lg object-cover',
                hoverEffect &&
                  // no animation transition
                  // https://stackoverflow.com/questions/29330381/rounded-corners-in-safari-chrome-are-not-rounded-on-hover-for-first-second
                  'scale-105 transform hover:blur-xs hover:filter'
              )}
            />
          </div>
        </Link>
      )}
      <div className={classNames(featured && 'md:ml-4 md:w-1/2 lg:ml-3 lg:w-2/5')}>
        <Link href={route} passHref>
          {featured ? (
            <h1
              className={classNames(
                headingClasses,
                'md:-mt-1 mt-8 font-bold text-3xl md:text-4xl lg:leading-tight'
              )}
            >
              {title}
            </h1>
          ) : (
            <h2 className={classNames(headingClasses)}>{title}</h2>
          )}
        </Link>
        <p className={classNames('font-helvetica text-gray-lightest text-xs')}>
          {publishedDate}
          {author?.name && <span> / {author.name}</span>}
        </p>
        {!compact && (
          <p className={classNames('text-sm', featured && 'md:text-base md:leading-normal')}>
            {description}
          </p>
        )}
        {featured && (
          <Link href={route} className={classNames('mt-4 block text-primary-dark text-xs')}>
            {t('readMore')} »
          </Link>
        )}
      </div>
    </div>
  );
}
