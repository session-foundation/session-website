import classNames from 'classnames';
import type { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import Container from '@/components/Container';
import Accordion from '@/components/ui/Accordion';
import Headline from '@/components/ui/Headline';
import Layout from '@/components/ui/Layout';
import { CMS } from '@/constants';
import METADATA from '@/constants/metadata';
import { fetchFAQItems, generateLinkMeta } from '@/services/cms';
import type { IFAQItem, IFAQList } from '@/types/cms';
import capitalize from '@/utils/capitalize';

interface Props {
  entries: IFAQList;
  total: number;
}

function parseContent(content: IFAQItem['answer']['content']) {
  let str = '';

  for (let i = 0; i < content.length; i++) {
    const block = content[i].content;
    for (let j = 0; j < block.length; j++) {
      const item = block[j];
      if (item.nodeType === 'text') {
        str += item.value;
      } else if (item.nodeType === 'hyperlink') {
        str += `${item.data.uri} `;
      }
    }
  }

  return str;
}

const generateFAQStructuredData = (faqItems: IFAQList) => {
  const mainEntity = [];

  for (const category of Object.keys(faqItems)) {
    for (const faqItem of faqItems[category]) {
      mainEntity.push({
        '@type': 'Question',
        name: faqItem.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: parseContent(faqItem.answer.content),
        },
      });
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mainEntity,
  };
};

export default function FAQ(props: Props): ReactElement {
  const { entries: faqItems } = props;
  const router = useRouter();
  const slug = router.asPath.indexOf('#') >= 0 && router.asPath.split('#')[1];
  const headingClasses = classNames('text-3xl font-semibold mb-5');
  const renderFAQList = (() => {
    const content = [];
    for (const key of Object.keys(faqItems)) {
      content.push(
        <div key={key} className="mb-10">
          <h2 className={headingClasses}>{capitalize(key, '/')}</h2>
          <div>
            {faqItems[key].map((faqItem: IFAQItem) => {
              return (
                <Accordion
                  key={faqItem.id}
                  id={faqItem.slug ?? ''}
                  question={faqItem.question}
                  answer={faqItem.answer}
                  expand={!slug ? false : slug === faqItem.slug}
                />
              );
            })}
          </div>
        </div>
      );
    }
    return content;
  })();

  const faqStructuredData = generateFAQStructuredData(faqItems);

  return (
    <Layout
      title="Frequently Asked Questions"
      metadata={METADATA.FAQ_PAGE}
      structuredData={[JSON.stringify(faqStructuredData)]}
    >
      <section>
        <Headline
          color="gray-dark"
          classes={classNames(
            'text-lg font-mono pt-12 pb-4 justify-center',
            'md:mx-0 md:justify-start',
            'lg:pt-4 lg:pb-10'
          )}
          containerWidths={{
            small: '100%',
            medium: '34rem',
            large: '67rem',
          }}
        >
          <h1>Frequently Asked Questions</h1>
        </Headline>
        <Container classes={classNames('pt-0 px-4 pb-8', 'lg:pb-12')}>{renderFAQList}</Container>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (_context: GetStaticPropsContext) => {
  const { entries: _entries, total } = await fetchFAQItems();

  // divide up faqs by tags
  const entries: IFAQList = {};

  for (const entry of _entries) {
    entry.answer = await generateLinkMeta(entry.answer);
    if (!entries[entry.tag]) {
      entries[entry.tag] = [];
    }

    entries[entry.tag].push(entry);
  }

  return {
    props: {
      entries,
      total,
    },
    revalidate: CMS.CONTENT_REVALIDATE_RATE,
  };
};
