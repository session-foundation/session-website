import classNames from 'classnames';
import Link from 'next/link';
import type { ReactElement } from 'react';

interface Props {
  classes?: string;
}

export default function GroupNotice(props: Props): ReactElement {
  const { classes } = props;
  return (
    <div
      className={classNames(
        'border-primary border-b border-dashed bg-gray-dark px-10 py-16 font-helvetica text-white',
        'md:py-12',
        classes
      )}
    >
      <h4 className={classNames('break-words text-xl')}>
        Join the{' '}
        <Link
          href="/community"
          className={classNames(
            'font-bold text-primary-dark',
            'transition-colors duration-300',
            'hover:text-white'
          )}
        >
          Session Community
        </Link>{' '}
        and meet the vibrant group of people building, running, and using Session.
      </h4>
    </div>
  );
}
