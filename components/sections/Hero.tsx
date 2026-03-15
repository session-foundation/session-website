import classNames from 'classnames';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import { ReactComponent as AndroidSVG } from '@/assets/svgs/android_robot_head.svg';
import { ReactComponent as AppleSVG } from '@/assets/svgs/apple.svg';
import { ReactComponent as DesktopSVG } from '@/assets/svgs/desktop.svg';
import { ReactComponent as FDroidSVG } from '@/assets/svgs/fdroid-logo.svg';
import Container from '@/components/Container';
import Button from '@/components/ui/Button';
import { NON_LOCALIZED_STRING } from '@/constants/localization';
import capitalize from '@/utils/capitalize';

export default function Hero(): ReactElement {
  const t = useTranslations('landing.hero');
  const tGeneral = useTranslations('general');
  const tImage = useTranslations('imageAlt');
  const headingClasses = classNames(
    'text-4xl font-semibold text-gray-dark mb-4 whitespace-nowrap',
    'md:text-5xl',
    'lg:text-6xl'
  );
  const subHeadingClasses = classNames(
    'text-xl font-semibold text-gray-dark',
    'md:text-2xl',
    'lg:text-2xl'
  );
  const downloadLinkClasses = 'text-3xl font-bold text-primary mb-7';
  const downloadSVGClasses = 'inline-block mx-3 -mt-2 fill-current';

  const heroText = t.rich('heading', {
    glitch: (chunk) => (
      <span className="glitch block" data-glitch-text={t('glitchTextGlitch')}>
        {chunk}
      </span>
    ),
  });

  return (
    <section className="md:min-h-screen">
      <Container
        hasMinHeight={false}
        classes={classNames(
          'lg:mt-16 lg:flex lg:flex-col lg:justify-center lg:items-center md:min-h-screen lg:min-h-[calc(100vh-112px)]'
        )}
      >
        <div
          className={classNames(
            'lg:-mt-16 lg:flex lg:w-full lg:items-center lg:justify-between',
            '3xl:-mt-64'
          )}
        >
          <div>
            <h1 className={classNames(headingClasses, 'whitespace-pre-line')}>{heroText}</h1>
            <p className={classNames(subHeadingClasses)}>
              {t('tag', { appName: NON_LOCALIZED_STRING.appName })}
            </p>

            <Link href="/download" className="mt-2 hidden lg:block">
              <Button fontWeight="bold" size="large" classes="mt-4 px-12">
                {tGeneral('download')}
              </Button>
            </Link>
          </div>
          <div
            className={classNames('w-full', 'mr-auto ml-auto', 'max-w-xl')}
            style={{ aspectRatio: '2499/2176' }}
          >
            <Image
              src="/assets/images/encrypted-messaging-app.webp"
              alt={tImage('hero')}
              title={capitalize(tImage('hero'))}
              width={1080}
              height={940}
              priority={true}
              sizes="(max-width: 1023px) 100vw, 1080px"
              quality={95}
              placeholder="empty"
              fetchPriority="high"
            />
          </div>

          <div
            className={classNames(
              '-mx-6 mt-4 flex flex-wrap justify-around gap-4 border-t-2 border-dashed pt-8 text-xs',
              'md:mx-0 md:border-none md:pt-0',
              'lg:hidden'
            )}
          >
            <Link href="/android" className={downloadLinkClasses}>
              <AndroidSVG className={classNames(downloadSVGClasses, 'h-8 w-8')} />
              <span>Android</span>
            </Link>
            <Link href="/apk" className={downloadLinkClasses}>
              <AndroidSVG className={classNames(downloadSVGClasses, 'h-8 w-8')} />
              <span>APK</span>
            </Link>
            <Link href="/f-droid" className={downloadLinkClasses}>
              <FDroidSVG className={classNames(downloadSVGClasses, 'h-8 w-8')} />
              <span>F-Droid</span>
            </Link>
            <Link href="/iphone" className={downloadLinkClasses}>
              <AppleSVG className={classNames(downloadSVGClasses, 'h-6 w-6')} />
              <span>iPhone</span>
            </Link>
            <Link href="/download" className={downloadLinkClasses}>
              <DesktopSVG className={classNames(downloadSVGClasses, 'h-7 w-7')} />
              <span>Desktop</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
