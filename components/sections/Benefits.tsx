import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import Container from '@/components/Container';
import BenefitsCard from '@/components/cards/BenefitsCard';
import Headline from '@/components/ui/Headline';

export default function Benefits(): ReactElement {
  const t = useTranslations('landing.benefits');
  const cardClasses = classNames('w-full mb-5');
  const imageWidth = 500;
  const imageHeight = 500;
  return (
    <section className={'bg-primary text-gray-dark'}>
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
        // NOTE max-w-6xl is the global container's max width
        classes={classNames('px-4 lg:max-w-none', '2xl:max-w-6xl')}
      >
        <div
          className={classNames(
            'mx-auto mt-4 grid grid-cols-2 gap-4',
            'md:gap-x-8',
            'lg:mt-16 lg:grid-cols-3 lg:gap-y-28',
            'xl:mt-20',
            '2xl:mt-24',
            '3xl:mt-32'
          )}
        >
          <BenefitsCard
            itemNumber="1"
            images={['/assets/svgs/no-phone.svg', '/assets/svgs/no-phone-redacted.svg']}
            imageAlt="crossed out telephone"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={cardClasses}
          />
          <BenefitsCard
            itemNumber="2"
            images={['/assets/svgs/no-data.svg', '/assets/svgs/no-data-redacted.svg']}
            imageAlt="restricted lock"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={cardClasses}
          />
          <BenefitsCard
            itemNumber="3"
            images={['/assets/svgs/safe-paths.svg', '/assets/svgs/safe-paths-grey.svg']}
            imageAlt="a node based path"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={cardClasses}
          />
          <BenefitsCard
            itemNumber="4"
            images={['/assets/svgs/open-source.svg', '/assets/svgs/open-source-redacted.svg']}
            imageAlt="open source logo"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={cardClasses}
          />
          <BenefitsCard
            itemNumber="5"
            images={['/assets/svgs/people-powered.svg', '/assets/svgs/people-powered-grey.svg']}
            imageAlt="silenced person"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={cardClasses}
          />
          <BenefitsCard
            itemNumber="6"
            images={['/assets/svgs/no-trackers.svg', '/assets/svgs/no-trackers-grey.svg']}
            imageAlt="silenced person"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={cardClasses}
          />
        </div>
      </Container>
    </section>
  );
}
