import classNames from 'classnames';
import Image from 'next/legacy/image';
import type { ReactElement } from 'react';
import { useScreen } from '@/contexts/screen';
import redact from '@/utils/redact';

interface Props {
  title: string;
  description?: string[];
  images: string[]; // toggle images on hover [original, redacted]
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  classes?: string;
}

export default function BenefitsCard(props: Props): ReactElement {
  const { isSmall } = useScreen();
  const { title, description, images, imageAlt, imageWidth, imageHeight, classes } = props;
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
    return description?.map((line) => {
      return (
        <p
          key={line}
          className={classNames('-mx-3 text-sm leading-relaxed', 'xl:text-base', 'lg:-mx-8')}
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
        'group p-3 text-center font-bold text-2xl leading-none',
        'lg:text-3xl',
        classes
      )}
    >
      <div className={classNames('mb-5', 'md:px-16', 'lg:px-12', 'xl:px-32', '2xl:px-20')}>
        {renderImages}
      </div>
      <p className={classNames('md:mb-5 md:whitespace-nowrap')}>{title}</p>
      <div className={classNames('hidden', 'md:block')}>{renderDescription}</div>
    </div>
  );
}
