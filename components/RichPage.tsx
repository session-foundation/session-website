import { ReactElement } from 'react';
import classNames from 'classnames';

import { IPage } from '@/types/cms';
import Container from '@/components/Container';
import Layout from '@/components/ui/Layout';
import Headline from '@/components/ui/Headline';
import RichBody from '@/components/RichBody';

interface Props {
  page: IPage;
}

export default function RichPage(props: Props): ReactElement {
  const { page } = props;
  const pageTitle = page ? page.title : '';
  return (
    <Layout title={pageTitle}>
      <section>
        {page?.headline && (
          <Headline
            color="gray-dark"
            classes={classNames(
              'font-mono font-medium pt-16',
              'lg:pt-4 lg:pb-10'
            )}
            containerWidths={{
              small: '10rem',
              medium: '34rem',
              large: '768px',
            }}
          >
            {page.headline}
          </Headline>
        )}
        <Container classes={classNames('pt-0 px-4 pb-24', 'lg:pb-32')}>
          <div className={'lg:max-w-screen-md lg:mx-auto'}>
            <RichBody
              body={page?.body}
              headingClasses={'text-gray font-medium mt-6'}
              classes={classNames(
                'text-sm text-gray-lighter font-helvetica leading-loose',
                'lg:text-base'
              )}
            />
          </div>
        </Container>
      </section>
    </Layout>
  );
}
