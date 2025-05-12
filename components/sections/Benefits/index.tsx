import { BenefitsCard } from '@/components/cards';
import Container from '@/components/Container';
import { Headline } from '@/components/ui';
import { ReactElement } from 'react';
import classNames from 'classnames';

export default function Benefits(): ReactElement {
  const cardClasses = classNames('w-full mb-5');
  const imageWidth = '500px';
  const imageHeight = '500px';
  return (
    <section className={'text-gray-dark bg-primary'}>
      <Headline
        color="gray-dark"
        classes={classNames('text-lg font-bold pt-16', 'lg:pt-20')}
        containerWidths={{
          small: '10rem',
          medium: '34rem',
          large: '67rem',
        }}
      >
        <h2>Benefits</h2>
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
            'grid grid-cols-2 mx-auto gap-4 mt-4',
            'md:gap-x-8',
            'lg:grid-cols-3 lg:mt-16',
            'xl:mt-20',
            '2xl:mt-24',
            '3xl:mt-32'
          )}
        >
          <BenefitsCard
            title="No Phone Numbers"
            description={[
              "Protect your identity with Session's Account IDs.",
              'No phone number or email required to sign up.',
            ]}
            images={[
              '/assets/svgs/no-phone.svg',
              '/assets/svgs/no-phone-redacted.svg',
            ]}
            imageAlt="crossed out telephone"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={classNames(cardClasses, 'lg:mb-32')}
          />
          <BenefitsCard
            title="No Data Breaches"
            description={[
              'Session doesn’t collect data,',
              'so there’s nothing to leak.',
            ]}
            images={[
              '/assets/svgs/no-data.svg',
              '/assets/svgs/no-data-redacted.svg',
            ]}
            imageAlt="restricted lock"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={classNames(cardClasses, 'lg:mb-32')}
          />
          <BenefitsCard
            title="Safe Paths"
            description={[
              'Onion-routed paths protect your conversations ',
              'from hackers and eavesdroppers.',
            ]}
            images={[
              '/assets/svgs/safe-paths.svg',
              '/assets/svgs/safe-paths-grey.svg',
            ]}
            imageAlt="a node based path"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={classNames(cardClasses, 'lg:mb-32')}
          />
          <BenefitsCard
            title="Open Source"
            description={[
              'Session’s code has nothing to hide. Anyone can',
              'view, audit, and contribute.',
            ]}
            images={[
              '/assets/svgs/open-source.svg',
              '/assets/svgs/open-source-redacted.svg',
            ]}
            imageAlt="open source logo"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={classNames(cardClasses, 'lg:mb-24')}
          />
          <BenefitsCard
            title="People Powered"
            description={[
              'Thousands of nodes run by a global community.',
              'Session is by the people, for the people.',
            ]}
            images={[
              '/assets/svgs/people-powered.svg',
              '/assets/svgs/people-powered-grey.svg',
            ]}
            imageAlt="silenced person"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={classNames(cardClasses, 'lg:mb-24')}
          />
          <BenefitsCard
            title="No Trackers"
            description={[
              'Your data is never collected, never tracked, and',
              'never sold to third parties.',
            ]}
            images={[
              '/assets/svgs/no-trackers.svg',
              '/assets/svgs/no-trackers-grey.svg',
            ]}
            imageAlt="silenced person"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            classes={classNames(cardClasses, 'lg:mb-24')}
          />
        </div>
      </Container>
    </section>
  );
}
