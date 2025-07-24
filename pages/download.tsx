/* eslint-disable @next/next/no-html-link-for-pages */

import classNames from 'classnames';
import type { GetStaticProps, GetStaticPropsContext } from 'next';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import { ReactComponent as AndroidSVG } from '@/assets/svgs/android_robot_head.svg';
import { ReactComponent as AppleSVG } from '@/assets/svgs/apple.svg';
import { ReactComponent as FDroidSVG } from '@/assets/svgs/fdroid-logo.svg';
import { ReactComponent as LinuxSVG } from '@/assets/svgs/linux.svg';
import { ReactComponent as WindowsSVG } from '@/assets/svgs/windows.svg';
import Container from '@/components/Container';
import Layout from '@/components/ui/Layout';
import { NON_LOCALIZED_STRING } from '@/constants/localization';
import METADATA from '@/constants/metadata';

export default function Download(): ReactElement {
  const t = useTranslations('download');
  const _tGeneral = useTranslations('general');
  const tImage = useTranslations('imageAlt');

  const panelClasses = classNames('mx-auto text-center', 'lg:w-1/2 lg:flex lg:flex-col lg:pb-16');
  const headingClasses = 'text-5xl font-semibold';
  const subtitleClasses = classNames('text-2xl', 'lg:text-3xl');
  const linkContainerClasses = classNames('grid grid-cols-2 gap-2 mb-4 mx-auto', 'lg:w-max');
  const downloadContainerClasses = classNames('pb-2 lg:py-3 z-10');
  const downloadLinkClasses = classNames(
    'text-lg font-bold rounded-3xl py-2',
    'md:text-3xl md:whitespace-nowrap',
    'lg:pr-3 lg:ml-2',
    'transition-colors duration-300'
  );
  const downloadSVGClasses = 'inline-block mx-3 -mt-2 fill-current';
  const noteContainerClasses = classNames(
    'flex flex-col justify-evenly items-center',
    'md:pt-4',
    'lg:w-full',
    'xl:pt-0'
  );
  const notesClasses = classNames(
    'text-base flex justify-center items-center gap-1',
    'md:text-2xl',
    'lg:text-lg',
    'xl:text-xl'
  );
  const notesLinkClasses = classNames(
    'font-bold py-1 px-4 rounded-3xl cursor-pointer',
    'transition-colors duration-300'
  );
  return (
    <Layout localeKey="download" metadata={METADATA.DOWNLOAD_PAGE}>
      <section
        className={classNames(
          'border-primary border-b border-dashed bg-gray-dark pb-16',
          'lg:border-b-0 lg:bg-unset lg:pb-0'
        )}
      >
        <Container
          hasMinHeight={true}
          heights={{
            small: '100%',
            medium: '100%',
            large: '100%',
          }}
          classes={classNames(
            'px-0 py-0',
            'md:px-0 md:py-0',
            'lg:-mt-4 lg:mb-4 lg:pl-0 lg:pr-0 lg:flex lg:max-w-none',
            '2xl: mt-0'
          )}
        >
          <div
            className={classNames(
              panelClasses,
              'min-h-screen bg-primary text-gray-dark',
              'lg:mr-2 lg:min-h-full lg:items-end lg:justify-between'
            )}
          >
            <div
              className={classNames(
                'lg:mr-8 lg:flex lg:w-3/4 lg:flex-col lg:justify-end',
                'xl:w-7/12',
                '2xl:mr-24 2xl:w-1/2'
              )}
            >
              <p
                className={classNames(
                  subtitleClasses,
                  'pt-12',
                  'md:pt-8',
                  'lg:pt-20',
                  'xl:pt-8',
                  '2xl:pt-12'
                )}
              >
                {t('heading', { appName: NON_LOCALIZED_STRING.appName })}
              </p>
              <h2 className={classNames(headingClasses, 'my-4')}>{t('mobile')}</h2>
              <div
                className={classNames(
                  '-mt-2 -ml-1 mb-3 px-16',
                  'md:-mt-5 md:px-48',
                  'lg:mx-auto lg:mt-0 lg:w-2/3 lg:px-0'
                )}
              >
                <Image
                  src="/assets/images/encrypted-messaging-app-phone.png"
                  alt={tImage('appMobile')}
                  width={1148}
                  height={2000}
                  layout="responsive"
                  priority={true}
                  loading="eager"
                />
              </div>
              <div className={classNames(linkContainerClasses)}>
                <div className={classNames(downloadContainerClasses)}>
                  <Link
                    href="/android"
                    className={classNames(
                      downloadLinkClasses,
                      'lg:hover:bg-gray-dark lg:hover:text-primary'
                    )}
                  >
                    <AndroidSVG
                      className={classNames(downloadSVGClasses, 'h-6 w-6', 'md:h-8 md:w-8')}
                    />
                    <span>Android</span>
                  </Link>
                </div>
                <div className={classNames(downloadContainerClasses)}>
                  <Link
                    href="/apk"
                    className={classNames(
                      downloadLinkClasses,
                      'lg:hover:bg-gray-dark lg:hover:text-primary'
                    )}
                  >
                    <AndroidSVG
                      className={classNames(downloadSVGClasses, 'h-6 w-6', 'md:h-8 md:w-8')}
                    />
                    <span>APK</span>
                  </Link>
                </div>
                <div className={classNames(downloadContainerClasses)}>
                  <Link
                    href="/f-droid"
                    className={classNames(
                      downloadLinkClasses,
                      'lg:hover:bg-gray-dark lg:hover:text-primary'
                    )}
                  >
                    <FDroidSVG
                      className={classNames(downloadSVGClasses, 'h-5 w-5', 'md:h-7 md:w-7')}
                    />
                    <span>F-Droid</span>
                  </Link>
                </div>
                <div className={classNames(downloadContainerClasses)}>
                  <Link
                    href="/iphone"
                    className={classNames(
                      downloadLinkClasses,
                      'lg:hover:bg-gray-dark lg:hover:text-primary'
                    )}
                  >
                    <AppleSVG
                      className={classNames(downloadSVGClasses, 'h-4 w-4', 'md:h-6 md:w-6')}
                    />
                    <span>iPhone</span>
                  </Link>
                </div>
              </div>
              <div className={classNames(noteContainerClasses, 'pb-12', 'lg:pb-0')}>
                <p className={classNames(notesClasses)}>
                  {t('verifySignatures', { platforms: '' })}
                  <a
                    href="https://github.com/session-foundation/session-android/tree/master#verifying-signatures"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames(
                      notesLinkClasses,
                      'lg:hover:bg-gray-dark lg:hover:text-primary'
                    )}
                  >
                    Android
                  </a>
                  <a
                    href="https://github.com/session-foundation/session-ios/tree/master#verifying-signatures"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames(
                      notesLinkClasses,
                      'lg:hover:bg-gray-dark lg:hover:text-primary'
                    )}
                  >
                    iOS
                  </a>
                </p>
                <p className={classNames(notesClasses)}>
                  {t('releaseNotes', { platforms: '' })}
                  <a
                    href="https://github.com/session-foundation/session-android/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames(
                      notesLinkClasses,
                      'lg:hover:bg-gray-dark lg:hover:text-primary'
                    )}
                  >
                    Android
                  </a>
                  <a
                    href="https://github.com/session-foundation/session-ios/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames(
                      notesLinkClasses,
                      'lg:hover:bg-gray-dark lg:hover:text-primary'
                    )}
                  >
                    iOS
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div
            className={classNames(
              panelClasses,
              'bg-gray-dark text-white',
              'lg:ml-2 lg:items-start lg:justify-between'
            )}
          >
            <div
              className={classNames(
                'lg:ml-10 lg:flex lg:h-full lg:w-3/4 lg:flex-col lg:justify-end',
                'xl:w-7/12',
                '2xl:ml-24 2xl:w-1/2'
              )}
            >
              <p
                className={classNames(subtitleClasses, 'pt-12', 'lg:pt-20', 'xl:pt-8', '2xl:pt-12')}
              >
                {t('heading', { appName: NON_LOCALIZED_STRING.appName })}
              </p>
              <h2 className={classNames(headingClasses, 'mt-4', 'lg:mb-auto')}>{t('desktop')}</h2>
              <div
                className={classNames(
                  '-ml-1 z-0 mt-8 mb-12 px-3',
                  'md:-ml-4 md:mb-20 md:px-16',
                  'lg:-mt-4 lg:-mr-6 lg:mb-auto lg:ml-0 lg:px-0',
                  'xl:-mt-8 xl:-mr-8'
                )}
              >
                <Image
                  src="/assets/images/encrypted-messaging-app-desktop.png"
                  alt={tImage('appLaptop')}
                  width={1130}
                  height={1000}
                  layout="responsive"
                  priority={true}
                  loading="eager"
                />
              </div>
              <div className={classNames(linkContainerClasses, 'md:-mt-8', 'lg:mt-0')}>
                <div className={classNames(downloadContainerClasses)}>
                  <a
                    className={classNames(
                      downloadLinkClasses,
                      'lg:hover:bg-white lg:hover:text-gray-dark'
                    )}
                    href="/mac"
                  >
                    <AppleSVG
                      className={classNames(downloadSVGClasses, 'h-4 w-4', 'md:h-6 md:w-6')}
                    />
                    <span>
                      Mac{' '}
                      <span className={classNames('sm:text-xs md:text-base')}>(Apple Silicon)</span>
                    </span>
                  </a>
                </div>
                <div className={classNames(downloadContainerClasses)}>
                  <a
                    className={classNames(
                      downloadLinkClasses,
                      'lg:hover:bg-white lg:hover:text-gray-dark'
                    )}
                    href="/mac-x64"
                  >
                    <AppleSVG
                      className={classNames(downloadSVGClasses, 'h-4 w-4', 'md:h-6 md:w-6')}
                    />
                    <span>
                      Mac <span className={classNames('sm:text-xs md:text-base')}>(Intel)</span>
                    </span>
                  </a>
                </div>
                <div className={classNames(downloadContainerClasses)}>
                  <a
                    className={classNames(
                      downloadLinkClasses,
                      'lg:hover:bg-white lg:hover:text-gray-dark'
                    )}
                    href="/windows"
                  >
                    <WindowsSVG
                      className={classNames(downloadSVGClasses, 'h-4 w-4', 'md:h-6 md:w-6')}
                    />
                    <span>Windows</span>
                  </a>
                </div>
                <div className={classNames(downloadContainerClasses)}>
                  <a
                    className={classNames(
                      downloadLinkClasses,
                      'lg:hover:bg-white lg:hover:text-gray-dark'
                    )}
                    href="/linux"
                  >
                    <LinuxSVG
                      className={classNames(downloadSVGClasses, 'h-5 w-5', 'md:h-7 md:w-7')}
                    />
                    <span>Linux</span>
                  </a>
                </div>
              </div>
              <div className={classNames(noteContainerClasses, 'md:pb-16', 'lg:pb-0')}>
                <p className={classNames(notesClasses)}>
                  {t('verifySignatures', { platforms: '' })}
                  <a
                    href="https://github.com/session-foundation/session-desktop/tree/master#verifying-signatures"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames(
                      notesLinkClasses,
                      'lg:hover:bg-white lg:hover:text-gray-dark'
                    )}
                  >
                    Desktop
                  </a>
                </p>
                <p className={classNames(notesClasses)}>
                  {t('releaseNotes', { platforms: '' })}
                  <a
                    href="https://github.com/session-foundation/session-desktop/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames(
                      notesLinkClasses,
                      'lg:hover:bg-white lg:hover:text-gray-dark'
                    )}
                  >
                    Desktop
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: { messages: (await import(`../locales/${context.locale}.json`)).default },
  };
};
