import { cva, type VariantProps } from 'class-variance-authority';
import cn from 'classnames';
import type { ReactNode } from 'react';
import { CopyToClipboardButton, type CopyToClipboardButtonProps } from './CopyToClipboardButton';

const displayVariants = cva(
  'flex w-full break-all rounded-md border py-2 pr-10 pl-3 font-normal text-sm',
  {
    variants: {
      variant: {
        dark: 'border-white bg-black text-white',
        light: 'border-black bg-background text-black',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
);

export type DisplayVariantProps = VariantProps<typeof displayVariants>;

type DivWithEndAdornmentProps = DisplayVariantProps & {
  className?: string;
  children?: ReactNode;
  endAdornment?: ReactNode;
};

function DivWithEndAdornment({
  className,
  variant,
  children,
  endAdornment,
}: DivWithEndAdornmentProps) {
  return (
    <div className="relative w-full">
      <div className={cn(displayVariants({ variant, className }))}>{children}</div>
      <div className="absolute top-0 right-0 flex h-full items-center">{endAdornment}</div>
    </div>
  );
}

export type CopyableInputDisplayProps = DisplayVariantProps & {
  value?: string;
  className?: string;
  copyToClipboardProps: CopyToClipboardButtonProps;
};

function CopyableInputDisplay({
  className,
  variant,
  value,
  copyToClipboardProps,
}: CopyableInputDisplayProps) {
  return (
    <DivWithEndAdornment
      variant={variant}
      className={className}
      endAdornment={
        <div className="flex items-center pe-2">
          <CopyToClipboardButton {...copyToClipboardProps} />
        </div>
      }
    >
      {value}
    </DivWithEndAdornment>
  );
}

CopyableInputDisplay.displayName = 'CopyableInputDisplay';

export { CopyableInputDisplay, DivWithEndAdornment };
