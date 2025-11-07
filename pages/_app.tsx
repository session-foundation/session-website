import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextIntlClientProvider } from 'next-intl';
import { ScreenProvider } from '@/contexts/screen';

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const axe = require('@axe-core/react');
  axe(React, ReactDOM, 1000, {});
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <NextIntlClientProvider
      locale={router.locale}
      messages={pageProps.messages}
      timeZone={timeZone}
    >
      <ScreenProvider>
        <Component {...pageProps} />
      </ScreenProvider>
    </NextIntlClientProvider>
  );
}

export default MyApp;
