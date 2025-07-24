import Document, { type DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { getLangDir } from 'rtl-detect';

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
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
