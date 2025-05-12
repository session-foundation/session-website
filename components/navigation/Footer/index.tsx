import { ReactComponent as GithubSVG } from '@/assets/svgs/github.svg';
import Image from 'next/image';
import { ReactComponent as InstagramSVG } from '@/assets/svgs/instagram.svg';
import { ReactComponent as MastodonSVG } from '@/assets/svgs/mastodon.svg';
import Link from 'next/link';
import { ReactElement } from 'react';
import { ReactComponent as RssSVG } from '@/assets/svgs/rss.svg';
import { ReactComponent as TwitterSVG } from '@/assets/svgs/twitter.svg';
import { ReactComponent as YouTubeSVG } from '@/assets/svgs/youtube.svg';
import classNames from 'classnames';
import redact from '@/utils/redact';
import { useScreen } from '@/contexts/screen';

export default function Footer(): ReactElement {
  const { isSmall } = useScreen();
  const redactedClasses = redact({
    redactColor: 'primary',
    textColor: 'white',
    animate: true,
    classes: 'py-0.5 py-1',
  });
  const headingClasses = classNames(
    'text-white uppercase text-xl font-bold mb-2'
  );
  const linkClasses = classNames(
    'text-sm py-2 mr-2 font-semibold',
    'lg:py-0 lg:my-0',
    'transition-colors duration-300',
    'hover:text-white'
  );
  const socialLinkClasses = classNames(
    'text-primary',
    'transition duration-300',
    'hover:text-white'
  );
  const svgClasses = classNames(
    'fill-current w-7 h-7 m-1',
    'lg:my-0 lg:ml-0',
    'hover:animate-push'
  );
  return (
    <div className={classNames('bg-gray-dark')}>
      <footer
        className={classNames(
          'text-primary-dark',
          'lg:flex lg:flex-row-reverse lg:justify-between lg:max-w-screen-xl lg:mx-auto'
        )}
      >
        <div
          className={classNames(
            'flex flex-wrap pt-6 pb-4 px-8 border-b border-primary border-dashed',
            'md:pb-8',
            'lg:pt-12 lg:pr-4 lg:border-l lg:border-b-0 lg:w-1/2'
          )}
        >
          <div
            className={classNames(
              'flex flex-col w-1/2 mb-4',
              'md:w-1/4',
              'lg:w-1/3'
            )}
          >
            <h3 className={headingClasses}>About</h3>
            <Link href="/whitepaper">
              <a
                className={linkClasses}
                target="_blank"
                rel="noopener noreferrer"
              >
                Whitepaper
              </a>
            </Link>
            <Link href="/privacy-policy">
              <a className={linkClasses}>Privacy Policy</a>
            </Link>
            <Link href="/terms-of-service">
              <a className={linkClasses}>Terms of Service</a>
            </Link>
            <Link href="/blog">
              <a className={linkClasses}>Blog</a>
            </Link>
            <Link href="/faq">
              <a className={linkClasses}>FAQ</a>
            </Link>
          </div>
          <div
            className={classNames(
              'flex flex-col w-1/2 mb-4',
              'md:w-1/4',
              'lg:w-1/3'
            )}
          >
            <h3 className={headingClasses}>Other</h3>
            <Link href="https://token.getsession.org">
              <a
                className={linkClasses}
                target="_blank"
                rel="noopener noreferrer"
              >
                Session Token
              </a>
            </Link>
            <Link href="https://lokinet.org/">
              <a
                className={linkClasses}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lokinet
              </a>
            </Link>
            <Link href="/assets/downloads/Session-Brandmarks.zip">
              <a className={linkClasses}>Media Kit</a>
            </Link>
            <Link href="https://session.foundation/transparency-reports">
              <a
                className={linkClasses}
                target="_blank"
                rel="noopener noreferrer"
              >
                Transparency Report
              </a>
            </Link>
            <Link href="https://session.foundation">
              <a
                className={linkClasses}
                target="_blank"
                rel="noopener noreferrer"
              >
                Foundation
              </a>
            </Link>
          </div>
          <div
            className={classNames(
              'flex w-full',
              'md:w-1/2',
              'lg:block lg:w-1/3'
            )}
          >
            <div className={classNames('w-1/2 mb-4', 'lg:w-full')}>
              <h3 className={headingClasses}>Socials</h3>
              <div
                className={classNames(
                  'flex flex-wrap -ml-1',
                  'md:pr-1',
                  'lg:pr-0 lg:gap-2'
                )}
              >
                <Link href="https://twitter.com/session_app">
                  <a
                    className={socialLinkClasses}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterSVG className={svgClasses} />
                  </a>
                </Link>
                <Link href="https://mastodon.social/@session">
                  <a
                    className={classNames(socialLinkClasses, '')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MastodonSVG
                      className={classNames(
                        svgClasses,
                        'border-primary border-2.5 rounded-full py-1',
                        'hover:border-white duration-300'
                      )}
                    />
                  </a>
                </Link>
                <Link href="https://www.instagram.com/getsession">
                  <a
                    className={socialLinkClasses}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramSVG className={svgClasses} />
                  </a>
                </Link>
                <Link href="https://www.youtube.com/@SessionTV">
                  <a
                    className={socialLinkClasses}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <YouTubeSVG className={svgClasses} />
                  </a>
                </Link>
                <Link href="https://github.com/session-foundation">
                  <a
                    className={socialLinkClasses}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubSVG className={svgClasses} />
                  </a>
                </Link>
                <Link href="/feed">
                  <a className={socialLinkClasses} target="_self">
                    <RssSVG className={svgClasses} />
                  </a>
                </Link>
              </div>
            </div>
            <div
              className={classNames('flex flex-col w-1/2 mb-4', 'lg:w-full')}
            >
              <h3 className={headingClasses}>Support</h3>
              <a
                href="https://sessionapp.zendesk.com/hc/en-us"
                className={classNames(linkClasses)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Session Support
              </a>
            </div>
          </div>
        </div>
        <div
          className={classNames(
            'py-6 px-8',
            'md:p-10 md:w-full md:max-w-3xl',
            'lg:pt-12 lg:pb-7 lg:px-7 lg:mb-2 lg:w-1/2'
          )}
        >
          <div
            className={classNames(
              'relative w-32',
              'md:w-36',
              'lg:w-32',
              'xl:w-40'
            )}
          >
            <Image
              src="/assets/images/logo-white.png"
              alt="session logo"
              width="120px"
              height="26px"
              layout="responsive"
            />
          </div>
          <p
            className={classNames(
              'group text-white text-sm leading-6 tracking-wide pt-3',
              'md:pt-4',
              'xl:text-base xl:leading-relaxed',
              '2xl:leading-loose'
            )}
          >
            Session is an <span className={redactedClasses}>end-to-end</span>{' '}
            encrypted messenger that protects your{' '}
            <span className={redactedClasses}>personal</span> data. Take back
            control with a messaging app designed, built, and operated by a{' '}
            <span className={redactedClasses}>global</span> community of{' '}
            <span className={redactedClasses}>privacy</span> experts.
          </p>
        </div>
      </footer>
    </div>
  );
}
