import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import Container from '@/components/Container';
import type { MetadataLocaleKey } from '@/components/CustomHead';
import Layout from '@/components/ui/Layout';
import type { IMetadata } from '@/constants/metadata';

type RedirectPageProps = {
  redirectUrl: string;
  localeKey?: MetadataLocaleKey;
  metadata?: IMetadata;
};

export default function RedirectPage({ redirectUrl, localeKey, metadata }: RedirectPageProps) {
  const router = useRouter();
  const t = useTranslations('redirect');

  useEffect(() => {
    router.push(redirectUrl);
  }, [router, redirectUrl]);

  return (
    <Layout localeKey={localeKey} metadata={metadata}>
      <section>
        <Container
          heights={{
            small: '100vh - 108px',
            medium: '50vh',
            large: '40vh',
            huge: '50vh',
            enormous: '50vh',
          }}
          classes={classNames(
            'py-16 px-2 mx-auto text-center',
            'md:flex md:flex-col md:justify-center md:items-center'
          )}
        >
          <h1 className={classNames('mb-8 font-bold text-5xl text-primary-dark')}>
            {t('heading')}
          </h1>
          <p className={classNames('font-medium text-gray text-xl', 'lg:text-2xl')}>
            {t.rich('content', {
              button: (chunk) => (
                <button
                  type="button"
                  className="font-semibold text-primary-dark"
                  onClick={() => router.back()}
                >
                  {chunk}
                </button>
              ),
            })}
          </p>
        </Container>
      </section>
    </Layout>
  );
}
