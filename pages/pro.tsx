/* eslint-disable @next/next/no-html-link-for-pages */

import { TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import classNames from 'classnames';
import type { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useLocale, useTranslations } from 'next-intl';
import { type ReactElement, type ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as AndroidSVG } from '@/assets/svgs/android_robot_head.svg';
import { ReactComponent as AppleSVG } from '@/assets/svgs/apple.svg';
import Container from '@/components/Container';
import { LucideIcon, type SessionIconSize } from '@/components/LucideIconWrapper';
import Layout from '@/components/ui/Layout';
import { Tabs } from '@/components/ui/tabs';
import { NON_LOCALIZED_STRING } from '@/constants/localization';
import METADATA from '@/constants/metadata';
import { isCrowdinLocale, setLocaleInUse, type TrArgs, tr } from '@/lib/app_localization';
import { LUCIDE_ICONS_UNICODE, type WithLucideUnicode } from '@/lib/lucide';
import { fetchProPricing } from '@/lib/proBackend';
import {
  generateProPageSchemas,
  getProFeatures,
  type PricingApiResponse,
} from '@/lib/proPageSchema';

function ProLogoPath() {
  return (
    <>
      <span className="sr-only">{NON_LOCALIZED_STRING.wordPro}</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 53 25">
        <path
          fill="#000"
          d="M7.216 17.372V8.06h7.268c2.315 0 3.725 1.306 3.725 3.505 0 2.147-1.461 3.453-3.776 3.453h-4.178v2.354h-3.04Zm3.04-4.772h3.646c.828 0 1.28-.194 1.28-1.035 0-.854-.452-1.035-1.28-1.035h-3.647v2.07Zm9.376 4.772V8.06h7.566c2.548 0 3.802.983 3.802 2.858 0 1.28-.711 2.134-1.94 2.51 1.216.064 1.94.736 1.94 1.888v2.056h-3.04V15.82c0-.84-.232-1.086-1.06-1.086h-4.229v2.638h-3.04Zm3.04-5.018H26.5c.84 0 1.435-.155 1.435-.957 0-.815-.595-.957-1.435-.957h-3.83v1.914Zm16.258 5.251c-3.958 0-6.506-1.927-6.506-4.915 0-2.948 2.56-4.863 6.505-4.863 3.958 0 6.519 1.915 6.519 4.863 0 2.988-2.561 4.915-6.519 4.915Zm0-2.56c2.056 0 3.362-.932 3.362-2.355 0-1.396-1.306-2.315-3.363-2.315-2.043 0-3.337.919-3.337 2.315 0 1.423 1.307 2.354 3.337 2.354Z"
        />
      </svg>
    </>
  );
}

function ProBadge({ className, children }: { className: string; children?: ReactNode }) {
  return (
    <div className={classNames('h-max rounded-md bg-primary', className)}>
      {children ?? <ProLogoPath />}
    </div>
  );
}

const HeroImageBg = styled.div<{ $height: string; $top: string }>`
&::before {
    content: '';
    position: absolute;
    top: ${(props) => props.$top};
    left: 0;
    width: 100%;
    height: ${(props) => props.$height};
    background: linear-gradient(180deg, #FFF 7.43%, var(--primary-DEFAULT) 35.11%, #FFF 70.8%);

    z-index: -1; /* behind the logo */
  }
`;

const ProFeatureTextContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
  text-align: start;
`;

const ProFeatureTitle = styled.h4`
  display: inline-flex;
  font-size: 15px;
  line-height: 0.8;
  font-weight: 700;
`;

const ProFeatureDescription = styled.span`
  width: 100%;
  font-size: 13px;
  line-height: 1;
  color: var(--gray-light);
`;

const StyledFeatureIcon = styled.div<{ size?: SessionIconSize }>`
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${(props) => (props.size === 'large' ? '42px' : '32px')};
  height: ${(props) => (props.size === 'large' ? '42px' : '32px')};
  padding: 0;
  border-radius: 5px;
  color: var(--black-color);
`;

const proBoxShadow = '0 4px 4px 0 rgba(0, 0, 0, 0.25)';
const proBoxShadowSmall = '0 4px 4px 0 rgba(0, 0, 0, 0.15)';
const proImageOrangeGradient = 'linear-gradient(135deg, #FCB159 0%, #FAD657 100%)';

type WithProFeaturePosition = { position: number };

function ProFeatureIconElement({
  unicode,
  position,
  background,
  color,
  size = 'large',
  className,
}: WithLucideUnicode &
  WithProFeaturePosition & {
    background?: string;
    color?: string;
    size?: SessionIconSize;
    className?: string;
  }) {
  const isDarkTheme = false;
  const bgStyle =
    position === 0
      ? 'linear-gradient(135deg, #57C9FA 0%, #C993FF 100%)'
      : position === 1
        ? 'linear-gradient(135deg, #C993FF 0%, #FF95EF 100%)'
        : position === 2
          ? 'linear-gradient(135deg, #FF95EF 0%, #FF9C8E 100%)'
          : position === 3
            ? 'linear-gradient(135deg, #FF9C8E 0%, #FCB159 100%)'
            : position === 4
              ? proImageOrangeGradient
              : 'none';

  return (
    <StyledFeatureIcon
      style={{
        background: background || bgStyle,
        boxShadow: isDarkTheme ? undefined : proBoxShadowSmall,
      }}
      size={size}
      className={classNames('flex', className)}
    >
      <LucideIcon unicode={unicode} iconSize={size} iconColor={color} />
    </StyledFeatureIcon>
  );
}

const StyledContent = styled.div<{ $alignItems?: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: ${(props) => props.$alignItems ?? 'center'};
  width: 100%;
  gap: 14px;
`;

const StyledRoundedPanelButtonGroup = styled.div<{
  $isSidePanel?: boolean;
  $isDarkTheme?: boolean;
  $withBorder?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #f9f9f9;
  width: 100%;
  padding-block: 16px;
  gap: 14px;
  border: ${(props) => (props.$withBorder ? '1px solid #DFDFDF' : 'none')};
`;

const StyledPanelButton = styled.div<{
  $color?: string;
  $isDarkTheme: boolean;
  $defaultCursorWhenDisabled?: boolean;
  $alignItems?: string;
}>`
  display: flex;
  align-items: ${(props) => props.$alignItems ?? 'center'};
  justify-content: space-between;
  flex-shrink: 0;
  flex-grow: 1;
  width: 100%;
  padding-inline: 16px;
`;
const localeArgs = {
  ...NON_LOCALIZED_STRING,
} as const;

function ProSection({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={classNames(className, 'mb-20 flex flex-col items-center gap-4')}>
      {children}
    </section>
  );
}

function ProFeatureItem({
  title,
  description,
  unicode,
  position,
  iconBackground,
  iconColor,
  iconSize,
  alignItems,
  iconClassName,
}: {
  title: ReactNode;
  description: ReactNode;
  position: number;
  iconBackground?: string;
  iconColor?: string;
  iconSize?: SessionIconSize;
  alignItems?: string;
  iconClassName?: string;
} & WithLucideUnicode) {
  return (
    <StyledPanelButton $isDarkTheme={false} $alignItems={alignItems}>
      <StyledContent $alignItems={alignItems}>
        <ProFeatureIconElement
          position={position}
          unicode={unicode}
          background={iconBackground}
          color={iconColor}
          size={iconSize}
          className={iconClassName}
        />
        <ProFeatureTextContainer>
          <ProFeatureTitle>{title}</ProFeatureTitle>
          <ProFeatureDescription>{description}</ProFeatureDescription>
        </ProFeatureTextContainer>
      </StyledContent>
    </StyledPanelButton>
  );
}

function getRoadmapIcon(value: RoadmapValue) {
  switch (value) {
    case RoadmapValue.ONE:
      return LUCIDE_ICONS_UNICODE.FILE_PLUS_2;
    case RoadmapValue.TWO:
      return LUCIDE_ICONS_UNICODE.USER_ROUND_PLUS;
    case RoadmapValue.THREE:
      return LUCIDE_ICONS_UNICODE.PENCIL;
    case RoadmapValue.FOUR:
      return LUCIDE_ICONS_UNICODE.USERS_ROUND;
    default:
      throw new Error(`Invalid value for getRoadmapIcon: ${value}`);
  }
}

function getFeatureUnicode(groupLocaleKey: 1 | 3, itemLocaleKey: 1 | 2 | 3 | 4) {
  switch (groupLocaleKey) {
    case 1:
      switch (itemLocaleKey) {
        case 1:
          return LUCIDE_ICONS_UNICODE.MESSAGE_SQUARE;
        case 2:
          return LUCIDE_ICONS_UNICODE.PHONE_MISSED;
        case 3:
          return LUCIDE_ICONS_UNICODE.GLOBE;
        case 4:
          return LUCIDE_ICONS_UNICODE.SQUARE_PLAY;
        default:
          throw new Error(
            `Invalid itemLocaleKey for groupLocaleKey ${groupLocaleKey} in getFeatureUnicode: ${itemLocaleKey}`
          );
      }
    case 3:
      switch (itemLocaleKey) {
        case 1:
          return getRoadmapIcon(RoadmapValue.ONE);
        case 2:
          return getRoadmapIcon(RoadmapValue.TWO);
        case 3:
          return getRoadmapIcon(RoadmapValue.THREE);
        case 4:
          return getRoadmapIcon(RoadmapValue.FOUR);
        default:
          throw new Error(
            `Invalid itemLocaleKey for groupLocaleKey ${groupLocaleKey} in getFeatureUnicode: ${itemLocaleKey}`
          );
      }
    default:
      throw new Error(`Invalid groupLocaleKey in getFeatureUnicode: ${groupLocaleKey}`);
  }
}

function ProFeatureItemLocalized({
  groupLocaleKey,
  itemLocaleKey,
}: {
  groupLocaleKey: 1 | 3;
  itemLocaleKey: 1 | 2 | 3 | 4;
}) {
  const t = useTranslations('pro.features');
  const uniqueItemKey = `${groupLocaleKey}.${itemLocaleKey}` as const;

  const unicode = getFeatureUnicode(groupLocaleKey, itemLocaleKey);

  return (
    <ProFeatureItem
      title={t(`${uniqueItemKey}.featureName`, localeArgs)}
      description={t(`${uniqueItemKey}.featureDescription`, localeArgs)}
      position={itemLocaleKey - 1}
      unicode={unicode}
      iconBackground={
        groupLocaleKey === 1
          ? 'var(--primary-DEFAULT)'
          : groupLocaleKey === 3
            ? proImageOrangeGradient
            : undefined
      }
    />
  );
}

const ProFeatureSectionHeadingTitle = styled.h3`
color: #000;
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;

/* Headings/H2 */
font-size: 26px;
font-style: normal;
font-weight: 700;
line-height: 120%; /* 38.4px */

`;

const ProFeatureSectionHeadingTag = styled.p`
color: #000;

/* XL/Bold */
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: 120%; /* 21.6px */
`;

const Heading2 = styled.h2`
color: #000;

/* Headings/H3 */
font-size: 29px;
font-style: normal;
font-weight: 700;
line-height: 120%; /* 34.8px */
`;

const Paragraph = styled.p`
color: #000;
max-width: 700px;

/* Headings/H6 */
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: 120%; /* 24px */
`;

function ProPrice() {
  const t = useTranslations('pro.features');

  const price = '$2.49';

  return (
    <span className="text-gray-lighter text-sm"> {t('priceFrom', { ...localeArgs, price })}</span>
  );
}

function ProFeatureSectionHeading({ localeKey }: { localeKey: 1 | 2 | 3 }) {
  const t = useTranslations('pro.features');
  return (
    <>
      <ProFeatureSectionHeadingTitle>
        {t(`${localeKey}.heading`, localeArgs)}
        {localeKey === 2 ? <ProPrice /> : null}
      </ProFeatureSectionHeadingTitle>
      <ProFeatureSectionHeadingTag>{t(`${localeKey}.tag`, localeArgs)}</ProFeatureSectionHeadingTag>
    </>
  );
}

const StyledDetailedRoadmapButton = styled.a`
background: rgba(230, 230, 230, 0.54);
color: #6D6D6D;
`;

function DetailedRoadmapButton() {
  return <> </>;
}

function ProFeatureItems({ localeKey }: { localeKey: 1 | 3 }) {
  return (
    <>
      <ProFeatureItemLocalized groupLocaleKey={localeKey} itemLocaleKey={1} />
      <ProFeatureItemLocalized groupLocaleKey={localeKey} itemLocaleKey={2} />
      <ProFeatureItemLocalized groupLocaleKey={localeKey} itemLocaleKey={3} />
      <ProFeatureItemLocalized groupLocaleKey={localeKey} itemLocaleKey={4} />
      {localeKey === 3 ? (
        <StyledDetailedRoadmapButton
          href="#roadmap"
          className="-bottom-2 absolute hidden w-max flex-row items-center gap-1 self-center rounded-md px-2 align-center text-xs md:flex"
        >
          Detailed Roadmap{' '}
          <LucideIcon unicode={LUCIDE_ICONS_UNICODE.CHEVRON_DOWN} iconSize="small" />
        </StyledDetailedRoadmapButton>
      ) : null}
    </>
  );
}

function ProFeatureItemsPro() {
  const t = useTranslations('pro.features');
  const proFeatures = getProFeatures(false);
  return (
    <>
      {proFeatures.map(({ title, description, unicode }, i) => {
        return (
          <ProFeatureItem
            key={title.token}
            title={tr(title.token)}
            description={tr(description.token)}
            unicode={unicode}
            position={i}
          />
        );
      })}
      <ProFeatureItem
        key="more"
        position={4}
        title={t('2.moreName', localeArgs)}
        description={t.rich('2.moreDescription', {
          ...localeArgs,
          bold: (chunks: ReactNode) => <strong className="inline-flex gap-1">{chunks}</strong>,
          icon: () => (
            <LucideIcon unicode={LUCIDE_ICONS_UNICODE.EXTERNAL_LINK_ICON} iconSize="extraSmall" />
          ),
        })}
        unicode={LUCIDE_ICONS_UNICODE.CIRCLE_PLUS}
      />
      <ProBadge className="-top-2 absolute right-4 px-1 font-bold text-sm">
        {NON_LOCALIZED_STRING.wordBeta}
      </ProBadge>
    </>
  );
}

function ProFeatureSection({
  localeKey,
  children,
}: {
  localeKey: 1 | 2 | 3;
  children?: ReactNode;
}) {
  // NOTE: we need the bottom padding to ensure the sections go past the gradient
  return (
    <div className="justify-left flex h-[max-content] w-full flex-col gap-2 rounded-xl bg-white p-4 text-left md:pb-14">
      <ProFeatureSectionHeading localeKey={localeKey} />
      <StyledRoundedPanelButtonGroup className="relative rounded-lg">
        {localeKey === 2 ? <ProFeatureItemsPro /> : <ProFeatureItems localeKey={localeKey} />}
      </StyledRoundedPanelButtonGroup>
      {children}
    </div>
  );
}

enum FeaturesValue {
  FREE = 'free',
  PRO = 'pro',
}

const StyledFeatureTrigger = styled(TabsTrigger)`
  &[data-state="active"] {
    background: var(--primary-DEFAULT);
    outline: none;
  }
`;

const triggerTextClassName = 'w-full py-2 text-lg font-bold';

const StyledFeaturesTabsList = styled(TabsList)`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
`;

function ProFeaturesMobile() {
  const t = useTranslations('pro.features');
  return (
    <div className="flex max-w-7xl flex-col gap-6 self-center pt-8 md:hidden">
      <Heading2>{t('headingMobile', localeArgs)}</Heading2>
      <Tabs defaultValue={FeaturesValue.PRO} className="flex w-full flex-col items-center gap-4">
        <div className={tabsListContainerClassName}>
          <StyledFeaturesTabsList className="mb-2 flex flex-row rounded-lg bg-white font-bold text-lg">
            <StyledFeatureTrigger
              value={FeaturesValue.FREE}
              className={classNames(triggerTextClassName, 'rounded-l-lg')}
            >
              <span>{t('1.heading', localeArgs)}</span>
            </StyledFeatureTrigger>
            <StyledFeatureTrigger
              value={FeaturesValue.PRO}
              className={classNames(triggerTextClassName, 'rounded-r-lg')}
            >
              <span>{t('2.heading', localeArgs)}</span>
            </StyledFeatureTrigger>
          </StyledFeaturesTabsList>
          <StyledTabsContent value={FeaturesValue.FREE} className={styledTabsContentClassName}>
            <HeroImageBg $height="1100px" $top="-50px" />
            <ProFeatureSection localeKey={1} />
          </StyledTabsContent>
          <StyledTabsContent value={FeaturesValue.PRO} className={styledTabsContentClassName}>
            <HeroImageBg $height="1700px" $top="-100px" />
            <ProFeatureSection localeKey={2}>
              <ProFeatureSectionHeadingTag>
                {t('3.tagMobile', localeArgs)}
              </ProFeatureSectionHeadingTag>
              <StyledRoundedPanelButtonGroup className="rounded-lg">
                <ProFeatureItems localeKey={3} />
              </StyledRoundedPanelButtonGroup>
              <StyledDetailedRoadmapButton
                href="#roadmap"
                className="flex w-full flex-row items-center justify-center gap-1 self-center rounded-md py-3 align-center text-md md:hidden"
              >
                {t('detailedRoadmap')}{' '}
                <LucideIcon unicode={LUCIDE_ICONS_UNICODE.CHEVRON_DOWN} iconSize="small" />
              </StyledDetailedRoadmapButton>
            </ProFeatureSection>
          </StyledTabsContent>
          <HiddenCenteringSpacer />
        </div>
      </Tabs>
    </div>
  );
}

function ProFeaturesDesktop() {
  return (
    <div className="mx-auto hidden max-w-7xl flex-row items-end gap-6 self-center px-4 pt-8 md:flex">
      <ProFeatureSection localeKey={1} />
      <ProFeatureSection localeKey={2} />
      <ProFeatureSection localeKey={3} />
    </div>
  );
}

function ProFeatures() {
  return (
    <>
      <ProFeaturesMobile />
      <ProFeaturesDesktop />
    </>
  );
}

function ProHero() {
  const t = useTranslations('pro');
  return (
    <ProSection className="relative mt-10 mb-10 flex flex-col gap-5 md:mt-0">
      <HeroImageBg $height="875px" $top="-30px" className="hidden md:block" />
      <h1 className="flex w-max self-center font-bold text-4xl">
        {t.rich('heading', {
          'pro-badge': () => <ProBadge className="ml-2 w-20" />,
        })}
      </h1>
      <p className="mx-8 text-xl md:text-2xl">{t('tag', localeArgs)}</p>
      <ProFeatures />
    </ProSection>
  );
}

function ProInfo() {
  const t = useTranslations('pro.info');
  return (
    <ProSection className="md:-mt-5">
      <Heading2>{t('heading', localeArgs)}</Heading2>
      <Paragraph className="mx-4">
        {t.rich('content', {
          ...localeArgs,
          br: () => <br />,
        })}
      </Paragraph>
    </ProSection>
  );
}

type UpgradeTabInfo = WithLucideUnicode & {
  titleKey: string;
  descriptionKey: string;
  subDescriptionKey: string;
  readMoreHref: string;
};

function UpgradeTabInfoItem({ platform, n }: { platform: UpgradePlatform; n: 1 | 2 }) {
  const t = useTranslations('pro.upgrade');
  const isDesktop = platform === 'desktop';
  const prefix = isDesktop ? ('desktop.1' as const) : (`mobile.${n}` as const);
  const titleKey = `${prefix}.upgradeName` as const;
  const descriptionKey = `${prefix}.upgradeDescription` as const;
  const subDescriptionKey = `${prefix}.upgradeSubDescription` as const;

  const platformString =
    platform === 'ios' ? NON_LOCALIZED_STRING.platformIos : NON_LOCALIZED_STRING.platformAndroid;
  const platformStoreShortString =
    platform === 'ios'
      ? NON_LOCALIZED_STRING.platformStoreAppleShort
      : NON_LOCALIZED_STRING.platformStoreGoogleShort;

  const _localeArgs = {
    ...localeArgs,
    platform: platformString,
    platformA: platformString,
    platformStoreShort: platformStoreShortString,
    platformB:
      platform === 'ios' ? NON_LOCALIZED_STRING.platformAndroid : NON_LOCALIZED_STRING.platformIos,
    notSupportedInfo:
      !isDesktop && n === 1
        ? t(
            `mobile.1.upgradeSubDescriptionNotSupportedInfo${platform === 'ios' ? 'Ios' : 'Android'}`,
            localeArgs
          )
        : '',
  };

  return (
    <StyledRoundedPanelButtonGroup $withBorder={true} className="rounded-lg">
      <ProFeatureItem
        position={n}
        unicode={
          n === 2 || platform === 'desktop'
            ? LUCIDE_ICONS_UNICODE.LINK
            : LUCIDE_ICONS_UNICODE.SMARTPHONE
        }
        alignItems="top"
        iconBackground="color-mix(in srgb, var(--primary-DEFAULT) 10%, transparent)"
        iconColor="var(--primary-DEFAULT)"
        iconSize={'medium'}
        title={t(titleKey, _localeArgs)}
        description={
          <div className="h-full w-full leading-snug">
            <p className="text-black">
              {t.rich(descriptionKey, {
                ..._localeArgs,
                br: () => <br />,
              })}
            </p>
            <br />
            <p className="text-gray-lighter italic">{t(subDescriptionKey, _localeArgs)}</p>
            <br />
            <a className="flex flex-row items-center gap-1 font-bold">
              Read More{' '}
              <LucideIcon
                unicode={LUCIDE_ICONS_UNICODE.EXTERNAL_LINK_ICON}
                iconColor=""
                iconSize="extraSmall"
              />{' '}
            </a>
          </div>
        }
      />
    </StyledRoundedPanelButtonGroup>
  );
}

const STYLED_TRIGGER_WIDTH_PX = '42px';

const StyledTrigger = styled(TabsTrigger)`
  display: flex;
  flex-direction: row;
  min-width: ${STYLED_TRIGGER_WIDTH_PX};
  width: max-content;
  height: ${STYLED_TRIGGER_WIDTH_PX};
  justify-content: center;
  border-radius: 10px;
  background-color: #F0F0F0;
  align-items: center;
`;
const StyledUpgradeTrigger = styled(StyledTrigger)`
&[data-state="active"] {
    background-color: var(--primary-DEFAULT);
    outline: none;
  }
`;

const StyledHiddenCenteringSpacer = styled.div`
  width: ${STYLED_TRIGGER_WIDTH_PX};
`;

const HiddenCenteringSpacer = () => {
  return <StyledHiddenCenteringSpacer className="hidden md:ml-2 md:block" />;
};

const StyledTabsContent = styled(TabsContent)`
  &[data-state="active"] {
    gap: 8px;
  }
`;

const StyledTabsContentSingle = styled(TabsContent)`
  width: 100%;
`;

const iconClassName = 'w-6 h-6';
const iconTextClassName = 'md:sr-only font-bold text-base';
const styledTabsContentClassName = 'flex flex-col md:flex-row max-w-3xl';
const styledTriggerClassName = 'px-3 gap-2 md:gap-0 md:px-0 shadow md:shadow-md';
const tabsListClassName =
  'flex flex-row md:flex-col md:mr-2 mb-2 md:mb-0 justify-between md:border md:border-border gap-3 p-3 bg-[#F9F9F9] rounded-lg h-[max-content]';
const tabsListContainerClassName = 'flex flex-col md:flex-row mx-4';

enum UpgradePlatform {
  ANDROID = 'android',
  IOS = 'ios',
  DESKTOP = 'desktop',
}

function ProUpgrade() {
  const t = useTranslations('pro.upgrade');
  return (
    <ProSection id="upgrade">
      <Tabs
        defaultValue={UpgradePlatform.ANDROID}
        className="flex w-full flex-col items-center gap-4"
      >
        <Heading2 className="flex w-max items-center self-center">
          {t.rich('heading', {
            ...localeArgs,
            'platform-badge': () => (
              <ProBadge className="ml-2 hidden w-max px-2 py-0.5 md:block">
                <TabsContent value={UpgradePlatform.ANDROID}>
                  {NON_LOCALIZED_STRING.platformAndroid}
                </TabsContent>
                <TabsContent value={UpgradePlatform.IOS}>
                  {NON_LOCALIZED_STRING.platformIos}
                </TabsContent>
                <TabsContent value={UpgradePlatform.DESKTOP}>
                  {NON_LOCALIZED_STRING.wordDesktop}
                </TabsContent>
              </ProBadge>
            ),
          })}
        </Heading2>
        <div className={tabsListContainerClassName}>
          <TabsList className={tabsListClassName}>
            <StyledUpgradeTrigger
              value={UpgradePlatform.ANDROID}
              className={styledTriggerClassName}
            >
              <AndroidSVG className={iconClassName} />
              <span className={iconTextClassName}>{NON_LOCALIZED_STRING.platformAndroid}</span>
            </StyledUpgradeTrigger>
            <StyledUpgradeTrigger value={UpgradePlatform.IOS} className={styledTriggerClassName}>
              <AppleSVG className={iconClassName} />
              <span className={iconTextClassName}>{NON_LOCALIZED_STRING.platformIos}</span>
            </StyledUpgradeTrigger>
            <StyledUpgradeTrigger
              value={UpgradePlatform.DESKTOP}
              className={styledTriggerClassName}
            >
              <LucideIcon unicode={LUCIDE_ICONS_UNICODE.LAPTOP} iconSize="large" />
              <span className={iconTextClassName}>{NON_LOCALIZED_STRING.wordDesktop}</span>
            </StyledUpgradeTrigger>
          </TabsList>
          <StyledTabsContent value={UpgradePlatform.ANDROID} className={styledTabsContentClassName}>
            <UpgradeTabInfoItem platform={UpgradePlatform.ANDROID} n={1} />
            <UpgradeTabInfoItem platform={UpgradePlatform.ANDROID} n={2} />
          </StyledTabsContent>
          <StyledTabsContent value={UpgradePlatform.IOS} className={styledTabsContentClassName}>
            <UpgradeTabInfoItem platform={UpgradePlatform.IOS} n={1} />
            <UpgradeTabInfoItem platform={UpgradePlatform.IOS} n={2} />
          </StyledTabsContent>
          <StyledTabsContentSingle value={UpgradePlatform.DESKTOP} className="max-w-3xl">
            <UpgradeTabInfoItem platform={UpgradePlatform.DESKTOP} n={1} />
          </StyledTabsContentSingle>
          <HiddenCenteringSpacer />
        </div>
      </Tabs>
    </ProSection>
  );
}

enum RoadmapValue {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
}

const roadmapItems = [
  RoadmapValue.ONE,
  RoadmapValue.TWO,
  RoadmapValue.THREE,
  RoadmapValue.FOUR,
] as const;

const StyledRoadmapTrigger = styled(StyledTrigger)`
&[data-state="active"] {
    background: ${proImageOrangeGradient};
    outline: none;
  }
`;

function RoadmapTabInfoItem({ value }: { value: RoadmapValue }) {
  const t = useTranslations(`pro.roadmap.${value}`);

  return (
    <StyledRoundedPanelButtonGroup $withBorder={true} className="rounded-lg">
      <ProFeatureItem
        position={1}
        unicode={getRoadmapIcon(value)}
        alignItems="top"
        iconBackground={proImageOrangeGradient}
        iconSize={'medium'}
        title={t('featureName', localeArgs)}
        iconClassName="flex md:hidden"
        description={
          <div className="h-full w-full text-black leading-snug">
            <p className="text-black">
              {t.rich('featureDescription', {
                ...localeArgs,
                br: () => <br />,
              })}
            </p>
            <br />
            <span>{t('featureSubheading', localeArgs)}</span>
            <br />
            <br />
            <ul className="pl-3">
              {t.rich('featureSublist', {
                ...localeArgs,
                li: (chunks: ReactNode) => <li className="list-disc">{chunks}</li>,
                bold: (chunks: ReactNode) => <strong>{chunks}</strong>,
              })}
            </ul>
          </div>
        }
      />
    </StyledRoundedPanelButtonGroup>
  );
}
function ProRoadmap() {
  const t = useTranslations('pro.roadmap');
  return (
    <ProSection id="roadmap">
      <Heading2 className="flex w-max items-center self-center">
        {t('heading', localeArgs)}
      </Heading2>
      <Tabs defaultValue={RoadmapValue.ONE} className="flex w-full flex-col items-center gap-4">
        <div className={tabsListContainerClassName}>
          <TabsList className={tabsListClassName}>
            {roadmapItems.map((item) => (
              <StyledRoadmapTrigger
                key={item}
                value={item}
                className={classNames(styledTriggerClassName, 'px-8 md:px-0')}
              >
                <LucideIcon unicode={getRoadmapIcon(item)} iconSize="large" className="w-full" />
                <span className="sr-only">{t(`${item}.featureName`)}</span>
              </StyledRoadmapTrigger>
            ))}
          </TabsList>

          {roadmapItems.map((item) => (
            <StyledTabsContent key={item} value={item} className={styledTabsContentClassName}>
              <RoadmapTabInfoItem value={item} />
            </StyledTabsContent>
          ))}
          <HiddenCenteringSpacer />
        </div>
      </Tabs>
    </ProSection>
  );
}

function FAQItem({ localeKey }: { localeKey: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 }) {
  const t = useTranslations('pro.faq');
  return (
    <div className="mx-4 flex w-full flex-row flex-wrap gap-2 rounded-lg bg-[#E8E8E8] px-2 py-2 text-left font-bold">
      <LucideIcon unicode={LUCIDE_ICONS_UNICODE.PLUS} iconSize="medium" />
      <span className="whitespace-normal">{t(`${localeKey}.question`, localeArgs)}</span>
      <LucideIcon
        unicode={LUCIDE_ICONS_UNICODE.LINK}
        iconSize="medium"
        iconColor="var(--gray-lighter)"
      />
    </div>
  );
}

function ProFAQ() {
  const t = useTranslations('pro.faq');
  return (
    <ProSection id="faq">
      <Heading2>{t('heading', localeArgs)}</Heading2>
      <div className="flex w-full max-w-3xl flex-col gap-3">
        <FAQItem localeKey={1} />
        <FAQItem localeKey={2} />
        <FAQItem localeKey={3} />
        <FAQItem localeKey={4} />
        <FAQItem localeKey={5} />
        <FAQItem localeKey={6} />
        <FAQItem localeKey={7} />
        <FAQItem localeKey={8} />
        <FAQItem localeKey={9} />
      </div>
    </ProSection>
  );
}

export default function ProPage({
  schemas,
}: {
  schemas: ReturnType<typeof generateProPageSchemas>;
}): ReactElement {
  const locale = useLocale();
  const t = useTranslations('pro');
  const tImage = useTranslations('imageAlt');

  useEffect(() => {
    if (isCrowdinLocale(locale)) {
      setLocaleInUse(locale);
    } else {
      console.warn(`Invalid locale for session localization module, falling back to en: ${locale}`);
    }
  }, [locale]);

  return (
    <Layout
      localeKey="pro"
      metadata={METADATA.PRO_PAGE}
      structuredData={schemas.map((v) => JSON.stringify(v))}
    >
      <Container classes="flex flex-col justify-center text-center" fullWidth={true}>
        <ProHero />
        <ProInfo />
        <ProUpgrade />
        <ProRoadmap />
        <ProFAQ />
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const locale = context.locale ?? 'en';
  const messages = (await import(`../locales/${locale}.json`)).default;

  // Fetch pricing from API — falls back to empty plans on error so the
  // page still builds successfully even if the pricing API is down.
  let pricing: PricingApiResponse = { plans: [] };
  try {
    pricing = await fetchProPricing(locale);
  } catch (err) {
    console.error('[ProPage] Failed to fetch pricing for schema:', err);
  }

  const schemas = generateProPageSchemas({ locale, messages, pricing });

  return {
    props: { messages, schemas },
  };
};
