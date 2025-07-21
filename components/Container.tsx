import { ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import { useScreen } from '@/contexts/screen';

export interface IContainerSizes {
  small: string;
  medium: string;
  large: string;
  huge?: string;
  enormous?: string;
}

interface Props {
  id?: string;
  hasMinHeight?: boolean;
  heights?: IContainerSizes;
  fullWidth?: boolean;
  classes?: string;
  children: ReactNode;
}

export default function Container(props: Props): ReactElement {
  const {
    id,
    hasMinHeight = false,
    heights,
    fullWidth = false,
    classes,
    children,
  } = props;
  const minHeights: IContainerSizes = {
    small: '568px',
    medium: '1024px',
    large: '768px',
    huge: '900px',
    enormous: '968px',
  };
  const { isSmall, isMedium, isLarge, isHuge, isEnormous } = useScreen();
  const getHeight = (sizes: IContainerSizes): string => {
    if (isSmall) return sizes?.small;
    if (isMedium) return sizes?.medium;
    if (isLarge) return sizes?.large;
    if (isHuge) return sizes?.huge ?? sizes?.large;
    if (isEnormous) return sizes?.enormous ?? sizes?.large;
    return '';
  };
  const height = heights && getHeight(heights);
  return (
    <div
      id={id}
      className={classNames(
        'mx-auto',
        !fullWidth && [
          'container max-w-6xl p-6',
          'md:p-12',
          'lg:py-0 lg:px-10',
        ],
        classes
      )}
      // mobile safari needs style props to be explicitly undefined if not used
      style={{
        minHeight: hasMinHeight ? getHeight(minHeights) : undefined,
        height: height ? `calc(${height})` : undefined,
      }}
    >
      {children}
    </div>
  );
}
