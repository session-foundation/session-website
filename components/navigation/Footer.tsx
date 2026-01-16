import classNames from 'classnames';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { FunctionComponent, ReactElement, SVGProps } from 'react';
import { ReactComponent as GithubSVG } from '@/assets/svgs/github.svg';
import { ReactComponent as InstagramSVG } from '@/assets/svgs/instagram.svg';
import { ReactComponent as MastodonSVG } from '@/assets/svgs/mastodon.svg';
import { ReactComponent as RssSVG } from '@/assets/svgs/rss.svg';
import { ReactComponent as TwitterSVG } from '@/assets/svgs/twitter.svg';
import { ReactComponent as YouTubeSVG } from '@/assets/svgs/youtube.svg';
import { NON_LOCALIZED_STRING } from '@/constants/localization';
import redact from '@/utils/redact';

// Type definitions
interface SocialLink {
  href: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  external: boolean;
  platform: string;
  customIconClasses?: string;
}

const headingClasses = classNames('text-white uppercase text-xl font-bold mb-2');
const linkClasses = classNames(
  'text-sm py-2 mr-2 font-semibold',
  'lg:py-0 lg:my-0',
  'transition-colors duration-300',
  'hover:text-white'
);
const socialLinkClasses = classNames('text-primary', 'transition duration-300', 'hover:text-white');
const svgClasses = classNames('fill-current w-7 h-7 m-1', 'lg:my-0 lg:ml-0', 'hover:animate-push');

// Social media data with accessibility labels
const socialLinks: SocialLink[] = [
  {
    href: 'https://twitter.com/session_app',
    icon: TwitterSVG,
    external: true,
    platform: 'Twitter',
  },
  {
    href: 'https://mastodon.social/@session',
    icon: MastodonSVG,
    external: true,
    platform: 'Mastodon',
    customIconClasses:
      'border-primary border-2.5 rounded-full py-1 hover:border-white duration-300',
  },
  {
    href: 'https://www.instagram.com/getsession',
    icon: InstagramSVG,
    external: true,
    platform: 'Instagram',
  },
  {
    href: 'https://www.youtube.com/@SessionTV',
    icon: YouTubeSVG,
    external: true,
    platform: 'YouTube',
  },
  {
    href: 'https://github.com/session-foundation',
    icon: GithubSVG,
    external: true,
    platform: 'GitHub',
  },
  {
    href: '/feed',
    icon: RssSVG,
    external: false,
    platform: 'RSS',
  },
];

function SocialLinks() {
  const t = useTranslations('footer.aria');
  return (
    <ul className={classNames('-ml-1 flex flex-wrap', 'md:pr-1', 'lg:gap-2 lg:pr-0')}>
      {socialLinks.map(
        ({ platform, href, external, customIconClasses, icon: IconComponent }: SocialLink) => {
          const label =
            platform === 'RSS'
              ? t('rssLink')
              : t('socialLink', { appName: NON_LOCALIZED_STRING.appName, platform });

          return (
            <li key={platform}>
              <Link
                href={href}
                className={socialLinkClasses}
                target={external ? '_blank' : '_self'}
                rel={external ? 'noopener noreferrer' : undefined}
                aria-label={label}
                title={label}
                prefetch={false}
              >
                <IconComponent
                  className={classNames(svgClasses, customIconClasses)}
                  aria-hidden={true}
                />
                <span className="sr-only">{label}</span>
              </Link>
            </li>
          );
        }
      )}
    </ul>
  );
}

export default function Footer(): ReactElement {
  const t = useTranslations('footer');
  const tNav = useTranslations('navigation');
  const tGeneral = useTranslations('general');
  const tAbout = useTranslations('landing.about');
  const redactedClasses = redact({
    redactColor: 'primary',
    textColor: 'white',
    animate: true,
    classes: 'py-0.5 py-1',
  });

  return (
    <div className={classNames('bg-gray-dark')}>
      <footer
        className={classNames(
          'text-primary-dark',
          'lg:mx-auto lg:flex lg:max-w-screen-xl lg:flex-row-reverse lg:justify-between'
        )}
      >
        <div
          className={classNames(
            'flex flex-wrap border-primary border-b border-dashed px-8 pt-6 pb-4',
            'md:pb-8',
            'lg:w-1/2 lg:border-b-0 lg:border-l lg:pt-12 lg:pr-4'
          )}
        >
          <div className={classNames('mb-4 flex w-1/2 flex-col gap-1', 'md:w-1/4', 'lg:w-1/3')}>
            <h3 className={headingClasses}>{t('about')}</h3>
            <Link
              href="/whitepaper"
              className={linkClasses}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tGeneral('whitepaper')}
            </Link>
            <Link href="/privacy-policy" className={linkClasses}>
              {tGeneral('privacyPolicy')}
            </Link>
            <Link href="/terms-of-service" className={linkClasses}>
              {tGeneral('termsOfService')}
            </Link>
            <Link href="/blog" className={linkClasses}>
              {tNav('blog')}
            </Link>
            <Link href="/faq" className={linkClasses}>
              {tNav('faq')}
            </Link>
          </div>
          <div className={classNames('mb-4 flex w-1/2 flex-col gap-1', 'md:w-1/4', 'lg:w-1/3')}>
            <h3 className={headingClasses}>{tGeneral('other')}</h3>
            <Link
              href="https://token.getsession.org"
              className={linkClasses}
              target="_blank"
              rel="noopener noreferrer"
            >
              {NON_LOCALIZED_STRING.appToken}
            </Link>
            <Link
              href="https://lokinet.org/"
              className={linkClasses}
              target="_blank"
              rel="noopener noreferrer"
            >
              {NON_LOCALIZED_STRING.lokinet}
            </Link>
            <Link href="/assets/downloads/Session-Brandmarks.zip" className={linkClasses}>
              {t('mediaKit')}
            </Link>
            <Link
              href="https://session.foundation/transparency-reports"
              className={linkClasses}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('transparencyReport')}
            </Link>
            <Link
              href="https://session.foundation"
              className={linkClasses}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('foundation')}
            </Link>
          </div>
          <div className={classNames('flex w-full', 'md:w-1/2', 'lg:block lg:w-1/3')}>
            <div className={classNames('mb-4 w-1/2', 'lg:w-full')}>
              <h3 className={headingClasses}>{t('socials')}</h3>
              <SocialLinks />
            </div>
            <div className={classNames('mb-4 flex w-1/2 flex-col', 'lg:w-full')}>
              <h3 className={headingClasses}>{tNav('support')}</h3>
              <a
                href="https://sessionapp.zendesk.com/hc/en-us"
                className={classNames(linkClasses)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('appSupport', {
                  appName: NON_LOCALIZED_STRING.appName,
                })}
              </a>
            </div>
          </div>
        </div>
        <div
          className={classNames(
            'px-8 py-6',
            'md:w-full md:max-w-3xl md:p-10',
            'lg:mb-2 lg:w-1/2 lg:px-7 lg:pt-12 lg:pb-7'
          )}
        >
          <div className={classNames('relative w-32', 'md:w-36', 'lg:w-32', 'xl:w-40')}>
            <Image
              src="/assets/images/logo-white.png"
              alt="session logo"
              title="Session Logo"
              width={120}
              height={26}
              layout="responsive"
            />
          </div>
          <p
            className={classNames(
              'group pt-3 text-sm text-white leading-6 tracking-wide',
              'md:pt-4',
              'xl:text-base xl:leading-relaxed',
              '2xl:leading-loose'
            )}
          >
            {tAbout.rich('content', {
              span: (chunk) => <span className={redactedClasses}>{chunk}</span>,
              appName: NON_LOCALIZED_STRING.appName,
            })}
          </p>
        </div>
      </footer>
    </div>
  );
}
