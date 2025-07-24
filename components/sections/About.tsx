import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { type ReactElement, useEffect, useRef, useState } from 'react';
import Container from '@/components/Container';
import Headline from '@/components/ui/Headline';
import { NON_LOCALIZED_STRING } from '@/constants/localization';
import { useScreen } from '@/contexts/screen';
import redact from '@/utils/redact';

export default function About(): ReactElement {
  const t = useTranslations('landing.about');
  const textRef = useRef<HTMLDivElement>(null);
  const { isSmall, isMedium } = useScreen();
  const redactedOptions = {
    redactColor: 'primary',
    textColor: 'white',
    animate: true,
    classes: 'p-1',
  };
  const [redactedClasses, setRedactedClasses] = useState(redact(redactedOptions));

  useEffect(() => {
    if (isSmall || isMedium) {
      const onScroll = () => {
        const scrollEffectStart =
          (textRef.current?.offsetTop ?? 0) - (textRef.current?.scrollHeight ?? 0) - 28;
        const scrollEffectStop = (textRef.current?.offsetTop ?? 0) - 28;

        if (window.scrollY >= scrollEffectStart && window.scrollY < scrollEffectStop) {
          setRedactedClasses(redact({ ...redactedOptions, disabled: true }));
        }
        if (window.scrollY < scrollEffectStart || window.scrollY >= scrollEffectStop) {
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
    <section className="bg-gray-dark text-white">
      <Headline
        classes={classNames('text-lg font-bold pt-16', 'lg:pt-20')}
        containerWidths={{
          small: '10rem',
          medium: '34rem',
          large: '67rem',
        }}
      >
        <h2>{t('title', { appName: NON_LOCALIZED_STRING.appName })}</h2>
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
            'group mt-8 mb-20 font-light text-lg text-white leading-10',
            'md:mt-0 md:mb-20 md:max-w-xl md:text-3xl md:leading-relaxed',
            'lg:max-w-3xl lg:text-4xl lg:leading-relaxed',
            'xl:mb-8',
            '2xl:mt-24 2xl:mb-20 2xl:max-w-3xl',
            '3xl:mt-40 3xl:mb-16 3xl:max-w-3xl'
          )}
          ref={textRef}
        >
          {t.rich('content', {
            span: (chunk) => <span className={redactedClasses}>{chunk}</span>,
            appName: NON_LOCALIZED_STRING.appName,
          })}
        </p>
      </Container>
    </section>
  );
}
