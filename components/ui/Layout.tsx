import { useRouter } from 'next/router';
import { type ReactElement, type ReactNode, useMemo } from 'react';
import CustomHead from '@/components/CustomHead';
import LockedPage from '@/components/LockedPage';
import Footer from '@/components/navigation/Footer';
import Nav from '@/components/navigation/Nav';
import EmailSignup from '@/components/sections/EmailSignup';
import Banner from '@/components/ui/Banner';
import type { IMetadata } from '@/constants/metadata';

interface Props {
  title?: string;
  metadata?: IMetadata;
  children: ReactNode;
  showBanner?: boolean;
  structuredData?: Array<string>;
}

export default function Layout({
  title,
  metadata,
  children,
  structuredData,
  showBanner = false,
}: Props): ReactElement {
  const router = useRouter();

  const locked = useMemo(
    () =>
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PUBLIC_SITE_ENV === 'development' &&
      !router.isPreview,
    [router.isPreview]
  );

  return (
    <>
      <CustomHead title={title} metadata={metadata} structuredData={structuredData} />
      {showBanner ? <Banner /> : null}
      <Nav />
      {locked ? <LockedPage /> : <main className="min-h-screen">{children}</main>}
      <EmailSignup />
      <Footer />
    </>
  );
}
