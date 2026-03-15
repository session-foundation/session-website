import type en from './locales/en.json';

type Messages = typeof en;

declare module 'next-intl' {
  interface AppConfig {
    // ...
    Messages: Messages;
  }
}
