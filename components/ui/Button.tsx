import classNames from 'classnames';
import type { HTMLAttributes, LegacyRef, ReactElement } from 'react';

type Props = HTMLAttributes<HTMLButtonElement> & {
  bgColor?: 'primary' | 'black' | 'none' | 'gray';
  textColor?: 'primary' | 'black' | 'white';
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  shape?: 'round' | 'semiround' | 'square';
  fontWeight?: 'normal' | 'semibold' | 'bold';
  animate?: boolean;
  hoverEffect?: boolean;
  type?: 'submit';
  reference?: LegacyRef<HTMLButtonElement>;
  classes?: string;
};

export default function Button(props: Props): ReactElement {
  const {
    bgColor = 'primary',
    textColor = 'black',
    fontWeight = 'normal',
    size = 'medium',
    shape = 'round',
    type,
    reference,
    animate = false,
    hoverEffect = true,
    classes,
    ...rest
  } = props;

  // See Gotchas in README
  const bgClasses = [
    bgColor === 'primary' && 'bg-primary',
    bgColor === 'black' && 'bg-black',
    bgColor === 'gray' && 'bg-gray-dark',
    bgColor === 'none' && 'bg-transparent',
  ];
  const textClasses = [
    textColor === 'primary' && 'text-primary',
    textColor === 'black' && 'text-black',
    textColor === 'white' && 'text-white',
  ];
  const hoverClasses = [
    bgColor === 'primary' && 'hover:bg-black hover:text-primary',
    bgColor === 'black' && 'hover:bg-primary hover:text-black',
    bgColor === 'gray' && 'hover:bg-black hover:text-primary',
    (hoverEffect || animate) && 'transition-colors duration-300',
  ];
  const sizeClasses = [
    size === 'small' && 'text-sm py-1 px-7',
    size === 'medium' && 'py-2 px-7',
    size === 'large' && 'py-2 px-11',
    size === 'extra-large' && 'py-4 px-11',
  ];
  const shapeClasses = [
    shape === 'round' && 'rounded-3xl',
    shape === 'semiround' && 'rounded-lg',
    shape === 'square' && 'rounded-sm',
  ];
  const fontClasses = [
    fontWeight === 'normal' && 'font-normal',
    fontWeight === 'semibold' && 'font-semibold',
    fontWeight === 'bold' && 'font-bold',
  ];

  return (
    <button
      {...rest}
      className={classNames(
        bgClasses,
        textClasses,
        hoverEffect && hoverClasses,
        sizeClasses,
        shapeClasses,
        fontClasses,
        classes
      )}
      type={type}
      ref={reference}
    />
  );
}
