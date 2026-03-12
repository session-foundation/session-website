import Document, { type DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { getLangDir } from 'rtl-detect';
import StyledComponentsRegistry from '@/lib/registry';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const locale = this.props.locale || 'en';
    const direction = getLangDir(locale);

    return (
      <Html lang={locale} dir={direction}>
        <Head />
        <body className="antialiased selection:bg-primary">
          <StyledComponentsRegistry>
            <Main />
          </StyledComponentsRegistry>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
