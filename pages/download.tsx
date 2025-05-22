/* eslint-disable @next/next/no-html-link-for-pages */
import { ReactComponent as AndroidSVG } from '@/assets/svgs/android_robot_head.svg';
import { ReactComponent as AppleSVG } from '@/assets/svgs/apple.svg';
import Container from '@/components/Container';
import { ReactComponent as FDroidSVG } from '@/assets/svgs/fdroid-logo.svg';
import Image from 'next/image';
import { Layout } from '@/components/ui';
import Link from 'next/link';
import { ReactComponent as LinuxSVG } from '@/assets/svgs/linux.svg';
import METADATA from '@/constants/metadata';
import { ReactElement } from 'react';
import { ReactComponent as WindowsSVG } from '@/assets/svgs/windows.svg';
import classNames from 'classnames';

export default function Download(): ReactElement {
  const panelClasses = classNames(
    'mx-auto text-center',
    'lg:w-1/2 lg:flex lg:flex-col lg:pb-16'
  );
  const headingClasses = 'text-5xl font-semibold';
  const subtitleClasses = classNames('text-2xl', 'lg:text-3xl');
  const linkContainerClasses = classNames(
    'grid grid-cols-2 gap-2 mb-4 mx-auto',
    'lg:w-max'
  );
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
    <Layout title="Download" metadata={METADATA.DOWNLOAD_PAGE}>
      <section
        className={classNames(
          'bg-gray-dark pb-16 border-b border-primary border-dashed',
          'lg:bg-unset lg:pb-0 lg:border-b-0'
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
              'bg-primary text-gray-dark min-h-screen',
              'lg:mr-2 lg:justify-between lg:items-end lg:min-h-full'
            )}
          >
            <div
              className={classNames(
                'lg:w-3/4 lg:mr-8 lg:flex lg:flex-col lg:justify-end',
                'xl:w-7/12',
                '2xl:w-1/2 2xl:mr-24'
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
                Download Session for
              </p>
              <h2 className={classNames(headingClasses, 'my-4')}>Mobile</h2>
              <div
                className={classNames(
                  '-mt-2 -ml-1 px-16 mb-3',
                  'md:-mt-5 md:px-48',
                  'lg:mt-0 lg:px-0 lg:w-2/3 lg:mx-auto'
                )}
              >
                <Image
                  src="/assets/images/ui-create-account.png"
                  alt="mobile app create account screenshot"
                  width="1148px"
                  height="2000px"
                  layout="responsive"
                  priority={true}
                  loading="eager"
                />
              </div>
              <div className={classNames(linkContainerClasses)}>
                <div className={classNames(downloadContainerClasses)}>
                  <Link href="/android">
                    <a
                      className={classNames(
                        downloadLinkClasses,
                        'lg:hover:bg-gray-dark lg:hover:text-primary'
                      )}
                    >
                      <AndroidSVG
                        className={classNames(
                          downloadSVGClasses,
                          'w-6 h-6',
                          'md:w-8 md:h-8'
                        )}
                      />
                      <span>Android</span>
                    </a>
                  </Link>
                </div>
                <div className={classNames(downloadContainerClasses)}>
                  <Link href="/apk">
                    <a
                      className={classNames(
                        downloadLinkClasses,
                        'lg:hover:bg-gray-dark lg:hover:text-primary'
                      )}
                    >
                      <AndroidSVG
                        className={classNames(
                          downloadSVGClasses,
                          'w-6 h-6',
                          'md:w-8 md:h-8'
                        )}
                      />
                      <span>APK</span>
                    </a>
                  </Link>
                </div>
                <div className={classNames(downloadContainerClasses)}>
                  <Link href="/f-droid">
                    <a
                      className={classNames(
                        downloadLinkClasses,
                        'lg:hover:bg-gray-dark lg:hover:text-primary'
                      )}
                    >
                      <FDroidSVG
                        className={classNames(
                          downloadSVGClasses,
                          'w-5 h-5',
                          'md:w-7 md:h-7'
                        )}
                      />
                      <span>F-Droid</span>
                    </a>
                  </Link>
                </div>
                <div className={classNames(downloadContainerClasses)}>
                  <Link href="/iphone">
                    <a
                      className={classNames(
                        downloadLinkClasses,
                        'lg:hover:bg-gray-dark lg:hover:text-primary'
                      )}
                    >
                      <AppleSVG
                        className={classNames(
                          downloadSVGClasses,
                          'w-4 h-4',
                          'md:w-6 md:h-6'
                        )}
                      />
                      <span>iPhone</span>
                    </a>
                  </Link>
                </div>
              </div>
              <div
                className={classNames(noteContainerClasses, 'pb-12', 'lg:pb-0')}
              >
                <p className={classNames(notesClasses)}>
                  Verify Signatures:
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
                  Release Notes:
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
              'lg:ml-2 lg:justify-between lg:items-start'
            )}
          >
            <div
              className={classNames(
                'lg:w-3/4 lg:ml-10 lg:h-full lg:flex lg:flex-col lg:justify-end',
                'xl:w-7/12',
                '2xl:w-1/2 2xl:ml-24'
              )}
            >
              <p
                className={classNames(
                  subtitleClasses,
                  'pt-12',
                  'lg:pt-20',
                  'xl:pt-8',
                  '2xl:pt-12'
                )}
              >
                Download Session for
              </p>
              <h2 className={classNames(headingClasses, 'mt-4', 'lg:mb-auto')}>
                Desktop
              </h2>
              <div
                className={classNames(
                  'px-3 -ml-1 mt-8 mb-12 z-0',
                  'md:px-16 md:-ml-4 md:mb-20',
                  'lg:px-0 lg:-mt-4 lg:ml-0 lg:-mr-6 lg:mb-auto',
                  'xl:-mt-8 xl:-mr-8'
                )}
              >
                <Image
                  src="/assets/images/mockup-desktop.png"
                  alt="desktop app screenshot"
                  width="1130px"
                  height="1000px"
                  layout="responsive"
                  priority={true}
                  loading="eager"
                />
              </div>
              <div
                className={classNames(
                  linkContainerClasses,
                  'md:-mt-8',
                  'lg:mt-0'
                )}
              >
                <div className={classNames(downloadContainerClasses)}>
                  <a
                    className={classNames(
                      downloadLinkClasses,
                      'lg:hover:bg-white lg:hover:text-gray-dark'
                    )}
                    href="/mac"
                  >
                    <AppleSVG
                      className={classNames(
                        downloadSVGClasses,
                        'w-4 h-4',
                        'md:w-6 md:h-6'
                      )}
                    />
                    <span>
                      Mac{' '}
                      <span className={classNames('sm:text-xs md:text-base')}>
                        (Apple Silicon)
                      </span>
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
                      className={classNames(
                        downloadSVGClasses,
                        'w-4 h-4',
                        'md:w-6 md:h-6'
                      )}
                    />
                    <span>
                      Mac{' '}
                      <span className={classNames('sm:text-xs md:text-base')}>
                        (Intel)
                      </span>
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
                      className={classNames(
                        downloadSVGClasses,
                        'w-4 h-4',
                        'md:w-6 md:h-6'
                      )}
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
                      className={classNames(
                        downloadSVGClasses,
                        'w-5 h-5',
                        'md:w-7 md:h-7'
                      )}
                    />
                    <span>Linux</span>
                  </a>
                </div>
              </div>
              <div
                className={classNames(
                  noteContainerClasses,
                  'md:pb-16',
                  'lg:pb-0'
                )}
              >
                <p className={classNames(notesClasses)}>
                  Verify Signatures:
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
                  Release Notes:
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
