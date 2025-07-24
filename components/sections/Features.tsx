import classNames from 'classnames';
import Image from 'next/legacy/image';
import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import Container from '@/components/Container';
import Headline from '@/components/ui/Headline';

const headingClasses = classNames(
  'font-helvetica text-3xl font-bold text-gray-dark mb-1',
  'md:text-4xl'
);

const paragraphClasses = classNames('text-gray-lighter leading-6 mb-8', 'md:mb-12');

type FeatureSectionProps = {
  itemNumber: '1' | '2' | '3';
};

function FeatureSection({ itemNumber }: FeatureSectionProps) {
  const t = useTranslations('landing.features');
  const tFeature = useTranslations('feature');
  return (
    <>
      <h3 className={headingClasses}>{t(`${itemNumber}.heading` as const)}</h3>
      <p className={paragraphClasses}>
        {t(`${itemNumber}.content` as const, {
          featureGroup: tFeature('group'),
          featureCommunity: tFeature('community'),
        })}
      </p>
    </>
  );
}

export default function Features(): ReactElement {
  const t = useTranslations('landing.features');
  const tImage = useTranslations('imageAlt');

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
        <h2>{t('title')}</h2>
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
            'mx-auto flex flex-col-reverse',
            'lg:mt-24 lg:flex-row lg:items-center lg:justify-between',
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
              'xl:max-w-md xl:pt-0'
            )}
          >
            <h3 className={classNames(headingClasses, 'pb-8', 'lg:-mr-24', 'xl:pb-12')}>
              {t('heading')}
            </h3>
            <FeatureSection itemNumber="1" />
            <FeatureSection itemNumber="2" />
            <FeatureSection itemNumber="3" />
          </div>
          <div
            className={classNames(
              'my-4 w-full',
              'md:max-w-lg',
              'xl:-mr-8 xl:max-w-xl',
              '2xl:-mr-48 2xl:-mt-16 2xl:max-w-2xl'
            )}
          >
            <Image
              src="/assets/images/encrypted-messaging-app-desktop.png"
              alt={tImage('appLaptop')}
              width={1130}
              height={1000}
              quality={100}
              layout="responsive"
              sizes="(max-width: 1023px) 100vw, 500px"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
