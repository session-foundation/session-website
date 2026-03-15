'use client';

import cn from 'classnames';
import { CheckIcon, Copy as ClipboardIcon } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef, useState } from 'react';
import { Button } from './button';

export interface CopyToClipboardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
  copyToClipboardToastMessage?: string;
  onCopyComplete?: () => void;
}

const CopyToClipboardButton = forwardRef<HTMLButtonElement, CopyToClipboardButtonProps>(
  ({ textToCopy, copyToClipboardToastMessage, className, ...props }, ref) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleClick = async () => {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    };

    return (
      <Button
        onClick={handleClick}
        variant="ghost"
        rounded={'md'}
        className={cn('select-all p-0', className)}
        ref={ref}
        {...props}
      >
        {isCopied ? (
          <CheckIcon className="h-5 w-5 stroke-primary" />
        ) : (
          <ClipboardIcon className="h-5 w-5 stroke-[#000000]" />
        )}
      </Button>
    );
  }
);
CopyToClipboardButton.displayName = 'CopyToClipboardButton';

export { CopyToClipboardButton };
