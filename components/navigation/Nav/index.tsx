import { ReactElement, useState } from 'react';

import { Button } from '@/components/ui';
import { ReactComponent as CloseSVG } from '@/assets/svgs/close.svg';
import Image from 'next/image';
import Link from 'next/link';
import { ReactComponent as MenuSVG } from '@/assets/svgs/hamburger.svg';
import { NAVIGATION } from '@/constants';
import { NavItem } from '@/components/navigation';
import classNames from 'classnames';

export default function Nav(): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleNav = () => {
    setIsExpanded(!isExpanded);
  };
  const mobileNavButtonClasses = 'w-5 h-5 fill-current';
  return (
    <nav
      role="navigation"
      className={classNames(
        'container relative flex flex-wrap items-center justify-between max-w-6xl px-4 pb-2 mx-auto z-10',
        'lg:pb-0 lg:h-24 lg:px-10'
      )}
    >
      <div
        className={classNames(
          'flex items-center justify-between w-full px-5 pt-7',
          'lg:w-1/3 lg:p-0'
        )}
      >
        <Link href="/">
          <a style={{ width: '196px', height: '40px' }}>
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
          </a>
        </Link>
        <div className={classNames('block ml-4', 'lg:hidden')}>
          <button
            className="z-10 flex items-center py-2 text-gray focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={toggleNav}
            aria-label={
              isExpanded ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={isExpanded}
            aria-controls="mobile-navigation"
            type="button"
          >
            <span className="sr-only">
              {isExpanded ? 'Close' : 'Open'} navigation menu
            </span>
            <MenuSVG
              className={classNames(
                mobileNavButtonClasses,
                isExpanded ? 'hidden' : 'block'
              )}
              aria-hidden="true"
              focusable="false"
            />
            <CloseSVG
              className={classNames(
                mobileNavButtonClasses,
                isExpanded ? 'block' : 'hidden'
              )}
              aria-hidden="true"
              focusable="false"
            />
          </button>
        </div>
      </div>
      <div
        className={classNames(
          'absolute left-0 right-0 w-screen overflow-hidden top-20',
          'lg:relative lg:overflow-visible lg:w-2/3 lg:top-0'
        )}
      >
        <div
          className={classNames(
            'flex flex-col items-start justify-center text-sm text-primary',
            'lg:text-base lg:flex-row lg:items-center lg:justify-end lg:font-bold lg:text-gray',
            'transform transition-all duration-300',
            isExpanded
              ? 'h-full translate-y-0'
              : 'h-0 -translate-y-full lg:translate-y-0'
          )}
        >
          {Object.entries(NAVIGATION.NAV_ITEMS).map(([key, value], index) => {
            return (
              <NavItem
                key={`${key}${index}`}
                navItem={value}
                title={key}
                isExpanded={isExpanded}
                zIndex={index}
              />
            );
          })}
          <Link href="/download">
            <a className="hidden lg:inline">
              <Button fontWeight="bold" classes="ml-6">
                Download
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
