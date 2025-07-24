import classNames from 'classnames';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import { NON_LOCALIZED_STRING } from '@/constants/localization';

interface Props {
  classes?: string;
}

export default function GroupNotice(props: Props): ReactElement {
  const { classes } = props;
  const t = useTranslations('email');
  const tFeature = useTranslations('feature');
  return (
    <div
      className={classNames(
        'border-primary border-b border-dashed bg-gray-dark px-10 py-16 font-helvetica text-white',
        'md:py-12',
        classes
      )}
    >
      <h4 className={classNames('break-words text-xl')}>
        {t.rich('joinCommunity', {
          appName: NON_LOCALIZED_STRING.appName,
          featureCommunity: tFeature('community'),
          button: (chunk) => (
            <Link
              href="/community"
              className={classNames(
                'font-bold text-primary-dark',
                'transition-colors duration-300',
                'hover:text-white'
              )}
            >
              {chunk}
            </Link>
          ),
        })}
      </h4>
    </div>
  );
}
