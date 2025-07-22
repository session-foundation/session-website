import { useRouter } from 'next/router';
import { type ReactElement, useEffect } from 'react';
import RedirectPage from '@/components/RedirectPage';
import Layout from '@/components/ui/Layout';
import { METADATA } from '@/constants';

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
