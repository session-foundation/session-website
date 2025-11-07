/* eslint-disable @next/next/no-html-link-for-pages */
import classNames from 'classnames';
import type { GetStaticProps, GetStaticPropsContext } from 'next';
import Image from 'next/legacy/image';
import Link from 'next/link';
import Script from 'next/script';
import { useTranslations } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';
import Container from '@/components/Container';
import { SanityCryptoAddressDisplay } from '@/components/copied/CryptoAddressDisplay';
import Headline from '@/components/ui/Headline';
import Layout from '@/components/ui/Layout';
import { NON_LOCALIZED_STRING } from '@/constants/localization';
import METADATA from '@/constants/metadata';

function DonateImage({ src, className }: { src: string; className?: string }) {
  return (
    <div className="my-10 w-full">
      <Image
        className={className}
        src={src}
        alt=""
        width={1280}
        height={750}
        quality={100}
        layout="responsive"
        sizes="(max-width: 1280px) 100vw, 500px"
      />
    </div>
  );
}

enum SectionVariant {
  GREEN,
  GRAY,
  WHITE,
}

const sectionVariants = {
  [SectionVariant.GRAY]: {
    section: 'bg-gray-dark text-white',
    headlineColor: 'primary',
  },
  [SectionVariant.GREEN]: {
    section: 'bg-primary text-gray-dark',
    headlineColor: 'gray-dark',
  },
  [SectionVariant.WHITE]: {
    section: 'bg-white text-gray-dark',
    headlineColor: 'gray-dark',
  },
} as const;

function variantFromNumber(n: number): SectionVariant {
  return (n - 1) % 3;
}

function Section({
  id,
  imageSrc,
  section,
  hideHeadline,
  children,
  paragraphClassName,
}: {
  id?: string;
  imageSrc?: string;
  hideHeadline?: boolean;
  children?: ReactNode;
  paragraphClassName?: string;
  section: '1' | '2' | '3' | '4' | '5';
}) {
  const t = useTranslations('donate');

  const variant = variantFromNumber(Number.parseInt(section));

  return (
    <section id={id} className={sectionVariants[variant].section}>
      {!hideHeadline ? (
        <Headline
          classes={classNames('text-lg font-bold pt-16', 'lg:pt-20')}
          color={sectionVariants[variant].headlineColor}
          containerWidths={{
            small: '10rem',
            medium: '34rem',
            large: '67rem',
          }}
        >
          <h2>{t(`${section}.heading`, { ...NON_LOCALIZED_STRING })}</h2>
        </Headline>
      ) : null}
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
        <div
          className={classNames(
            'group mt-8 mb-20 font-light text-lg leading-10',
            'md:mt-0 md:mb-20 md:max-w-xl md:text-3xl md:leading-relaxed',
            'lg:max-w-3xl lg:text-4xl lg:leading-relaxed',
            'xl:mb-8',
            '2xl:mt-24 2xl:mb-20 2xl:max-w-3xl',
            '3xl:mt-40 3xl:mb-16 3xl:max-w-3xl',
            paragraphClassName
          )}
        >
          {t.rich(`${section}.content`, {
            ...NON_LOCALIZED_STRING,
            br: () => <br />,
            image: () => (imageSrc ? <DonateImage src={imageSrc} /> : null),
            'contact-email': () => (
              <Link className="text-primary-dark" href="mailto:contact@session.foundation">
                contact@session.foundation
              </Link>
            ),
            'validation-url': () => <strong>https://getsession.org</strong>,
          })}
          {children}
        </div>
      </Container>
    </section>
  );
}

export default function Donate(): ReactElement {
  const t = useTranslations('donate');

  return (
    <Layout localeKey="donate" metadata={METADATA.DOWNLOAD_PAGE}>
      <section>
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
            '2xl:justify-start',
            '3xl:pb-24 '
          )}
        >
          <div
            className={classNames(
              'group',
              'md:max-w-xl ',
              'lg:max-w-3xl ',
              '2xl:mt-24 2xl:max-w-3xl',
              '3xl:-mt-8 3xl:max-w-3xl',
              'w-full'
            )}
          >
            <DonateImage src="/assets/images/donate-hero.png" className="rounded-xl" />
            <h2 className="py-6 font-semibold text-5xl">
              {t('heading', { appName: NON_LOCALIZED_STRING.appName })}
            </h2>
          </div>
          <p
            className={classNames(
              'group mt-8 mb-20 font-light text-lg leading-10',
              'md:mt-0 md:mb-20 md:max-w-xl md:text-3xl md:leading-relaxed',
              'lg:max-w-3xl lg:text-4xl lg:leading-relaxed',
              'xl:mb-8',
              '2xl:mb-20 2xl:max-w-3xl',
              '3xl:mb-16 3xl:max-w-3xl',
              'text-gray-dark'
            )}
          >
            {t.rich('heroContent', {
              span: (chunk) => <span>{chunk}</span>,
              appName: NON_LOCALIZED_STRING.appName,
              br: () => <br />,
              image: () => <DonateImage src="/assets/images/donate-family.webp" />,
            })}
          </p>
        </Container>
      </section>
      <Section section="1" imageSrc="/assets/images/donate-freedom.png" />
      <Section section="2" imageSrc="/assets/images/donate-hands-holding.png" />
      <Section section="3" imageSrc="/assets/images/donate-hands.png" />
      <Section section="4" id="app" paragraphClassName="w-full md:w-max">
        <Script
          src="https://donorbox.org/widget.js"
          // @ts-expect-error -- Custom required donorbox property
          paypalExpress="false"
        />
        <iframe
          allow="payment"
          // @ts-expect-error -- Custom required donorbox property
          allowpaymentrequest="allowpaymentrequest"
          frameBorder="0"
          height="900px"
          name="donorbox"
          scrolling="no"
          seamless
          src="https://donorbox.org/embed/session-technology-foundation-donations"
          className="mx-auto border border-session-black sm:min-w-[350px] md:min-w-[420px]"
          width="max-content"
        />
      </Section>
      <Section section="5">
        <SanityCryptoAddressDisplay
          value={{
            cryptoAddress: {
              name: 'Ethereum Address',
              address: '0xec793F400B2c133299ed78f22f5708872555F958',
              icon: 'Ethereum',
            },
          }}
        />
        <SanityCryptoAddressDisplay
          value={{
            cryptoAddress: {
              name: 'Bitcoin Address',
              address: 'bc1qmuyaayx6xdfpvgdu5a0eqgzqrvr5d35f5y6k8w',
              icon: 'Bitcoin',
            },
          }}
        />
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: { messages: (await import(`../locales/${context.locale}.json`)).default },
  };
};
