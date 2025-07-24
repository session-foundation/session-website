import classNames from 'classnames';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { type ReactElement, useState } from 'react';
import { ReactComponent as CloseSVG } from '@/assets/svgs/close.svg';
import { ReactComponent as MenuSVG } from '@/assets/svgs/hamburger.svg';
import NavItem from '@/components/navigation/NavItem';
import Button from '@/components/ui/Button';
import { NAVIGATION } from '@/constants';
import { NON_LOCALIZED_STRING } from '@/constants/localization';
import type { NavItemKey } from '@/constants/navigation';

export default function Nav(): ReactElement {
  const t = useTranslations('navigation');
  const tGeneral = useTranslations('general');
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleNav = () => {
    setIsExpanded(!isExpanded);
  };
  const mobileNavButtonClasses = 'w-5 h-5 fill-current';
  return (
    <nav
      className={classNames(
        'container relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 pb-2',
        'lg:h-24 lg:px-10 lg:pb-0'
      )}
    >
      <div
        className={classNames(
          'flex w-full items-center justify-between px-5 pt-7',
          'lg:w-1/3 lg:p-0'
        )}
      >
        <Link href="/" style={{ width: '196px', height: '40px' }}>
          <Image
            src="/assets/svgs/logo.svg"
            alt="session logo"
            width={196}
            height={40}
            priority={true}
            quality={100}
            placeholder="empty"
            sizes="196px"
          />
        </Link>
        <div className={classNames('ml-4 block', 'lg:hidden')}>
          <button
            className="z-10 flex items-center py-2 text-gray focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={toggleNav}
            aria-label={t(isExpanded ? 'aria.iconButtonClose' : 'aria.iconButtonOpen')}
            aria-expanded={isExpanded}
            aria-controls="mobile-navigation"
            type="button"
          >
            <span className="sr-only">
              {t(isExpanded ? 'aria.iconButtonClose' : 'aria.iconButtonOpen')}
            </span>
            <MenuSVG
              className={classNames(mobileNavButtonClasses, isExpanded ? 'hidden' : 'block')}
              aria-hidden="true"
              focusable="false"
            />
            <CloseSVG
              className={classNames(mobileNavButtonClasses, isExpanded ? 'block' : 'hidden')}
              aria-hidden="true"
              focusable="false"
            />
          </button>
        </div>
      </div>
      <div
        className={classNames(
          'absolute top-20 right-0 left-0 w-screen overflow-hidden',
          'lg:relative lg:top-0 lg:w-2/3 lg:overflow-visible'
        )}
      >
        <div
          className={classNames(
            'flex flex-col items-start justify-center text-primary text-sm',
            'lg:flex-row lg:items-center lg:justify-end lg:font-bold lg:text-base lg:text-gray',
            'transform transition-all duration-300',
            isExpanded ? 'h-full translate-y-0' : '-translate-y-full h-0 lg:translate-y-0'
          )}
        >
          {Object.entries(NAVIGATION.NAV_ITEMS).map(([key, value], index) => {
            const titleKey = key as NavItemKey;
            const title = t.has(titleKey) ? t(titleKey) : key;
            return (
              <NavItem
                key={`${key}${value.href}`}
                navItem={value}
                title={title}
                isExpanded={isExpanded}
                zIndex={index}
              />
            );
          })}
          <Link href="/download" className="hidden lg:inline">
            <Button
              fontWeight="bold"
              classes="ml-6"
              aria-label={t('aria.downloadButton', { appName: NON_LOCALIZED_STRING.appName })}
            >
              {tGeneral('download')}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
