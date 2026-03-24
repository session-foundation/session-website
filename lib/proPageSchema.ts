import { NON_LOCALIZED_STRING } from '@/constants/localization';
import {
  isCrowdinLocale,
  LocalizedStringBuilder,
  setLocaleInUse,
  type TrArgs,
  tr,
} from './app_localization';
import { LUCIDE_ICONS_UNICODE, type WithLucideUnicode } from './lucide';

export type PricingPlan = {
  duration: 'P1M' | 'P3M' | 'P1Y';
  label: string; // e.g. "Monthly", "3 Months", "Annual"
  unitText: 'MONTH' | 'YEAR';
  price: string; // e.g. "2.49"
  currency: string; // e.g. "USD"
};

export type PricingApiResponse = {
  plans: PricingPlan[];
};

export type SchemaOffer = {
  '@type': 'Offer';
  name: string;
  price: string;
  priceCurrency: string;
  priceSpecification: {
    '@type': 'UnitPriceSpecification';
    unitText: string;
    billingDuration: string;
  };
};

export type SchemaFAQEntity = {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
};

export type SchemaRoadmapItem = {
  '@type': 'ListItem';
  position: number;
  name: string;
  description: string;
};

export type ProPageSchemaProps = {
  locale: string;
  pricing: PricingApiResponse;
  messages: Record<string, any>;
};

export function getProFeatures(userHasPro: boolean): Array<
  {
    id:
      | 'proLongerMessages'
      | 'proUnlimitedPins'
      | 'proAnimatedDisplayPictures'
      | 'proBadges'
      | 'plusLoadsMore';
    title: TrArgs;
    description: TrArgs;
    unicode: string;
  } & WithLucideUnicode
> {
  return [
    {
      id: 'proLongerMessages',
      title: { token: 'proLongerMessages' as const },
      description: {
        token: userHasPro
          ? ('proLongerMessagesDescription' as const)
          : ('nonProLongerMessagesDescription' as const),
      },
      unicode: LUCIDE_ICONS_UNICODE.MESSAGE_SQUARE,
    },
    {
      id: 'proUnlimitedPins',
      title: { token: 'proUnlimitedPins' as const },
      description: {
        token: userHasPro
          ? ('proUnlimitedPinsDescription' as const)
          : ('nonProUnlimitedPinnedDescription' as const),
      },
      unicode: LUCIDE_ICONS_UNICODE.PIN,
    },
    {
      id: 'proAnimatedDisplayPictures',
      title: { token: 'proAnimatedDisplayPictures' as const },
      description: { token: 'proAnimatedDisplayPicturesDescription' as const },
      unicode: LUCIDE_ICONS_UNICODE.SQUARE_PLAY,
    },
    {
      id: 'proBadges',
      title: { token: 'proBadges' as const },
      description: { token: 'proBadgesDescription' as const },
      unicode: LUCIDE_ICONS_UNICODE.RECTANGLE_ELLIPSES,
    },
  ];
}

/**
 * Safely resolves a dot-separated key path from a nested messages object.
 * e.g. resolve(messages, 'pro.faq.1.question')
 */
function resolve(obj: Record<string, any>, path: string): string {
  const rawMessage = path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';

  // TODO: make PR to localization repo to expose utility functions
  const t = new LocalizedStringBuilder(rawMessage as any);
  t.withArgs({ ...NON_LOCALIZED_STRING });
  // @ts-expect-error TODO: make method public
  return t.formatStringWithArgs(rawMessage);
}

function buildOffersSchema(pricing: ProPageSchemaProps['pricing']): SchemaOffer[] {
  return pricing.plans.map(({ label, price, currency, unitText, duration }) => ({
    '@type': 'Offer',
    name: label,
    price,
    priceCurrency: currency,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      unitText,
      billingDuration: duration,
    },
  }));
}

function buildSoftwareApplicationSchema(offers: SchemaOffer[], messages: Record<string, any>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Session Pro',
    applicationCategory: 'CommunicationApplication',
    operatingSystem: 'Android, iOS, Windows, macOS, Linux',
    description: resolve(messages, 'pro.tag'),
    offers,
  };
}

function buildProFeaturesSchema(messages: Record<string, any>) {
  // TODO: set locale
  const features = getProFeatures(false);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Session Pro Features',
    itemListElement: features.map((f) => ({
      '@type': 'ListItem',
      // @ts-expect-error TODO:this is fine
      name: tr(f.title.token),
      // @ts-expect-error TODO:this is fine
      description: tr(f.description.token),
    })),
  };
}

function buildRoadmapSchema(messages: Record<string, any>) {
  const roadmapItems: SchemaRoadmapItem[] = ([1, 2, 3, 4] as const).map((n) => ({
    '@type': 'ListItem',
    position: n,
    name: resolve(messages, `pro.roadmap.${n}.featureName`),
    description: resolve(messages, `pro.roadmap.${n}.featureDescription`),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Session Pro Roadmap',
    description: 'Upcoming features planned for Session Pro',
    itemListElement: roadmapItems,
  };
}

function buildFAQSchema(messages: Record<string, any>) {
  const faqKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

  const mainEntity: SchemaFAQEntity[] = faqKeys.map((n) => ({
    '@type': 'Question',
    name: resolve(messages, `pro.faq.${n}.question`),
    acceptedAnswer: {
      '@type': 'Answer',
      text: resolve(messages, `pro.faq.${n}.answer`),
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * Generates all JSON-LD schema blocks for the Pro page.
 * Call this in getStaticProps and pass the result as a prop.
 *
 * @example
 * // In getStaticProps:
 * const pricing = await fetchProPricing(context.locale);
 * const schemas = generateProPageSchemas({ locale, pricing, messages });
 * return { props: { messages, schemas } };
 *
 * // In ProPage component:
 * <Head>
 *   {schemas.map((schema, i) => (
 *     <script key={i} type="application/ld+json"
 *       dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 *   ))}
 * </Head>
 */
export function generateProPageSchemas({ pricing, messages, locale }: ProPageSchemaProps) {
  const offers = buildOffersSchema(pricing);
  if (isCrowdinLocale(locale)) {
    setLocaleInUse(locale);
  } else {
    console.warn(`Invalid locale for session localization module, falling back to en: ${locale}`);
  }

  return [
    buildSoftwareApplicationSchema(offers, messages),
    buildProFeaturesSchema(messages),
    buildRoadmapSchema(messages),
    buildFAQSchema(messages),
  ];
}
