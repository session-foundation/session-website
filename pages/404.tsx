import classNames from 'classnames';
import Container from '@/components/Container';
import Layout from '@/components/ui/Layout';
import METADATA from '@/constants/metadata';

export default function Custom404() {
  return (
    <Layout title="Page not found" metadata={METADATA[404]}>
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
            This page doesn&apos;t seem to exist.
          </h1>
          <p className={classNames('font-medium text-gray text-xl', 'lg:text-2xl')}>
            {METADATA[404].DESCRIPTION}
          </p>
        </Container>
      </section>
    </Layout>
  );
}
