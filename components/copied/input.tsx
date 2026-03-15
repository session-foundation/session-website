import { cva, type VariantProps } from 'class-variance-authority';
import cn from 'classnames';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border py-2 pr-3 pl-3 font-normal text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        dark: 'border-white bg-black focus-visible:ring-white',
        light: 'border-black bg-background focus-visible:ring-black',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
);

export type InputVariantProps = VariantProps<typeof inputVariants>;

export type InputProps = InputHTMLAttributes<HTMLInputElement> & InputVariantProps;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export type InputWithEndAdornmentProps = InputProps & {
  endAdornment?: ReactNode;
};

const InputWithEndAdornment = forwardRef<HTMLInputElement, InputWithEndAdornmentProps>(
  ({ className, type, variant, endAdornment, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          type={type}
          className={cn(inputVariants({ variant, className }), 'w-full')}
          ref={ref}
          {...props}
        />
        <div className={cn('absolute top-0 right-0 flex h-full items-center')}> {endAdornment}</div>
      </div>
    );
  }
);
InputWithEndAdornment.displayName = 'InputWithEndAdornment';

export { Input, InputWithEndAdornment };
