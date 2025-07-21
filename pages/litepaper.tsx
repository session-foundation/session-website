import { ReactElement, useEffect } from 'react';

import Layout from '@/components/ui/Layout';
import { METADATA } from '@/constants';
import RedirectPage from '@/components/RedirectPage';
import { useRouter } from 'next/router';

export default function Litepaper(): ReactElement {
  const router = useRouter();

  useEffect(() => {
    router.push('/litepaper/pdf');
  }, [router]);

  return (
    <Layout title="Litepaper" metadata={METADATA.LITEPAPER_PAGE}>
      <RedirectPage />
    </Layout>
  );
}
