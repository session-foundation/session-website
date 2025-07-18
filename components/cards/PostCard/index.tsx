import { IPost } from '@/types/cms';
import Image from "next/legacy/image";
import Link from 'next/link';
import { ReactElement } from 'react';
import classNames from 'classnames';

interface Props extends IPost {
  route: string;
  featured?: boolean;
  hoverEffect?: boolean;
  compact?: boolean;
  classes?: string;
}

export default function PostCard(props: Props): ReactElement {
  const {
    title,
    description,
    subtitle,
    featureImage,
    publishedDate,
    author,
    slug,
    route,
    featured,
    hoverEffect = !featured,
    compact = false,
    classes,
  } = props;
  const headingClasses = 'cursor-pointer text-2xl font-bold mb-3';
  // parent container must have 'flex' class
  return (
    <div
      className={classNames(
        'text-gray-dark leading-none p-3',
        'lg:text-3xl',
        classes
      )}
    >
      {featureImage?.imageUrl && (
        <Link legacyBehavior href={route} passHref>
          <div
            className={classNames(
              'relative overflow-hidden w-full mb-4',
              'md:px-16',
              'lg:px-20',
              compact ? 'h-48 md:h-60 lg:h-44' : 'h-60 lg:h-56',
              featured && 'md:w-1/2 md:mr-4 lg:mr-3 lg:w-3/5 lg:h-96',
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
                'object-cover cursor-pointer rounded-lg',
                hoverEffect &&
                  // no animation transition
                  // https://stackoverflow.com/questions/29330381/rounded-corners-in-safari-chrome-are-not-rounded-on-hover-for-first-second
                  'transform scale-105 hover:filter hover:blur-xs'
              )}
            />
          </div>
        </Link>
      )}
      <div
        className={classNames(featured && 'md:w-1/2 md:ml-4 lg:ml-3 lg:w-2/5')}
      >
        <Link legacyBehavior href={route} passHref>
          <a>
            {featured ? (
              <h1
                className={classNames(
                  headingClasses,
                  'font-bold text-3xl mt-8 md:text-4xl md:-mt-1 lg:leading-tight'
                )}
              >
                {title}
              </h1>
            ) : (
              <h2 className={classNames(headingClasses)}>{title}</h2>
            )}
          </a>
        </Link>
        <p className={classNames('text-gray-lightest text-xs font-helvetica')}>
          {publishedDate}
          {author && author.name && <span> / {author.name}</span>}
        </p>
        {!compact && (
          <p
            className={classNames(
              'text-sm',
              featured && 'md:text-base md:leading-normal'
            )}
          >
            {description}
          </p>
        )}
        {featured && (
          <Link legacyBehavior href={route}>
            <a className={classNames('block text-primary-dark text-xs mt-4')}>
              Read More »
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
