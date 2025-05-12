import { BANNER } from '@/constants';
import Button from '../Button';
import { ReactElement } from 'react';
import classNames from 'classnames';
import { useScreen } from '@/contexts/screen';

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
      <span
        className={classNames('flex justify-center items-center', '2xl:ml-4')}
      >
        <a
          href="https://getsession.org/groups"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button
            fontWeight="bold"
            size={isSmall ? 'small' : 'medium'}
            classes="whitespace-nowrap mx-2"
          >
            Learn more
          </Button>
        </a>
      </span>
    </div>
  );
}
