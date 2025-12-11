/* eslint-disable @next/next/no-html-link-for-pages */
import classNames from 'classnames';
import type { GetStaticProps, GetStaticPropsContext } from 'next';
import Image from 'next/legacy/image';
import Link from 'next/link';
import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { forwardRef, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import Container from '@/components/Container';
import { SanityCryptoAddressDisplay } from '@/components/copied/CryptoAddressDisplay';
import Button from '@/components/ui/Button';
import Headline from '@/components/ui/Headline';
import Layout from '@/components/ui/Layout';
import { NON_LOCALIZED_STRING } from '@/constants/localization';
import METADATA from '@/constants/metadata';

function DonateImage({ src, className }: { src: string; className?: string }) {
  return (
    <div className="my-8 w-full md:my-10">
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

function DonorBox() {
  return (
    <iframe
      allow="payment"
      // @ts-expect-error -- Custom required donorbox property
      allowpaymentrequest="allowpaymentrequest"
      frameBorder="0"
      name="donorbox"
      scrolling="no"
      seamless
      src="https://donorbox.org/embed/session-technology-foundation-donations"
      className="mx-auto sm:min-w-[350px] md:min-w-[420px]"
      width="max-content"
      height="max-content"
    />
  );
}

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc?: string;
  hideHeadline?: boolean;
  paragraphClassName?: string;
  section: '1' | '2' | '3' | '4' | '5';
}

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ imageSrc, section, hideHeadline, children, paragraphClassName, className, ...props }, ref) => {
    const t = useTranslations('donate');

    const variant = variantFromNumber(Number.parseInt(section));

    return (
      <section
        {...props}
        className={classNames(sectionVariants[variant].section, 'w-screen', className)}
        ref={ref}
      >
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
              'group mt-8 mb-20 font-light text-lg leading-9',
              'md:mt-0 md:mb-20 md:max-w-xl md:text-2xl md:leading-9',
              'lg:max-w-3xl lg:text-3xl lg:leading-9',
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
);

function HeroContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Container
      heights={{
        small: '100%',
        medium: '100%',
        large: '100%',
      }}
      classes={classNames(
        'flex flex-col justify-start items-start',
        'lg:items-start',
        '2xl:justify-start',
        'relative',
        className
      )}
    >
      {children}{' '}
    </Container>
  );
}

export default function Donate(): ReactElement {
  const t = useTranslations('donate');

  return (
    <Layout localeKey="donate" metadata={METADATA.DOWNLOAD_PAGE}>
      <div className="wrap flex w-screen flex-row flex-wrap pb-10 md:pb-28">
        <HeroContainer className="md:mb-4 lg:mt-16 2xl:mx-0 2xl:mt-16 2xl:ml-auto 2xl:max-w-5xl 2xl:pb-0 2xl:pl-[180px]">
          <DonateImage src="/assets/images/donate-hero.png" className="rounded-xl" />
          <h2 className="pb-5 font-semibold text-5xl xl:text-6xl">
            {t('heading', { appName: NON_LOCALIZED_STRING.appName })}
          </h2>
          <Link href="#app">
            <Button
              size="large"
              fontWeight="semibold"
              shape="semiround"
              classes="text-2xl my-4 md:my-6 py-4 px-6"
            >
              {t('button')}
            </Button>
          </Link>
        </HeroContainer>
        <div className="sticky top-10 mt-16 mr-auto hidden pt-10 2xl:block">
          <Script
            src="https://donorbox.org/widget.js"
            // @ts-expect-error -- Custom required donorbox property
            paypalExpress="false"
          />
          <DonorBox />
        </div>
        <div className="w-screen pb-16">
          <HeroContainer className="md:px-12 md:py-0">
            <p
              className={classNames(
                'group mb-20 font-light text-lg leading-8',
                'md:mt-0 md:mb-20 md:max-w-xl md:text-2xl md:leading-9',
                'lg:max-w-3xl lg:text-3xl lg:leading-relaxed',
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
          </HeroContainer>
        </div>
        <Section section="1" imageSrc="/assets/images/donate-freedom.png" />
        <Section section="2" imageSrc="/assets/images/donate-hands-holding.png" />
        <Section
          section="3"
          imageSrc="/assets/images/donate-hands.png"
          paragraphClassName="mb-0 md:mb-0 lg:mb-0 xl:mb-0 2xl:mb-0 3xl:mb-0"
        />
      </div>
      <Section
        section="4"
        id="app"
        paragraphClassName="w-full md:w-max"
        className="min-h-[1150px] max-w-screen"
      >
        <DonorBox />
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
