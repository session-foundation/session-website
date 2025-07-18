import { Block, Inline } from '@contentful/rich-text-types';
import { CSSProperties, ReactElement } from 'react';

import EmbedContent from '@/components/EmbedContent';
import Image from 'next/legacy/image';
import Link from 'next/link';
import classNames from 'classnames';
import sanitize from '@/utils/sanitize';
import { useScreen } from '@/contexts/screen';

function Markup(node: any): ReactElement {
  const frontTags: string[] = [];
  const endTags: string[] = [];
  const styles: any = {};

  if (node.color) {
    styles.color = sanitize(node.color);
  }

  frontTags.push(
    node.strikethrough && '<s>',
    node.subscript && '<sub>',
    node.superscript && '<sup>'
  );
  endTags.push(
    node.strikethrough && '</s>',
    node.subscript && '</sub>',
    node.superscript && '</sup>'
  );

  let htmlContent = frontTags.join('') + node.content + endTags.join('');
  htmlContent = sanitize(htmlContent);
  return (
    <span dangerouslySetInnerHTML={{ __html: htmlContent }} style={styles} />
  );
}

function EmbeddedLink(
  node: any,
  isInline = false,
  textDirection: string
): ReactElement {
  const figureClasses = [
    isInline && node.position === 'left' && 'md:float-left',
    isInline && node.position === 'right' && 'md:float-right',
    isInline && node.position && 'md:w-3/5 lg:w-1/2',
  ];
  const inlineClasses = [
    isInline && !node.position && 'inline-block align-middle mx-1',
  ];
  const captionClasses = [...inlineClasses, !isInline && 'pb-4'];
  return (
    <figure className={classNames(figureClasses)}>
      <EmbedContent
        textDirection={textDirection}
        content={node.meta}
        classes={classNames(inlineClasses)}
      />
      {node.caption && (
        <figcaption dir={textDirection} className={classNames(captionClasses)}>
          <em>{node.caption}</em>
        </figcaption>
      )}
    </figure>
  );
}

function EmbeddedMedia(
  node: any,
  isInline = false,
  textDirection: string
): ReactElement {
  const { isSmall, isMedium } = useScreen();
  // is either an asset or entry
  const media = node.file.fields ?? node;
  const url = media.file.url.replace('//', 'https://');
  switch (media.file.contentType) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
    case 'image/svg+xml':
      const imageWidth = node.width ?? media.file.details.image.width;
      const imageHeight = node.height ?? media.file.details.image.height;
      const figureClasses = [
        isInline && node.position && ' text-center mx-auto mt-4 mb-8 md:mx-4',
        isInline && !node.position && 'inline-block align-middle mx-1',
        isInline && node.position === 'left' && 'md:float-left',
        isInline && node.position === 'right' && 'md:float-right',
        !isInline && textDirection === 'ltr' && 'text-center mb-8',
        !isInline &&
          textDirection === 'rtl' &&
          'flex flex-col items-center mb-8',
      ];
      const captionClasses = [
        !node.position && 'mt-1',
        isInline &&
          !node.position &&
          'text-center md:inline-block md:align-middle md:mx-1',
      ];
      const figureStyles: CSSProperties = {};
      if (!isSmall && node.position) {
        figureStyles.width = imageWidth;
      }
      return (
        <span className={classNames(figureClasses)} style={figureStyles}>
          <figure dir={textDirection}>
            <Image
              src={`${url}${isSmall ? '?w=300' : isMedium ? '?w=600' : ''}`}
              alt={node.title}
              width={imageWidth}
              height={imageHeight}
              priority={true}
            />
            {node.caption && (
              <figcaption className={classNames(captionClasses)}>
                <em>
                  {node.sourceUrl ? (
                    <Link
                      href={node.sourceUrl}
                      aria-label={node.caption}
                      className={classNames(
                        'text-primary-dark font-extralight'
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {node.caption}
                    </Link>
                  ) : (
                    <>{node.caption}</>
                  )}
                </em>
              </figcaption>
            )}
          </figure>
        </span>
      );
    default:
      return <></>;
  }
}

interface IEmbedEntry {
  node: Block | Inline;
  isInline?: boolean;
}

export function renderEmbeddedEntry(props: IEmbedEntry, textDirection: string) {
  const { node, isInline = false } = props;
  const target = node.data.target;
  const asset = target.fields;
  if (target.sys.contentType && target.sys.contentType.sys.id === 'markup') {
    return Markup(asset);
  }
  if (!asset.file) {
    return EmbeddedLink(asset, isInline, textDirection);
  } else {
    return EmbeddedMedia(asset, isInline, textDirection);
  }
}
