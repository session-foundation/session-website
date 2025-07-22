import classNames from 'classnames';
import { useRouter } from 'next/router';
import Container from '@/components/Container';

export default function RedirectPage() {
  const router = useRouter();
  return (
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
        <h1 className={classNames('mb-8 font-bold text-5xl text-primary-dark')}>Redirecting...</h1>
        <p className={classNames('font-medium text-gray text-xl', 'lg:text-2xl')}>
          Click{' '}
          <button
            type="button"
            className="font-semibold text-primary-dark"
            onClick={() => router.back()}
          >
            here
          </button>{' '}
          to return to the previous page.
        </p>
      </Container>
    </section>
  );
}
