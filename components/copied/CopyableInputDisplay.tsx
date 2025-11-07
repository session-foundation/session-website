import cn from 'classnames';
import { forwardRef } from 'react';
import { CopyToClipboardButton, type CopyToClipboardButtonProps } from './CopyToClipboardButton';
import { type InputProps, InputWithEndAdornment } from './input';

export type CopyableInputDisplayProps = InputProps & {
  copyToClipboardProps: CopyToClipboardButtonProps;
};

const CopyableInputDisplay = forwardRef<HTMLInputElement, CopyableInputDisplayProps>(
  ({ className, copyToClipboardProps, ...props }, ref) => {
    return (
      <InputWithEndAdornment
        {...props}
        ref={ref}
        className={cn(className, 'pe-9')}
        endAdornment={
          <div className="flex items-center pe-2">
            <CopyToClipboardButton {...copyToClipboardProps} />
          </div>
        }
      />
    );
  }
);

CopyableInputDisplay.displayName = 'CopyableInputDisplay';

export { CopyableInputDisplay };
