/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, useEffect, useRef, useState } from 'react';

import Container from '@/components/Container';
import { Headline } from '@/components/ui';
import classNames from 'classnames';
// import dynamic from 'next/dynamic';
import redact from '@/utils/redact';
import { useScreen } from '@/contexts/screen';

// optimise build sizes by loading dynamically
// const DynamicVideoPlayer = dynamic(() => import('@/components/VideoPlayer'));

export default function About(): ReactElement {
  const textRef = useRef<HTMLDivElement>(null);
  const { isSmall, isMedium } = useScreen();
  const redactedOptions = {
    redactColor: 'primary',
    textColor: 'white',
    animate: true,
    classes: 'p-1',
  };
  const [redactedClasses, setRedactedClasses] = useState(
    redact(redactedOptions)
  );
  // const videoProps: VideoPlayerProps = {
  //   hasQualityLevels: true,
  //   shape: 'square',
  //   poster: '/assets/videos/this-is-session/thumbnail.webp',
  //   sources: [
  //     {
  //       src: '/assets/videos/this-is-session/1080p.mp4',
  //       type: 'video/mp4',
  //       label: '1080p',
  //     },
  //     {
  //       src: '/assets/videos/this-is-session/720p.mp4',
  //       type: 'video/mp4',
  //       label: '720p',
  //       selected: true,
  //     },
  //     {
  //       src: '/assets/videos/this-is-session/480p.mp4',
  //       type: 'video/mp4',
  //       label: '480p',
  //     },
  //     {
  //       src: '/assets/videos/this-is-session/360p.mp4',
  //       type: 'video/mp4',
  //       label: '360p',
  //     },
  //     {
  //       src: '/assets/videos/this-is-session/240p.mp4',
  //       type: 'video/mp4',
  //       label: '240p',
  //     },
  //     {
  //       src: '/assets/videos/this-is-session/144p.mp4',
  //       type: 'video/mp4',
  //       label: '144p',
  //     },
  //   ],
  // };

  useEffect(() => {
    if (isSmall || isMedium) {
      const onScroll = () => {
        const scrollEffectStart =
          textRef.current?.offsetTop! - textRef.current?.scrollHeight! - 28;
        const scrollEffectStop = textRef.current?.offsetTop! - 28;

        if (
          window.scrollY >= scrollEffectStart &&
          window.scrollY < scrollEffectStop
        ) {
          setRedactedClasses(redact({ ...redactedOptions, disabled: true }));
        }
        if (
          window.scrollY < scrollEffectStart ||
          window.scrollY >= scrollEffectStop
        ) {
          setRedactedClasses(redact(redactedOptions));
        }
      };
      document.addEventListener('scroll', onScroll);
      return () => {
        document.removeEventListener('scroll', onScroll);
      };
    }
  }, [isSmall, isMedium]);
  return (
    <section className="text-white bg-gray-dark">
      <Headline
        classes={classNames('text-lg font-bold pt-16', 'lg:pt-20')}
        containerWidths={{
          small: '10rem',
          medium: '34rem',
          large: '67rem',
        }}
      >
        <h2>What is Session?</h2>
      </Headline>
      <Container
        heights={{
          small: '100%',
          medium: '100%',
          large: '100%',
        }}
        classes={classNames(
          'flex flex-col justify-start items-start',
          'lg:items-start lg:mt-16 lg:pb-16',
          'xl:mt-16',
          '2xl:mt-0 2xl:justify-start',
          '3xl:-mt-8  3xl:pb-24'
        )}
      >
        <p
          className={classNames(
            'group text-white text-lg font-light leading-10 mt-8 mb-20',
            'md:text-3xl md:leading-relaxed md:mt-0 md:mb-20 md:max-w-xl',
            'lg:text-4xl lg:max-w-3xl lg:leading-relaxed',
            'xl:mb-8',
            '2xl:mb-20 2xl:max-w-3xl 2xl:mt-24',
            '3xl:mb-16 3xl:max-w-3xl 3xl:mt-40'
          )}
          ref={textRef}
        >
          Session is an <span className={redactedClasses}>end-to-end</span>{' '}
          encrypted messenger that protects your{' '}
          <span className={redactedClasses}>personal</span> data. Take back
          control with a messaging app designed, built, and operated by a{' '}
          <span className={redactedClasses}>global</span> community of{' '}
          <span className={redactedClasses}>privacy</span> experts.
        </p>
        {/* <DynamicVideoPlayer {...videoProps} /> */}
      </Container>
    </section>
  );
}
