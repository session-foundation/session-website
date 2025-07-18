import { ReactComponent as AndroidSVG } from '@/assets/svgs/android_robot_head.svg';
import { ReactComponent as AppleSVG } from '@/assets/svgs/apple.svg';
import { Button } from '@/components/ui';
import Container from '@/components/Container';
import { ReactComponent as DesktopSVG } from '@/assets/svgs/desktop.svg';
import Image from 'next/legacy/image';
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
    <section className="min-h-screen">
      <Container
        hasMinHeight={false}
        classes={classNames(
          'lg:mt-16 lg:flex lg:flex-col lg:justify-center lg:items-center min-h-screen lg:min-h-[calc(100vh-112px)]'
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

            <Link href="/download" className="hidden lg:block mt-2">
              <Button fontWeight="bold" size="large" classes="mt-4 px-12">
                Download
              </Button>
            </Link>
          </div>
          <div
            className={classNames('w-full', 'ml-auto mr-auto', 'max-w-full')}
            style={{ aspectRatio: '2499/2176' }}
          >
            <Image
              src="/assets/images/encrypted-messaging-app.webp"
              alt="mobile encrypted messaging app ui showcase"
              width={1080}
              height={940}
              priority={true}
              sizes="(max-width: 1023px) 100vw, 1080px"
              quality={95}
              placeholder="empty"
            />
          </div>

          <div
            className={classNames(
              'flex justify-around flex-wrap mt-4 pt-8 gap-4 text-xs border-dashed border-t-2 -mx-6',
              'md:border-none md:pt-0 md:mx-0',
              'lg:hidden'
            )}
          >
            <Link href="/android" className={downloadLinkClasses}>
              <AndroidSVG
                className={classNames(downloadSVGClasses, 'w-8 h-8')}
              />
              <span>Android</span>
            </Link>
            <Link href="/apk" className={downloadLinkClasses}>
              <AndroidSVG
                className={classNames(downloadSVGClasses, 'w-8 h-8')}
              />
              <span>APK</span>
            </Link>
            <Link href="/f-droid" className={downloadLinkClasses}>
              <FDroidSVG
                className={classNames(downloadSVGClasses, 'w-8 h-8')}
              />
              <span>F-Droid</span>
            </Link>
            <Link href="/iphone" className={downloadLinkClasses}>
              <AppleSVG className={classNames(downloadSVGClasses, 'w-6 h-6')} />
              <span>iPhone</span>
            </Link>
            <Link href="/download" className={downloadLinkClasses}>
              <DesktopSVG
                className={classNames(downloadSVGClasses, 'w-7 h-7')}
              />
              <span>Desktop</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
