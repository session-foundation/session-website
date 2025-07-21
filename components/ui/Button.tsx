import { LegacyRef, ReactElement } from 'react';
import classNames from 'classnames';

interface Props {
  bgColor?: 'primary' | 'black' | 'none';
  textColor?: 'primary' | 'black';
  size?: 'small' | 'medium' | 'large';
  shape?: 'round' | 'semiround' | 'square';
  fontWeight?: 'normal' | 'semibold' | 'bold';
  animate?: boolean;
  hoverEffect?: boolean;
  type?: 'submit';
  reference?: LegacyRef<HTMLButtonElement>;
  classes?: string;
  children?: string;
  onClick?(): any;
}

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
    children,
    onClick,
  } = props;
  // See Gotchas in README
  const bgClasses = [
    bgColor === 'primary' && 'bg-primary',
    bgColor === 'black' && 'bg-black',
    bgColor === 'none' && 'bg-transparent',
  ];
  const textClasses = [
    textColor === 'primary' && 'text-primary',
    textColor === 'black' && 'text-black',
  ];
  const hoverClasses = [
    bgColor === 'primary' && 'hover:bg-black hover:text-primary',
    bgColor === 'black' && 'hover:bg-primary hover:text-black',
    (hoverEffect || animate) && 'transition-colors duration-300',
  ];
  const sizeClasses = [
    size === 'small' && 'text-sm py-1 px-7',
    size === 'medium' && 'py-2 px-7',
    size === 'large' && 'py-2 px-11',
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
      onClick={onClick}
    >
      {children}
    </button>
  );
}
