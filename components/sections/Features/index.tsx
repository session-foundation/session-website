import Container from '@/components/Container';
import { Headline } from '@/components/ui';
import Image from 'next/image';
import { ReactElement } from 'react';
import classNames from 'classnames';
import { useScreen } from '@/contexts/screen';

export default function Features(): ReactElement {
  const headingClasses = classNames(
    'font-helvetica text-3xl font-bold text-gray-dark mb-1',
    'md:text-4xl'
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
          large: '100%',
          huge: '100%',
          enormous: '100%',
        }}
      >
        <div
          className={classNames(
            'flex flex-col-reverse mx-auto',
            'lg:flex-row lg:justify-between lg:items-center lg:mt-24',
            'xl:mt-16',
            '2xl:mt-32',
            '3xl:mt-64'
          )}
        >
          <div
            className={classNames(
              'px-3 pt-8',
              'md:max-w-xl md:pt-16',
              'lg:max-w-sm lg:px-0 lg:pt-8',
              'xl:pt-0 xl:max-w-md'
            )}
          >
            <h3
              className={classNames(
                headingClasses,
                'pb-8',
                'lg:-mr-24',
                'xl:pb-12'
              )}
            >
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
          <div
            className={classNames(
              'w-full my-4',
              'md:max-w-lg',
              'xl:max-w-xl xl:-mr-8',
              '2xl:max-w-2xl 2xl:-mr-48 2xl:-mt-16'
            )}
          >
            <Image
              src="/assets/images/mockup-desktop.png"
              alt="session desktop running on a macbook pro"
              width="1130px"
              height="1000px"
              layout="responsive"
              loading="eager"
              priority={true}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
