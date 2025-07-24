import classNames from 'classnames';
import Image from 'next/legacy/image';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { NON_LOCALIZED_STRING } from '@/constants/localization';
import { useScreen } from '@/contexts/screen';
import redact from '@/utils/redact';

interface Props {
  itemNumber: '1' | '2' | '3' | '4' | '5' | '6';
  images: string[]; // toggle images on hover [original, redacted]
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  classes?: string;
}

export default function BenefitsCard(props: Props): ReactNode {
  const t = useTranslations('landing.benefits');
  const tFeature = useTranslations('feature');
  const { isSmall } = useScreen();

  const { images, itemNumber, imageAlt, imageWidth, imageHeight, classes } = props;

  if (!t.has(`${itemNumber}.heading` as const) || !t.has(`${itemNumber}.content` as const)) {
    return null;
  }

  const title = t(`${itemNumber}.heading` as const);
  const rawDescription = t.rich(`${itemNumber}.content` as const, {
    br: () => null,
    appName: NON_LOCALIZED_STRING.appName,
    appNamePossessive: NON_LOCALIZED_STRING.appNamePossessive,
    featureAccountIds: tFeature('accountIds'),
    featureNodes: tFeature('nodes'),
  });

  const redactedClasses = redact({
    redactColor: 'gray-dark',
    textColor: 'gray-dark',
  });
  const renderImages = (() => {
    if (isSmall) {
      return (
        <Image
          src={images[0]}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          layout="responsive"
        />
      );
    } else {
      return images.map((img, index) => {
        return (
          <div
            key={img}
            className={classNames(
              index === 0 ? 'block group-hover:hidden' : 'hidden group-hover:block'
            )}
          >
            <Image
              src={img}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              layout="responsive"
            />
          </div>
        );
      });
    }
  })();

  const renderDescription = (() => {
    const nodes = Array.isArray(rawDescription) ? rawDescription : [rawDescription];
    return nodes.map((line) => {
      return (
        <p
          key={line}
          className={classNames('-mx-3 text-sm leading-relaxed', 'xl:text-base', 'lg:-mx-5')}
        >
          <span className={classNames(redactedClasses)}>{line}</span>
        </p>
      );
    });
  })();

  // parent container must have 'flex' class
  return (
    <div
      className={classNames(
        'group p-1 text-center font-bold text-2xl leading-none',
        'lg:text-3xl',
        classes
      )}
    >
      <div className={classNames('mb-5', 'md:px-16', 'lg:px-12', 'xl:px-32', '2xl:px-20')}>
        {renderImages}
      </div>
      <p className={classNames('md:mb-5')}>{title}</p>
      <div className={classNames('hidden', 'md:block')}>{renderDescription}</div>
    </div>
  );
}
