import Link from 'next/link';
import { ReactElement } from 'react';
import classNames from 'classnames';

interface Props {
  classes?: string;
}

export default function GroupNotice(props: Props): ReactElement {
  const { classes } = props;
  return (
    <div
      className={classNames(
        'bg-gray-dark text-white font-helvetica px-10 py-16 border-b border-primary border-dashed',
        'md:py-12',
        classes
      )}
    >
      <h4 className={classNames('text-xl break-words')}>
        Join the{' '}
        <Link href="/community">
          <a
            className={classNames(
              'text-primary-dark font-bold',
              'transition-colors duration-300',
              'hover:text-white'
            )}
          >
            Session Community
          </a>
        </Link>{' '}
        and meet the vibrant group of people building, running, and using
        Session.
      </h4>
    </div>
  );
}
