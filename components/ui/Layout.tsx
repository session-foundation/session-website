import type { Messages } from 'next-intl';
import { type ReactElement, type ReactNode } from 'react';
import CustomHead from '@/components/CustomHead';
import Footer from '@/components/navigation/Footer';
import Nav from '@/components/navigation/Nav';
import EmailSignup from '@/components/sections/EmailSignup';
import Banner from '@/components/ui/Banner';
import type { IMetadata } from '@/constants/metadata';

interface Props {
  localeKey?: keyof Messages['metadata'];
  title?: string;
  metadata?: IMetadata;
  children: ReactNode;
  showBanner?: boolean;
  structuredData?: Array<string>;
}

export default function Layout({
  localeKey,
  title,
  metadata,
  children,
  structuredData,
  showBanner = false,
}: Props): ReactElement {
  return (
    <>
      <CustomHead
        localeKey={localeKey}
        title={title}
        metadata={metadata}
        structuredData={structuredData}
      />
      {showBanner ? <Banner /> : null}
      <Nav />
      <main>{children}</main>
      <EmailSignup />
      <Footer />
    </>
  );
}
