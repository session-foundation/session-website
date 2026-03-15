import classNames from 'classnames';
import Link from 'next/link';
import type { ReactElement } from 'react';
import Button from '@/components/ui/Button';
import { BANNER } from '@/constants';
import { useScreen } from '@/contexts/screen';

export default function Banner(): ReactElement {
  const { isSmall } = useScreen();
  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center gap-4 bg-gray-dark px-8 py-4 align-middle text-white leading-relaxed',
        'lg:flex-row',
        '2xl:items-center'
      )}
    >
      <span className={classNames('text-center text-sm', 'md:text-base', 'lg:text-left')}>
        {isSmall ? BANNER.TEXT.MOBILE : BANNER.TEXT.DESKTOP}
      </span>
      <Link
        href={BANNER.URL}
        rel="noopener noreferrer"
        target="_blank"
        title={BANNER.ARIA}
        aria-label={BANNER.ARIA}
      >
        <Button fontWeight="bold" size={isSmall ? 'small' : 'medium'} classes="whitespace-nowrap">
          {BANNER.BUTTON_TEXT}
        </Button>
      </Link>
    </div>
  );
}
