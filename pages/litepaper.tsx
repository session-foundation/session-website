import type { GetStaticProps, GetStaticPropsContext } from 'next';
import type { ReactElement } from 'react';
import RedirectPage from '@/components/RedirectPage';
import { METADATA } from '@/constants';

export default function Litepaper(): ReactElement {
  return (
    <RedirectPage
      localeKey="litepaper"
      metadata={METADATA.LITEPAPER_PAGE}
      redirectUrl="/assets/papers/Litepaper_Session_private_messenger.pdf"
    />
  );
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: { messages: (await import(`../locales/${context.locale}.json`)).default },
  };
};
