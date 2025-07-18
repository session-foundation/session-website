import { BANNER } from '@/constants';
import Button from '../Button';
import { ReactElement } from 'react';
import classNames from 'classnames';
import { useScreen } from '@/contexts/screen';
import Link from 'next/link';

export default function Banner(): ReactElement {
  const { isSmall } = useScreen();
  return (
    <div
      className={classNames(
        'bg-gray-dark text-white py-4 px-8 flex flex-col justify-center items-center leading-relaxed align-middle gap-4',
        'lg:flex-row',
        '2xl:items-center'
      )}
    >
      <span
        className={classNames(
          'text-center text-sm',
          'md:text-base',
          'lg:text-left'
        )}
      >
        {isSmall ? BANNER.TEXT.MOBILE : BANNER.TEXT.DESKTOP}
      </span>
      <Link legacyBehavior href={BANNER.URL}>
        <a
          rel="noopener noreferrer"
          target="_blank"
          title={BANNER.ARIA}
          aria-label={BANNER.ARIA}
        >
          <Button
            fontWeight="bold"
            size={isSmall ? 'small' : 'medium'}
            classes="whitespace-nowrap"
          >
            Learn more
          </Button>
        </a>
      </Link>
    </div>
  );
}
