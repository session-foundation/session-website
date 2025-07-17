import { Footer, Nav } from '@/components/navigation';
import { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';

import { Banner } from '@/components/ui';
import CustomHead from '@/components/CustomHead';
import { EmailSignup } from '@/components/sections';
import { IMetadata } from '@/constants/metadata';
import LockedPage from '@/components/LockedPage';
import { useRouter } from 'next/router';

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
      <CustomHead
        title={title}
        metadata={metadata}
        structuredData={structuredData}
      />
      {showBanner ? <Banner /> : null}
      <Nav />
      {locked ? (
        <LockedPage />
      ) : (
        <main className="min-h-screen">{children}</main>
      )}
      <EmailSignup />
      <Footer />
    </>
  );
}
