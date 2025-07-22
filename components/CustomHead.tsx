/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Used as expected */
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import METADATA, { type IMetadata } from '@/constants/metadata';
import { isLocal } from '@/utils/links';

interface Props {
  title?: string;
  metadata?: IMetadata;
  structuredData?: Array<string>;
}

export default function CustomHead(props: Props): ReactElement {
  const router = useRouter();
  const { title, metadata, structuredData } = props;
  const pageTitle =
    title && title.length > 0 ? `${title} - Session Private Messenger` : METADATA.TITLE;
  const pageUrl = `${METADATA.HOST_URL}${router.asPath}`;
  const imageALT = metadata?.OG_IMAGE?.ALT ?? METADATA.OG_IMAGE.ALT;
  let imageWidth = metadata?.OG_IMAGE?.WIDTH ?? METADATA.OG_IMAGE.WIDTH;
  let imageHeight = metadata?.OG_IMAGE?.HEIGHT ?? METADATA.OG_IMAGE.HEIGHT;
  let imageUrl = (() => {
    if (!metadata?.OG_IMAGE?.URL) return `${METADATA.HOST_URL}${METADATA.OG_IMAGE.URL}`;
    if (metadata?.OG_IMAGE?.URL && isLocal(metadata.OG_IMAGE.URL)) {
      return `${METADATA.HOST_URL}${metadata.OG_IMAGE.URL}`;
    } else {
      return `${metadata?.OG_IMAGE?.URL}`;
    }
  })();

  // Decrease image dimensions so link previews work on Telegram
  if (imageWidth > 3000) {
    imageHeight = Math.floor(imageHeight / 2);
    imageWidth = Math.floor(imageWidth / 2);
    imageUrl = `${imageUrl}?w=${imageWidth}`;
  }

  const tags = metadata?.TAGS ? metadata?.TAGS : METADATA.TAGS;
  const renderTags = (() => {
    const keywords = <meta key="keywords" name="keywords" content={tags.join(' ')} />;
    if (metadata?.TYPE !== 'article') return keywords;
    return (
      <>
        {tags.map((tag) => {
          return (
            <meta key={`article:tag-${pageUrl}-${tag}`} property="article:tag" content={tag} />
          );
        })}
        <meta
          key="article:section"
          property="article:section"
          content={metadata?.ARTICLE_SECTION ?? METADATA.TAGS[0]}
        />
        {metadata?.PUBLISHED_TIME && (
          <meta
            key="article:published_time"
            property="article:published_time"
            content={metadata?.PUBLISHED_TIME}
          />
        )}
        {keywords}
      </>
    );
  })();
  const renderLdJSON = (() => {
    const ldjson = `{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "${METADATA.HOST_URL}/#website",
        "url": "${pageUrl}",
        "name": "${METADATA.SITE_NAME}",
        "description": "${METADATA.DESCRIPTION}"
      },
      {
        "@type": "ImageObject",
        "@id": "${pageUrl}#primaryimage",
        "url": "${imageUrl}",
        "width": "${imageWidth}",
        "height": "${imageHeight}",
      },
      {
        "@type": "WebPage",
        "@id": "${pageUrl}#webpage",
        "url": "${pageUrl}",
        "inLanguage": "${METADATA.LOCALE}",
        "name": "${pageTitle}",
        "isPartOf": { "@id": "${METADATA.HOST_URL}/#website" },
        "primaryImageOfPage": {
          "@id": "${pageUrl}#primaryimage"
        },
        "datePublished": "${metadata?.PUBLISHED_TIME ?? ''}",
        "description": "${METADATA.DESCRIPTION}"
      }
    ]
  }`;
    return (
      <script
        key={`ldjson-${pageUrl}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldjson }}
      />
    );
  })();
  return (
    <Head>
      <title key={pageTitle}>{pageTitle}</title>
      <meta key="utf-8" charSet="utf-8" />
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
      <meta
        key="description"
        name="description"
        content={metadata?.DESCRIPTION ?? METADATA.DESCRIPTION}
      />
      <meta
        key="robots"
        name="robots"
        content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
      />
      <meta
        key="googlebot"
        name="googlebot"
        content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
      />
      <meta key="og:url" property="og:url" content={pageUrl} />
      <meta key="og:title" property="og:title" content={pageTitle} />
      <meta key="og:type" property="og:type" content={metadata?.TYPE ?? METADATA.OG_TYPE} />
      <meta
        key="og:description"
        property="og:description"
        content={metadata?.DESCRIPTION ?? METADATA.DESCRIPTION}
      />
      <meta key="og:image" property="og:image" content={imageUrl} />
      <meta key="og:image:secure_url" property="og:image:secure_url" content={imageUrl}></meta>
      <meta key="og:image:alt" property="og:image:alt" content={imageALT} />
      <meta key="og:image:width" property="og:image:width" content={String(imageWidth)} />
      <meta key="og:image:height" property="og:image:height" content={String(imageHeight)} />
      <meta key="og:locale" property="og:locale" content={METADATA.LOCALE} />
      <meta key="og:site_name" property="og:site_name" content={METADATA.SITE_NAME} />
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={pageTitle} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={metadata?.DESCRIPTION ?? METADATA.DESCRIPTION}
      />
      <meta key="twitter:image" name="twitter:image" content={imageUrl} />
      <meta key="twitter:site" name="twitter:site" content={METADATA.HOST_URL} />
      <meta key="twitter:creator" name="twitter:creator" content={METADATA.TWITTER_CREATOR} />
      <meta key="apple-itunes-app" name="apple-itunes-app" content={METADATA.ITUNES_ID} />
      <meta
        key="msapplication-TileColor"
        name="msapplication-TileColor"
        content={METADATA.MSAPPLICATION_TILECOLOR}
      />
      <meta key="theme-color" name="theme-color" content={METADATA.THEME_COLOR} />
      {renderTags}
      <link key="canonical" rel="canonical" href={`${METADATA.HOST_URL}${router.asPath}`} />
      <link
        key="image/png32x32"
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={METADATA.FAVICON.MEDIUM}
      />
      <link
        key="image/png16x16"
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={METADATA.FAVICON.SMALL}
      />
      <link
        key="apple-touch-icon"
        rel="apple-touch-icon"
        sizes="180x180"
        href={METADATA.FAVICON.APPLE_TOUCH_ICON}
      />
      <link key="manifest" rel="manifest" href={METADATA.MANIFEST} />
      <link
        key="mask-icon"
        rel="mask-icon"
        href={METADATA.MASK_ICON.PATH}
        color={METADATA.MASK_ICON.COLOR}
      />
      <link key="shortlink" rel="shortlink" href={METADATA.HOST_URL} />
      <link key="/feed" rel="alternative" type="application/rss+xml" href="/feed" />
      <link key="/feed/atom" rel="alternative" type="application/atom+xml" href="/feed/atom" />
      <link key="/feed/json" rel="alternative" type="application/feed+json" href="/feed/json" />
      <link
        rel="preload"
        href="/assets/fonts/PublicSans/PublicSans-VariableFont_wght.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/assets/fonts/SpaceMono/SpaceMono-Regular.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      {metadata?.TYPE === 'article' && renderLdJSON}
      {structuredData?.map((data, i) => (
        <script
          // biome-ignore lint/suspicious/noArrayIndexKey: No consistent key
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: data,
          }}
        />
      ))}
    </Head>
  );
}
