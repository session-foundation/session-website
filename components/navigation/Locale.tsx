import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLocale, useTranslations } from 'next-intl';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

function getLanguageDisplayName(locale: string) {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(locale);
  } catch {
    return locale.toUpperCase();
  }
}

export function LocaleDialogContent() {
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations('languageSelection');

  return (
    <DialogContent className="my-10 h-max px-0">
      <DialogHeader className="px-6">
        <DialogTitle id="language-selection-title">{t('title')}</DialogTitle>
      </DialogHeader>

      <DialogDescription className="sr-only">{t('description')}</DialogDescription>

      <ul className="max-h-[75vh] w-full space-y-2 overflow-y-auto px-6">
        {router.locales?.map((locale) => {
          const isCurrentLocale = locale === currentLocale;
          const languageName = getLanguageDisplayName(locale) ?? locale;

          return (
            <li key={locale}>
              <Link
                href={router.asPath}
                locale={locale}
                className={classNames(
                  'block w-full rounded-md px-4 py-3 text-left transition-colors duration-200 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  isCurrentLocale
                    ? 'bg-green-50 font-semibold text-primary-dark'
                    : 'text-gray-700 hover:text-gray-900'
                )}
                aria-current={isCurrentLocale ? 'page' : undefined}
                aria-label={t(isCurrentLocale ? 'aria.currentLanguage' : 'aria.switchToLanguage', {
                  language: languageName,
                })}
              >
                <span className="flex items-center justify-between">
                  <span className="font-medium">
                    {languageName}{' '}
                    <span className="font-mono text-sm uppercase opacity-70">({locale})</span>
                  </span>
                  {isCurrentLocale && (
                    <span className="sr-only">{t('aria.currentLanguageIndicator')}</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </DialogContent>
  );
}
