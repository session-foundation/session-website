import { ReactElement } from 'react';
import classNames from 'classnames';
import { IContainerSizes } from '@/components/Container';
import { useScreen } from '@/contexts/screen';

interface Props {
  color?: 'primary' | 'gray-dark';
  containerWidths?: IContainerSizes;
  classes?: string;
  children?: ReactElement | string;
}

export default function Headline(props: Props): ReactElement {
  const { color = 'primary', containerWidths, classes, children } = props;
  const { isSmall, isMedium, isLarge, isHuge, isEnormous } = useScreen();
  const containerWidth: string | undefined = (() => {
    if (isSmall) return containerWidths?.small;
    if (isMedium) return containerWidths?.medium;
    if (isLarge) return containerWidths?.large;
    if (isHuge || isEnormous)
      return containerWidths?.huge ?? containerWidths?.large;
  })();
  const colorClasses = [
    color === 'primary' && 'text-primary',
    color === 'gray-dark' && 'text-gray-dark',
  ];
  const borderClasses = [
    color === 'primary' && 'border-primary',
    color === 'gray-dark' && 'border-gray-dark',
  ];
  return (
    <div className={classNames('flex items-start', classes)}>
      <div
        className={classNames(`border-t mt-2 ml-3`, borderClasses)}
        style={{
          minWidth: isLarge || isHuge || isEnormous ? '72px' : '',
          width: isSmall
            ? `calc((100vw - ${containerWidth}))`
            : `calc((100vw - ${containerWidth}) / 2)`,
        }}
      ></div>
      <div className={'mx-6'}>
        <div
          className={classNames('md:mx-auto', colorClasses)}
          style={{ width: `calc(${containerWidth})` }}
        >
          {children}
        </div>
      </div>
      <div
        className={classNames(`hidden mt-2 mr-3`, 'md:block')}
        style={{ width: `calc((100vw - ${containerWidth}) / 2)` }}
      ></div>
    </div>
  );
}
