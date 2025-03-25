import { ReactElement } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import redact from '@/utils/redact';
import { useScreen } from '@/contexts/screen';

interface Props {
  title: string;
  description?: string[];
  images: string[]; // toggle images on hover [original, redacted]
  imageAlt: string;
  imageWidth: string;
  imageHeight: string;
  classes?: string;
}

export default function BenefitsCard(props: Props): ReactElement {
  const { isSmall } = useScreen();
  const {
    title,
    description,
    images,
    imageAlt,
    imageWidth,
    imageHeight,
    classes,
  } = props;
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
          priority={true}
        />
      );
    } else {
      return images.map((img, index) => {
        return (
          <div
            key={img}
            className={classNames(
              index === 0
                ? 'block group-hover:hidden'
                : 'hidden group-hover:block'
            )}
          >
            <Image
              src={img}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              layout="responsive"
              priority={true}
            />
          </div>
        );
      });
    }
  })();

  const renderDescription = (() => {
    return description?.map((line, index) => {
      return (
        <p key={index} className={classNames('text-sm leading-relaxed -mx-3')}>
          <span className={classNames(redactedClasses)}>{line}</span>
        </p>
      );
    });
  })();

  // parent container must have 'flex' class
  return (
    <div
      className={classNames(
        'group text-center text-2xl font-bold leading-none p-3',
        'lg:text-3xl',
        classes
      )}
    >
      <div className={classNames('mb-5', 'md:px-16', 'lg:px-20')}>
        {renderImages}
      </div>
      <p className={classNames('md:mb-5')}>{title}</p>
      <div className={classNames('hidden', 'md:block')}>
        {renderDescription}
      </div>
    </div>
  );
}
