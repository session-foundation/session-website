import { ReactComponent as AndroidSVG } from '@/assets/svgs/android_robot_head.svg';
import { ReactComponent as AppleSVG } from '@/assets/svgs/apple.svg';
import { Button } from '@/components/ui';
import Container from '@/components/Container';
import { ReactComponent as DesktopSVG } from '@/assets/svgs/desktop.svg';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement } from 'react';
import classNames from 'classnames';
import { ReactComponent as FDroidSVG } from '@/assets/svgs/fdroid-logo.svg';

export default function Hero(): ReactElement {
  const headingClasses = classNames(
    'text-4xl font-semibold text-gray-dark mb-4',
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
  return (
    <section>
      <Container
        hasMinHeight={true}
        heights={{ small: '100%', medium: '100%', large: '100vh - 112px' }}
        classes={classNames(
          'lg:mt-16 lg:flex lg:flex-col lg:justify-center lg:items-center'
        )}
      >
        <div
          className={classNames(
            'lg:-mt-16 lg:w-full lg:flex lg:justify-between lg:items-center',
            '3xl:-mt-64'
          )}
        >
          <div>
            <h1 className={classNames(headingClasses)}>
              <span className="block">Send</span>
              <span className={'block glitch'} data-glitch-text={'Encrypted'}>
                Messages,
              </span>
              <span className="block whitespace-nowrap">Not Metadata.</span>
            </h1>
            <p className={classNames(subHeadingClasses)}>
              Find your freedom with Session
            </p>

            <Link href="/download">
              <a className="hidden lg:block mt-2">
                <Button fontWeight="bold" size="large" classes="mt-4 px-12">
                  Download
                </Button>
              </a>
            </Link>
          </div>

          <div
            className={classNames(
              'ml-auto mr-auto',
              'md:max-w-xl',
              'lg:-mr-8',
              'xl:-ml-8 xl:max-w-3xl',
              '2xl:max-w-2xl',
              '3xl:max-w-4xl'
            )}
          >
            <Image
              src="/assets/images/hero.png"
              alt="mobile app ui showcase"
              width="2499px"
              height="2176px"
              priority={true}
              loading="eager"
            />
          </div>

          <div
            className={classNames(
              'flex justify-around flex-wrap mt-4 pt-8 gap-4 text-xs border-dashed border-t-2 -mx-6',
              'md:border-none md:pt-0 md:mx-0',
              'lg:hidden'
            )}
          >
            <Link href="/android">
              <a className={downloadLinkClasses}>
                <AndroidSVG
                  className={classNames(downloadSVGClasses, 'w-8 h-8')}
                />
                <span>Android</span>
              </a>
            </Link>
            <Link href="/apk">
              <a className={downloadLinkClasses}>
                <AndroidSVG
                  className={classNames(downloadSVGClasses, 'w-8 h-8')}
                />
                <span>APK</span>
              </a>
            </Link>
            <Link href="/f-droid">
              <a className={downloadLinkClasses}>
                <FDroidSVG
                  className={classNames(downloadSVGClasses, 'w-8 h-8')}
                />
                <span>F-Droid</span>
              </a>
            </Link>
            <Link href="/iphone">
              <a className={downloadLinkClasses}>
                <AppleSVG
                  className={classNames(downloadSVGClasses, 'w-6 h-6')}
                />
                <span>iPhone</span>
              </a>
            </Link>
            <Link href="/download">
              <a className={downloadLinkClasses}>
                <DesktopSVG
                  className={classNames(downloadSVGClasses, 'w-7 h-7')}
                />
                <span>Desktop</span>
              </a>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
