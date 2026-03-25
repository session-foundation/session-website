/* eslint-disable @next/next/no-html-link-for-pages */
import classNames from 'classnames';
import type { GetStaticProps, GetStaticPropsContext } from 'next';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  forwardRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import Container from '@/components/Container';
import { BankIcon } from '@/components/copied/BankIcon';
import { BitcoinIcon } from '@/components/copied/BitcoinIcon';
import { SanityCryptoAddressDisplay } from '@/components/copied/CryptoAddressDisplay';
import { EthIcon } from '@/components/copied/EthIcon';
import { MoneroIcon } from '@/components/copied/MoneroIcon';
import { USDCIcon } from '@/components/copied/USDCIcon';
import { LucideIcon } from '@/components/LucideIconWrapper';
import Button from '@/components/ui/Button';
import { Collapsible } from '@/components/ui/collapsible';
import Headline from '@/components/ui/Headline';
import Layout from '@/components/ui/Layout';
import {
  appUserNumber,
  localeArgs,
  NON_LOCALIZED_STRING,
  SILENT_DONOR_LEGAL_DISCLAIMER,
} from '@/constants/localization';
import METADATA from '@/constants/metadata';
import { LUCIDE_ICONS_UNICODE } from '@/lib/lucide';
import {
  StyledCollapsibleContent,
  StyledCollapsibleTrigger,
  StyledRoundedPanelButtonGroup,
} from './pro';

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
    section: 'bg-primary text-gray-dark selection:bg-black selection:text-primary',
    headlineColor: 'gray-dark',
  },
  [SectionVariant.WHITE]: {
    section: 'bg-white text-gray-dark',
    headlineColor: 'gray-dark',
  },
} as const;

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
    <div className="sm:min-w-[350px] md:min-w-[420px]">
      <div
        dangerouslySetInnerHTML={{
          __html: `<dbox-widget 
          campaign="${DONORBOX_CAMPAIGN}" 
          type="donation_form"
          interval="1 T" 
          enable-auto-scroll="true">
        </dbox-widget>`,
        }}
      />
      {showDonateCrypto ? (
        <a href="#crypto">
          <Button size="medium" shape="semiround" classes="text-xl w-full mt-8 mb-2 py-3">
            {t('buttonCrypto')}
          </Button>
        </a>
      ) : null}
    </div>
  );
}

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc?: string;
  hideHeadline?: boolean;
  paragraphClassName?: string;
  containerClassName?: string;
  localeKey: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  styleVariant: SectionVariant;
}

const cryptoIconClassName = 'h-6 w-6 md:w-7 md:h-7 -mr-1.5 md:-mr-2';

const Section = forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      imageSrc,
      localeKey,
      styleVariant,
      hideHeadline,
      children,
      paragraphClassName,
      containerClassName,
      className,
      ...props
    },
    ref
  ) => {
    const t = useTranslations('donate');

    return (
      <section
        {...props}
        className={classNames(sectionVariants[styleVariant].section, 'w-screen', className)}
        ref={ref}
      >
        {!hideHeadline ? (
          <Headline
            classes={classNames('text-lg font-bold pt-16', 'lg:pt-20')}
            color={sectionVariants[styleVariant].headlineColor}
            containerWidths={{
              small: '10rem',
              medium: '34rem',
              large: '67rem',
            }}
          >
            <h2>{t(`${localeKey}.heading`, { ...NON_LOCALIZED_STRING })}</h2>
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
            {t.rich(`${localeKey}.content`, {
              ...NON_LOCALIZED_STRING,
              br: () => <br />,
              image: () => (imageSrc ? <DonateImage src={imageSrc} /> : null),
              'contact-email': () => (
                <Link className="text-primary-dark" href="mailto:contact@session.foundation">
                  contact@session.foundation
                </Link>
              ),
              'validation-url': () => <strong>https://getsession.org</strong>,
              'silent-donor-link': (chunks) => (
                <Link
                  href="https://www.silentdonor.com/donate-now-session-technology-foundation/"
                  target="_blank"
                  className="whitespace-nowrap underline"
                >
                  {chunks}
                </Link>
              ),
              'crypto-icons': (chunks) => (
                <div className="inline-flex flex-nowrap items-center whitespace-nowrap">
                  {chunks}
                  <MoneroIcon
                    style={{ zIndex: 6 }}
                    className={classNames(
                      cryptoIconClassName,
                      'ml-1 rounded-full bg-white md:ml-1.5'
                    )}
                  />
                  <BitcoinIcon style={{ zIndex: 5 }} className={cryptoIconClassName} />
                  <EthIcon style={{ zIndex: 4 }} className={cryptoIconClassName} />
                  <USDCIcon style={{ zIndex: 3 }} className={cryptoIconClassName} />
                  <BankIcon style={{ zIndex: 2 }} className={cryptoIconClassName} />
                </div>
              ),
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
  const [hideFloatingButtons, setHideFloatingButtons] = useState(false);
  const [pastCrypto, setPastCrypto] = useState(false);
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

  return (
    <div
      className="fixed z-[9999999] grid w-screen grid-cols-1 gap-4 bg-white px-6 py-6 transition-transform duration-300 ease-in-out sm:grid-cols-2 md:hidden"
      style={{
        boxShadow: '0 -1px 15.3px 0 rgba(0, 0, 0, 0.14)',
        bottom: '0dvh',
        transform: pastCrypto || hideFloatingButtons ? 'translateY(100%)' : 'translateY(0%)',
      }}
    >
      <a href="#card" className="w-full">
        <Button
          size="medium"
          shape="semiround"
          classes="w-full py-4 px-0 no-wrap whitespace-nowrap"
        >
          {t('buttonCard')}
        </Button>
      </a>
      <a href="#crypto" className="w-full">
        <Button
          size="medium"
          shape="semiround"
          classes="w-full py-4 px-0 no-wrap whitespace-nowrap"
        >
          {t('buttonCrypto')}
        </Button>
      </a>
      <Button
        classes="absolute top-1 -right-1 px-0 py-0 h-3 w-3"
        size="medium"
        shape="round"
        bgColor="none"
        textColor="black"
        onClick={() => setHideFloatingButtons(true)}
      >
        <LucideIcon unicode={LUCIDE_ICONS_UNICODE.X} iconSize="small" />
      </Button>
    </div>
  );
}

export const TaxAnswer = () => (
  <>
    Donations made to the Session Technology Foundation via Silent Donor are directed to the AnonDo
    Fund, a U.S.-registered 501(c)(3) donor-advised fund. For both international and U.S.-based
    donors, this structure may allow contributions to be considered tax-deductible depending on
    local laws. More information about making a tax-deductible donation is available on the Silent
    Donor{' '}
    <a
      href="https://www.silentdonor.com/donate-now-session-technology-foundation/"
      className="text-primary-dark"
    >
      website
    </a>
    .
  </>
);

export const SilentDonorPaymentDescription = () => (
  <>
    <a
      href="https://www.silentdonor.com/donate-now-session-technology-foundation/"
      className="text-primary-dark"
    >
      Silent Donor
    </a>{' '}
    is a third-party service which allows you to give a gift anonymously. Donations are directed
    through The AnonDo Fund, a U.S.-registered 501(c)(3) donor-advised fund approved as a non-profit
    by the Internal Revenue Service, before being transferred to the Session Technology Foundation.
  </>
);

function FAQItem({ localeKey }: { localeKey: 1 | 2 | 3 | 4 | 'tax-question' }) {
  const t = useTranslations('donate.faq');

  const question = t(`${localeKey}.question`, localeArgs);
  const answer = t.rich(`${localeKey}.answer`, {
    ...localeArgs,
    br: () => <br />,
    bold: (chunks: ReactNode) => <strong className="font-bold">{chunks}</strong>,
    'payment-providers': () => (
      <ul className="my-4 ml-7">
        <li className="list-disc">Credit Card and Debit Card</li>
        <li className="list-disc">Apple Pay</li>
        <li className="list-disc">Google Pay</li>
        <li className="list-disc">PayPal</li>
        <li className="list-disc">Amazon Pay</li>
        <li className="list-disc">Bank Transfer</li>
        <li className="list-disc">Link</li>
        <li className="list-disc">And more</li>
      </ul>
    ),
    ol: (chunks) => <ol className="mt-4 mb-8 ml-7">{chunks}</ol>,
    li: (chunks) => <li className="list-decimal">{chunks}</li>,
    'donations-email': () => (
      <Link className="text-primary-dark" href="mailto:donations@getsession.org">
        donations@getsession.org
      </Link>
    ),
    'donate-link': (chunks) => (
      <a href="#card" className="text-primary-dark">
        {chunks}
      </a>
    ),
    'foundation-link': (chunks) => (
      <Link href="https://session.foundation" className="text-primary-dark">
        {chunks}
      </Link>
    ),
    'github-link': (chunks) => (
      <Link href="https://github.com/session-foundation/" className="text-primary-dark">
        {chunks}
      </Link>
    ),
    'crowdin-link': (chunks) => (
      <Link href="https://getsession.org/translate" className="text-primary-dark">
        {chunks}
      </Link>
    ),
    'silent-donor-info': () => (
      <>
        <SilentDonorPaymentDescription />
        <br />
        <br />
        Supported donation methods include:
        <ul className="mt-4 mb-8 ml-7">
          <li className="list-disc">Cryptocurrency (XMR, BTC, ETH, and more)</li>
          <li className="list-disc">Credit card</li>
          <li className="list-disc">Bank Transfer</li>
        </ul>
      </>
    ),
  });

  const id = question.toLocaleLowerCase().replaceAll(' ', '-').replaceAll('?', '');

  return (
    <Collapsible className="w-full transition-all duration-300" id={id}>
      <StyledCollapsibleTrigger className="flex w-full flex-row items-center gap-2 bg-[#E8E8E8] px-2 py-2 text-left font-bold leading-0 transition-all duration-300">
        <LucideIcon unicode={LUCIDE_ICONS_UNICODE.PLUS} iconSize="medium" />
        <span className="whitespace-normal leading-0">{question}</span>
        <a href={`#${id}`} style={{ lineHeight: 0 }}>
          <LucideIcon
            unicode={LUCIDE_ICONS_UNICODE.LINK}
            iconSize="medium"
            iconColor="var(--gray-lighter)"
          />
        </a>
      </StyledCollapsibleTrigger>
      <StyledCollapsibleContent className="rounded-b-xl transition-all duration-300">
        <StyledRoundedPanelButtonGroup className="rounded-b-xl px-6 text-left">
          <p className="whitespace-normal break-words">
            {localeKey === 'tax-question' ? <TaxAnswer /> : answer}
          </p>
        </StyledRoundedPanelButtonGroup>
      </StyledCollapsibleContent>
    </Collapsible>
  );
}

function DonateFAQ() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 self-center">
      <div className={'flex w-full items-center justify-center self-center px-4 md:ml-6'}>
        <div className="flex w-full max-w-3xl flex-col gap-3 text-lg">
          <FAQItem localeKey={1} />
          <FAQItem localeKey="tax-question" />
          <FAQItem localeKey={2} />
          <FAQItem localeKey={3} />
          <FAQItem localeKey={4} />
        </div>
      </div>
    </div>
  );
}

export default function Donate(): ReactElement {
  const t = useTranslations('donate');

  return (
    <Layout
      localeKey="donate"
      metadata={METADATA.DONATE_PAGE}
      showBanner={false}
      hideCommunityNotice={true}
    >
      <div className="wrap flex w-screen flex-row flex-wrap pb-10 md:pb-28">
        <HeroContainer className="md:mb-4 lg:mt-16 2xl:mx-0 2xl:mt-16 2xl:ml-auto 2xl:max-w-5xl 2xl:pb-0 2xl:pl-[180px]">
          <div className="mt-4 mb-8 w-full md:mt-8 md:mb-10">
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
          <h2 className="pb-5 font-semibold text-3xl md:text-4xl xl:text-5xl">
            {t('appealHeading', localeArgs)}
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
        localeKey={4}
        styleVariant={SectionVariant.GREEN}
        id="card"
        paragraphClassName="md:w-max"
        className="min-h-[1150px] max-w-screen"
        containerClassName="p-0 items-center"
      >
        <DonorBox />
      </Section>
      <Section localeKey={5} styleVariant={SectionVariant.GRAY} id="crypto">
        <SanityCryptoAddressDisplay
          value={{
            cryptoAddress: {
              name: 'Bitcoin Address',
              address: NON_LOCALIZED_STRING.addressBitcoin,
              icon: 'Bitcoin',
            },
          }}
        />
        <SanityCryptoAddressDisplay
          value={{
            cryptoAddress: {
              name: 'Ethereum Address',
              address: NON_LOCALIZED_STRING.addressEthereum,
              icon: 'Ethereum',
            },
          }}
        />
        <SanityCryptoAddressDisplay
          value={{
            cryptoAddress: {
              name: 'Bitcoin Cash Address',
              address: NON_LOCALIZED_STRING.addressBitcoinCash,
              icon: 'Bitcoin Cash',
            },
          }}
        />
      </Section>
      <Section localeKey={6} styleVariant={SectionVariant.GREEN} id="silent-donor" className="">
        <a
          href="https://www.silentdonor.com/donate-now-session-technology-foundation/"
          target="_blank"
          rel="noopener"
          referrerPolicy="no-referrer"
        >
          <Button
            size="large"
            shape="semiround"
            bgColor="gray"
            textColor="white"
            classes="text-xl md:text-2xl font-bold block my-8 md:py-4"
          >
            {t('6.heading', { ...NON_LOCALIZED_STRING })}
          </Button>
        </a>
        <div id="monero" />
        <div id="xmr" />
        <p className="text-xs italic md:text-base">{SILENT_DONOR_LEGAL_DISCLAIMER}</p>
      </Section>
      <Section
        localeKey={7}
        styleVariant={SectionVariant.WHITE}
        id="faq"
        paragraphClassName="w-full"
        containerClassName="w-full p-0 items-center"
      >
        <DonateFAQ />
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
