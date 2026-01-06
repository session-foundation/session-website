import type { GetStaticProps, GetStaticPropsContext } from 'next';
import About from '@/components/sections/About';
import Benefits from '@/components/sections/Benefits';
import Features from '@/components/sections/Features';
import Hero from '@/components/sections/Hero';
import Layout from '@/components/ui/Layout';
import { CMS } from '@/constants';
import generateRSSFeed from '@/utils/rss';

export default function Home() {
  return (
    <Layout localeKey="default">
      <Hero />
      <About />
      <Benefits />
      <Features />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (_context: GetStaticPropsContext) => {
  if (process.env.NEXT_PUBLIC_SITE_ENV !== 'development') {
    const { fetchAllBlogEntries } = await import('@/services/cms');
    const posts = await fetchAllBlogEntries();
    generateRSSFeed(posts);
  }

  return {
    props: { messages: (await import(`../locales/${_context.locale}.json`)).default },
    revalidate: CMS.CONTENT_REVALIDATE_RATE,
  };
};
