import type { GetStaticProps, GetStaticPropsContext } from 'next';
import type { ReactElement } from 'react';
import RedirectPage from '@/components/RedirectPage';
import { METADATA } from '@/constants';

export default function Whitepaper(): ReactElement {
  return (
    <RedirectPage
      localeKey="whitepaper"
      metadata={METADATA.WHITEPAPER_PAGE}
      redirectUrl="https://arxiv.org/pdf/2002.04609.pdf"
    />
  );
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: { messages: (await import(`../locales/${context.locale}.json`)).default },
  };
};
