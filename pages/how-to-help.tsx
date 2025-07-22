import Image from 'next/legacy/image';
import type { ReactElement } from 'react';
import CustomHead from '@/components/CustomHead';
import { METADATA } from '@/constants';

export default function HowToHelpPage(): ReactElement {
  return (
    <>
      <CustomHead title={'How you can help'} metadata={METADATA.HELP_PAGE} />
      <Image
        src="/assets/images/help.png"
        alt="How you can help graphic"
        width={1048}
        height={2418}
      />
    </>
  );
}
