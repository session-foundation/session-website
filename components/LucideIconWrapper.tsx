import type { CSSProperties } from 'react';
import styled from 'styled-components';
import type { WithLucideUnicode } from '@/lib/lucide';

export type SessionIconSize =
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'huge'
  | 'huge2'
  | 'max';
export const IconSizeToPx = {
  extraSmall: 12,
  small: 15,
  /**
   * medium is default
   */
  medium: 20,
  large: 25,
  huge: 30,
  huge2: 40,
  max: 50,
};

export const IconSizeToPxStr = {
  extraSmall: `${IconSizeToPx.extraSmall}px`,
  small: `${IconSizeToPx.small}px`,
  medium: `${IconSizeToPx.medium}px`,
  large: `${IconSizeToPx.large}px`,
  huge: `${IconSizeToPx.huge}px`,
  huge2: `${IconSizeToPx.huge2}px`,
  max: `${IconSizeToPx.max}px`,
};
const LucideIconWrapper = styled.div<{
  $iconColor?: string;
  $iconSize: SessionIconSize;
  $mirrorIt: boolean;
}>`
  font-family: Lucide;
  font-size: ${(props) => IconSizeToPxStr[props.$iconSize]};
  color: ${(props) => props.$iconColor};
  align-content: center;
  ${(props) => props.$mirrorIt && 'display: inline-block;  transform: scaleX(-1);'}
  user-select: none;
`;

export type LucideIconProps = WithLucideUnicode & {
  iconColor?: string;
  iconSize: SessionIconSize;
  style?: CSSProperties;
  ariaLabel?: string;
  className?: string;
};

/**
 * This is a wrapper around Lucide icons with unicode.
 */
export const LucideIcon = ({
  unicode,
  iconColor,
  iconSize,
  style,
  ariaLabel,
  className,
}: LucideIconProps) => {
  return (
    <LucideIconWrapper
      $iconColor={iconColor}
      $iconSize={iconSize}
      style={{ ...style, lineHeight: 1 }}
      aria-label={ariaLabel}
      $mirrorIt={false}
      className={className}
    >
      {unicode}
    </LucideIconWrapper>
  );
};
