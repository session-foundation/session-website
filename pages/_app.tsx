import '@/styles/globals.css';

import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
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

MyApp.getInitialProps = async (appContext: AppContext) => {
  // Call page's getInitialProps if it exists
  const appProps = await App.getInitialProps(appContext);

  const locale = appContext.ctx.locale || 'en';

  if (!appProps.pageProps.messages) {
    try {
      const messages = (await import(`../locales/${locale}.json`)).default;
      appProps.pageProps.messages = messages;
    } catch (error) {
      console.error(`Failed to load messages for locale: ${locale}`, error);

      try {
        const messages = (await import(`../locales/en.json`)).default;
        appProps.pageProps.messages = messages;
      } catch (fallbackError) {
        console.error('Failed to load fallback messages', fallbackError);
        appProps.pageProps.messages = {};
      }
    }
  }

  return appProps;
};
export default MyApp;
