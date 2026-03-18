/* eslint-disable @next/next/no-html-link-for-pages */
import classNames from 'classnames';
import type { GetStaticProps, GetStaticPropsContext } from 'next';
import Image from 'next/legacy/image';
import Link from 'next/link';
import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import Container from '@/components/Container';
import { SanityCryptoAddressDisplay } from '@/components/copied/CryptoAddressDisplay';
import Button from '@/components/ui/Button';
import Headline from '@/components/ui/Headline';
import Layout from '@/components/ui/Layout';
import { appUserNumber, localeArgs, NON_LOCALIZED_STRING } from '@/constants/localization';
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
const DONORBOX_SCRIPT_URL = 'https://donorbox.org/widgets.js';
const DONORBOX_SCRIPT_ID = 'donorbox-widget-script';
const DONORBOX_CAMPAIGN = 'session-technology-foundation-donations';

export function DonorBox({ showDonateCrypto }: { showDonateCrypto?: boolean }) {
  const t = useTranslations('donate');
  useEffect(() => {
    // Check if already loaded by id, src, or registered custom element
    const alreadyLoaded =
      document.getElementById(DONORBOX_SCRIPT_ID) ||
      document.querySelector(`script[src="${DONORBOX_SCRIPT_URL}"]`) ||
      customElements.get('dbox-widget');

    if (alreadyLoaded) return;

    const script = document.createElement('script');
    script.src = DONORBOX_SCRIPT_URL;
    script.id = DONORBOX_SCRIPT_ID;
    script.type = 'module';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Only remove if this instance added it
      const el = document.getElementById(DONORBOX_SCRIPT_ID);
      if (el) document.head.removeChild(el);
    };
  }, []);

  return (
    <div
      className="sm:min-w-[350px] md:min-w-[420px]"
    >
      <div
        dangerouslySetInnerHTML={{
          __html: `<dbox-widget 
          campaign="${DONORBOX_CAMPAIGN}" 
          type="donation_form"
          interval="1 T" 
          enable-auto-scroll="true">
        </dbox-widget>`
        }}
      />
      {showDonateCrypto ? <Link href="#crypto">
        <Button
          size="medium"
          shape="semiround"
          classes="text-xl w-full mt-8 mb-2 py-3"
        >
          {t('buttonCrypto')}
        </Button>
      </Link> : null}
    </div>
  );

}

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc?: string;
  hideHeadline?: boolean;
  paragraphClassName?: string;
  containerClassName?: string;
  section: '1' | '2' | '3' | '4' | '5';
}

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ imageSrc, section, hideHeadline, children, paragraphClassName, containerClassName, className, ...props }, ref) => {
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
            '3xl:-mt-8 3xl:pb-24',
            containerClassName
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

function FloatingButtons() {
  const [hideFloatingButtons, setHideFloatingButtons] = useState(false)
  const [pastCrypto, setPastCrypto] = useState(false)
  const t = useTranslations('donate');

  useEffect(() => {
    const cryptoSection = document.getElementById('crypto');
    if (!cryptoSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setPastCrypto(true);
        } else {
          setPastCrypto(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(cryptoSection);
    return () => observer.disconnect();
  }, []);

  if (hideFloatingButtons || pastCrypto) return null;
  return !hideFloatingButtons ? <div className='fixed w-screen px-6 py-6 z-[9999999] bg-white md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4'
    style={{
      boxShadow: '0 -1px 15.3px 0 rgba(0, 0, 0, 0.14)',
      top: '100dvh',
      transform: 'translateY(-100%)',
    }}>
    <Link href="#card" className='w-full'>
      <Button
        size="medium"
        shape="semiround"
        classes="w-full py-4 px-0 no-wrap whitespace-nowrap"
      >
        {t('buttonCard')}
      </Button>
    </Link>
    <Link href="#crypto" className='w-full'>
      <Button
        size="medium"
        shape="semiround"
        classes="w-full py-4 px-0 no-wrap whitespace-nowrap"
      >
        {t('buttonCrypto')}
      </Button>
    </Link>
    <Button classes='absolute -top-1 -right-1 px-0 py-0 h-3 w-3' size="medium" shape="round" bgColor='none' textColor='black' onClick={() => setHideFloatingButtons(true)}>x</Button>
  </div> : null
}

export default function Donate(): ReactElement {
  const t = useTranslations('donate');

  return (
    <Layout localeKey="donate" metadata={METADATA.DOWNLOAD_PAGE} showBanner={false} hideCommunityNotice={true}>
      <div className="wrap flex w-screen flex-row flex-wrap pb-10 md:pb-28">
        <HeroContainer className="md:mb-4 lg:mt-16 2xl:mx-0 2xl:mt-16 2xl:ml-auto 2xl:max-w-5xl 2xl:pb-0 2xl:pl-[180px]">
          <div className="my-8 w-full md:my-10">
            <Image
              priority={true}
              className="rounded-xl"
              src="/assets/images/chris.jpg"
              alt=""
              width={4032}
              height={2268}
              quality={100}
              layout="responsive"
              sizes="(max-width: 4032px) 100vw, 500px"
            />
          </div>
          <h2 className="pb-5 font-semibold text-4xl xl:text-5xl">
            {t('appealheading', localeArgs)}
          </h2>
          <p
            className={classNames(
              'group text-lg leading-normal',
              'md:mt-0 md:text-2xl',
              'lg:text-xl',
              'pt-4 text-left md:text-justify'
            )}
          >
            {t.rich('heroAppeal', {
              ...localeArgs,
              appUserNumber: new Intl.NumberFormat().format(appUserNumber),
              br: () => <br />,
              italic: (chunks) => <i>{chunks}</i>,
            })}
          </p>
          <div className="w-72">
            <Image
              priority={true}
              src="/assets/images/chris-signature.png"
              alt=""
              width={453}
              height={187}
              quality={100}
              layout="responsive"
              sizes="(max-width: 453px) 100vw, 500px"
            />
          </div>
        </HeroContainer>
        <div className="sticky top-10 mt-16 mr-auto hidden pt-10 2xl:block">
          <DonorBox showDonateCrypto={true} />
        </div>
      </div>
      <Section
        section="4"
        id="card"
        paragraphClassName="md:w-max"
        className="min-h-[1150px] max-w-screen"
        containerClassName="p-0 items-center"
      >
        <DonorBox />
      </Section>
      <Section section="5" id="crypto">
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
      <FloatingButtons />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: { messages: (await import(`../locales/${context.locale}.json`)).default },
  };
};
