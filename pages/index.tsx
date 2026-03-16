import type { GetStaticProps, GetStaticPropsContext } from 'next';
import About from '@/components/sections/About';
import Benefits from '@/components/sections/Benefits';
import Features from '@/components/sections/Features';
import Hero from '@/components/sections/Hero';
import Layout from '@/components/ui/Layout';

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
  return {
    props: { messages: (await import(`../locales/${_context.locale}.json`)).default },
  };
};
