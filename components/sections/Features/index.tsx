import Container from '@/components/Container';
import { Headline } from '@/components/ui';
import Image from 'next/image';
import { ReactElement } from 'react';
import classNames from 'classnames';
import { useScreen } from '@/contexts/screen';

export default function Features(): ReactElement {
  const { isSmall, isMedium, isLarge, isHuge, isEnormous } = useScreen();
  const headingClasses = classNames(
    'font-helvetica text-4xl font-bold text-gray-dark mb-1'
  );
  const paragraphClasses = classNames(
    'text-gray-lighter leading-6 mb-8',
    'md:mb-12'
  );
  return (
    <section className={classNames('text-gray-dark')}>
      <Headline
        color="gray-dark"
        classes={classNames('text-lg font-bold pt-16', 'lg:pt-20')}
        containerWidths={{
          small: '10rem',
          medium: '34rem',
          large: '67rem',
        }}
      >
        <h2>Features</h2>
      </Headline>
      <Container
        hasMinHeight={true}
        heights={{
          small: '100%',
          medium: '100%',
          large: '100vh - 12rem',
          huge: '100vh - 84px',
          enormous: '100vh - 84px',
        }}
        classes={classNames(
          '2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center'
        )}
      >
        <div
          className={classNames(
            'lg:mx-auto lg:flex lg:justify-between lg:items-center lg:mt-24',
            '2xl:mt-12 2xl:w-full',
            '3xl:-mt-16'
          )}
        >
          {(isSmall || isMedium) && (
            <div
              className={classNames('-mt-4 -ml-1 mb-12', 'md:mb-16 md:px-20')}
            >
              <Image
                src="/assets/images/ui-direct-message.png"
                alt="mobile app direct message screenshot"
                width="1148px"
                height="2000px"
                layout="responsive"
                priority={true}
                loading="eager"
              />
            </div>
          )}
          <div
            className={classNames(
              'px-3',
              'md:max-w-xl',
              'lg:max-w-sm lg:px-0 lg:-mt-8 lg:mr-8',
              '2xl:mt-0'
            )}
          >
            <h3 className={classNames(headingClasses, 'pb-8')}>
              Enjoy the features you love and the security you need.
            </h3>
            <h3 className={headingClasses}>Speak freely</h3>
            <p className={paragraphClasses}>
              Only you and the person you are speaking to can ever see your
              messages. Enjoy the feeling of freedom with end-to-end encryption
              and disappearing messages.
            </p>
            <h3 className={headingClasses}>Stay in control</h3>
            <p className={paragraphClasses}>
              You are in control of your messages from start to finish. Whether
              it&rsquo;s managing your own encryption keys or choosing a custom
              theme—Session puts you in charge.
            </p>
            <h3 className={headingClasses}>Keep up with your crowd</h3>
            <p className={paragraphClasses}>
              Whether you&rsquo;re catching up with close friends or organizing
              a major event, it&rsquo;s effortless with secure Group and
              Community (100+ members) chats.
            </p>
          </div>
          {(isLarge || isHuge || isEnormous) && (
            <div
              className={classNames(
                'w-full -mt-12',
                'xl:ml-8 xl:-mr-8',
                '3xl:-mr-16'
              )}
            >
              <Image
                src="/assets/images/mockup-desktop.png"
                alt="desktop app screenshot"
                width="2477px"
                height="3000px"
                layout="responsive"
                loading="eager"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
