/** biome-ignore-all lint/a11y/noStaticElementInteractions: TODO: refactor this to be more accessible */
/** biome-ignore-all lint/a11y/useKeyWithMouseEvents: TODO: refactor this to be more accessible */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: TODO: refactor this to be more accessible */
/** biome-ignore-all lint/a11y/useAriaPropsSupportedByRole: TODO: refactor this to be more accessible */
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { ReactComponent as CloseSVG } from '@/assets/svgs/close.svg';
import { ReactComponent as MenuSVG } from '@/assets/svgs/hamburger.svg';
import { NON_LOCALIZED_STRING } from '@/constants/localization';
import type { INavItem, NavItemKey } from '@/constants/navigation';
import { useScreen } from '@/contexts/screen';

interface DropdownProps {
  title: string | ReactNode; // social icons can be nav items
  navItem: INavItem;
  classes?: string;
}

interface NavItemProps extends DropdownProps {
  isExpanded?: boolean;
  isIcon?: boolean;
  hoverEffect?: boolean;
  zIndex?: number;
}

export const navItemClasses = classNames(
  'bg-gray-dark block w-full px-5 py-2 uppercase border-transparent border-b-3',
  'lg:px-2 lg:py-1 lg:mx-auto lg:bg-white lg:last:rounded-b-md'
);

export const navItemHoverClasses = classNames(
  'transition-colors duration-300',
  'hover:bg-gray-light lg:hover:text-primary lg:hover:bg-white'
);

function NavDropdown(props: DropdownProps): ReactElement {
  const { title, navItem } = props;
  const t = useTranslations('navigation');
  const ariaKey = `aria.${title}` as NavItemKey;

  const aria = t.has(ariaKey) ? t(ariaKey, { appName: NON_LOCALIZED_STRING.appName }) : undefined;

  return (
    <Link
      href={navItem.href}
      aria-label={aria}
      target={navItem.target}
      rel={navItem.rel ?? undefined}
      className={classNames(navItemClasses, navItemHoverClasses)}
    >
      {title}
    </Link>
  );
}

export const navLinkClasses = classNames(
  'bg-gray block w-full px-5 py-2 uppercase border-transparent border-b-3 cursor-pointer',
  'lg:px-2 lg:w-auto lg:bg-transparent'
);

export const navLinkHoverClasses = classNames(
  'transition-colors duration-300',
  'hover:bg-gray-light lg:hover:border-primary lg:hover:text-primary lg:hover:bg-transparent'
);

export default function NavItem(props: NavItemProps): ReactElement {
  const { title, navItem, isIcon: isSVG = false, hoverEffect = true, zIndex } = props;
  const t = useTranslations('navigation');
  const router = useRouter();
  const { isSmall, isMedium, isLarge, isHuge, isEnormous } = useScreen();
  const [IsDropdownExpanded, setIsDropdownExpanded] = useState(false);

  const isActiveNavLink = (url: string) => {
    return router.asPath.includes(url) && 'lg:border-primary lg:text-primary';
  };

  const ariaKey = `aria.${title}` as NavItemKey;
  const aria = t.has(ariaKey) ? t(ariaKey, { appName: NON_LOCALIZED_STRING.appName }) : undefined;

  useEffect(() => {
    setIsDropdownExpanded(false);
  }, []);

  return (
    <>
      {!navItem.items ? (
        <Link
          href={navItem.href}
          aria-label={aria}
          target={navItem.target}
          rel={navItem.rel ?? undefined}
          className={classNames(
            !isSVG && navLinkClasses,
            isActiveNavLink(navItem.href),
            hoverEffect && navLinkHoverClasses
          )}
        >
          {title}
        </Link>
      ) : (
        <span
          className={classNames(
            'group relative w-full',
            'lg:flex lg:w-auto lg:flex-col lg:items-start lg:justify-center'
          )}
        >
          <span
            aria-label={aria}
            className={classNames(
              'relative flex flex-row',
              !isSVG && navLinkClasses,
              'lg:border-transparent lg:border-b-3',
              'duration-500 lg:transform lg:transition-colors',
              'lg:group-hover:border-primary',
              isActiveNavLink(`${navItem.href}/`)
            )}
            onClick={() => {
              if (isSmall || isMedium) {
                setIsDropdownExpanded(!IsDropdownExpanded);
              }
            }}
            onMouseOver={() => {
              if (isLarge || isHuge || isEnormous) {
                setIsDropdownExpanded(true);
              }
            }}
          >
            {title}
            <span className="block lg:hidden">
              <MenuSVG
                className={classNames(
                  '-mt-1 ml-3 inline h-3 w-3 transform fill-current duration-300',
                  IsDropdownExpanded ? 'hidden' : 'block'
                )}
              />
              <CloseSVG
                className={classNames(
                  '-mt-1 ml-3 inline h-3 w-3 transform fill-current duration-300',
                  IsDropdownExpanded ? 'block' : 'hidden'
                )}
              />
            </span>
          </span>
          <div
            className={classNames(
              'w-full overflow-hidden',
              'transform transition-all duration-300',
              'lg:absolute lg:top-12 lg:w-44 lg:overflow-visible lg:bg-white lg:opacity-0',
              'lg:duration-500',
              'lg:group-hover:opacity-100 lg:group-hover:duration-700',
              (isSmall || isMedium) && IsDropdownExpanded
                ? Object.keys(navItem.items).length > 2
                  ? '-mb-3 h-32'
                  : '-mb-1'
                : 'h-0 translate-y-auto lg:translate-y-0'
            )}
            style={{ zIndex: zIndex ? zIndex : undefined }}
            // onMouseOut={() => setIsHover(false)}
            onMouseOver={() => {
              if (isLarge || isHuge || isEnormous) {
                setIsDropdownExpanded(true);
              }
            }}
            onMouseLeave={() => {
              if (isLarge || isHuge || isEnormous) {
                setIsDropdownExpanded(false);
              }
            }}
          >
            {Object.entries(navItem.items).map(([key, value]) => {
              return <NavDropdown key={`${key}${value.href}`} navItem={value} title={key} />;
            })}
          </div>
        </span>
      )}
    </>
  );
}
