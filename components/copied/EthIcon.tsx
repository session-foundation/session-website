import { forwardRef } from 'react';
import type { SVGAttributes } from './types';

export const EthIcon = forwardRef<SVGSVGElement, SVGAttributes>((props, ref) => (
  <svg
    width="34"
    height="55"
    viewBox="0 0 34 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    ref={ref}
  >
    <path
      d="M16.7488 0.0180664L16.3867 1.24882V36.9623L16.7488 37.3238L33.3266 27.5247L16.7488 0.0180664Z"
      fill="#343434"
    />
    <path
      d="M16.7458 0.0180664L0.167969 27.5247L16.7458 37.3239V19.9896V0.0180664Z"
      fill="#8C8C8C"
    />
    <path
      d="M16.7431 40.4631L16.5391 40.7119V53.4338L16.7431 54.0299L33.3308 30.6689L16.7431 40.4631Z"
      fill="#3C3C3B"
    />
    <path d="M16.7458 54.0299V40.4631L0.167969 30.6689L16.7458 54.0299Z" fill="#8C8C8C" />
    <path d="M16.7461 37.3245L33.3236 27.5255L16.7461 19.9905V37.3245Z" fill="#141414" />
    <path d="M0.167969 27.5255L16.7455 37.3245V19.9905L0.167969 27.5255Z" fill="#393939" />
  </svg>
));
