import classNames from 'classnames';
import Container from '@/components/Container';

export default function LockedPage() {
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
        <h1 className={classNames('mb-8 font-bold text-5xl text-primary-dark')}>
          You don&apos;t have access to this page.
        </h1>
      </Container>
    </section>
  );
}
