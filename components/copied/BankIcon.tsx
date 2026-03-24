import { forwardRef } from 'react';
import type { SVGAttributes } from './types';

export const BankIcon = forwardRef<SVGSVGElement, SVGAttributes>((props, ref) => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    ref={ref}
  >
    <path fill="#66757F" d="M3 16h30v18H3z"></path>
    <path fill="#CCD6DD" d="M2 34h32a2 2 0 0 1 2 2H0a2 2 0 0 1 2-2z"></path>
    <path fill="#292F33" d="M18 23a3 3 0 0 0-3 3v6h6v-6a3 3 0 0 0-3-3z"></path>
    <path fill="#CCD6DD" d="M3 21h4v11H3zm6 0h4v11H9zm20 0h4v11h-4zm-6 0h4v11h-4z"></path>
    <path fill="#AAB8C2" d="M2 32h32v2H2z"></path>
    <path fill="#66757F" d="M36 11L18 0L0 11z"></path>
    <path fill="#CCD6DD" d="M18 2.4L2 12v4h32v-4z"></path>
    <path fill="#8899A6" d="M3 19h4v2H3zm6 0h4v2H9zm14 0h4v2h-4zm6 0h4v2h-4z"></path>
    <path fill="#CCD6DD" d="M1 12h34v5H1z"></path>
    <path
      fill="#AAB8C2"
      d="M36 12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h34a1 1 0 0 1 1 1v1zm0 6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h34a1 1 0 0 1 1 1v1z"
    ></path>
    <path fill="#E1E8ED" d="M13 32h10v2H13z"></path>
    <path fill="#F5F8FA" d="M11 34h14v2H11z"></path>
  </svg>
));
