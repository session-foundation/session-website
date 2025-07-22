import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { documentToReactComponents, type Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, type Document, INLINES, type Inline, MARKS } from '@contentful/rich-text-types';
import classNames from 'classnames';
import { direction } from 'direction';
import Link from 'next/link';
/* eslint-disable react/display-name */
import { Children, cloneElement, type ReactElement } from 'react';
import SHORTCODES from '@/constants/shortcodes';
import { renderEmbeddedEntry } from '@/services/render';
import { hasLocalID, isLocal, parseUrl } from '@/utils/links';
import { renderShortcode } from '@/utils/shortcodes';

interface Props {
  body: Document;
  headingClasses?: string; // custom h1-h4 styles
  classes?: string; // custom styles for regular text (color, font weight, etc.)
}

interface NodeWithTextDirection {
  props: { dir: string; children: any };
}

const getDirection = (string: string) => {
  return direction(string) === 'neutral' ? 'auto' : direction(string);
};
const getTextDirectionFromNode = (children: NodeWithTextDirection[]) => {
  return typeof children[0] === 'object'
    ? recursiveTextDirectionFromNode(children[0])
    : children[0] === '' && typeof children[1] === 'object'
      ? recursiveTextDirectionFromNode(children[1])
      : getDirection(children[0]);
};

const recursiveTextDirectionFromNode = (obj: NodeWithTextDirection) => {
  if (obj?.props?.dir) {
    return obj.props.dir;
  } else if (typeof obj?.props?.children === 'string') {
    return getDirection(obj?.props?.children);
  } else if (Array.isArray(obj?.props?.children)) {
    recursiveTextDirectionFromNode(obj?.props?.children[0]);
  } else {
    recursiveTextDirectionFromNode(obj?.props?.children);
  }
};

export default function RichBody(props: Props): ReactElement {
  const { body, headingClasses, classes } = props;

  const options: Options = {
    renderMark: {
      [MARKS.BOLD]: (text: any) => {
        return (
          <span dir={getDirection(text)}>
            <strong dir={getDirection(text)} className="font-bold">
              {text}
            </strong>
          </span>
        );
      },
      [MARKS.ITALIC]: (text: any) => (
        <span dir={getDirection(text)}>
          <em dir={getDirection(text)} className="italic">
            {text}
          </em>
        </span>
      ),
      [MARKS.UNDERLINE]: (text: any) => (
        <span dir={getDirection(text)} className={classNames('underline')}>
          {text}
        </span>
      ),
      [MARKS.CODE]: (text: any) => (
        <code dir={getDirection(text)} className={classNames('font-mono tracking-wide')}>
          {text}
        </code>
      ),
    },
    renderNode: {
      [INLINES.HYPERLINK]: (node, children: any) => {
        const url = parseUrl(node.data.uri);
        return (
          <span dir={getDirection(children)}>
            <Link
              href={url}
              scroll={!isLocal(node.data.uri)}
              dir={getDirection(children)}
              aria-label={'Read more about this link'}
              className={classNames('text-primary-dark')}
              target={isLocal(node.data.uri) || url !== node.data.uri ? '_self' : '_blank'}
              rel="noreferrer"
            >
              {children}
            </Link>
          </span>
        );
      },
      [INLINES.EMBEDDED_ENTRY]: (node, _children) => {
        return renderEmbeddedEntry(
          { node: node as Inline, isInline: true },
          getDirection(node.data.target.fields.caption)
        );
      },
      [BLOCKS.PARAGRAPH]: (node, children: any) => {
        let hasImage = false;
        Children.map(children, (child: any) => {
          if (child.type === 'figure') {
            hasImage = true;
            return;
          }
        });
        if (hasImage) {
          return (
            <span
              style={{ display: 'block' }}
              dir={getDirection(children)}
              className={classNames('pb-6 leading-relaxed')}
            >
              {children}
            </span>
          );
        }
        const plaintext = documentToPlainTextString(node as Inline);
        const isShortcode = SHORTCODES.REGEX.test(plaintext);
        if (isShortcode) {
          return renderShortcode(plaintext);
        } else {
          return (
            <p
              dir={getTextDirectionFromNode(children)}
              className={classNames('pb-6 leading-relaxed')}
            >
              {children}
            </p>
          );
        }
      },
      [BLOCKS.HEADING_1]: (node, children: any) => (
        <h1
          dir={getDirection(children)}
          id={hasLocalID(node as Inline)}
          className={classNames('mb-5 text-3xl leading-snug', 'lg:text-5xl', headingClasses)}
        >
          {children}
        </h1>
      ),
      [BLOCKS.HEADING_2]: (node, children: any) => (
        <h2
          dir={getDirection(children)}
          id={hasLocalID(node as Inline)}
          className={classNames('mb-5 text-2xl leading-snug', 'lg:text-3xl', headingClasses)}
        >
          {children}
        </h2>
      ),
      [BLOCKS.HEADING_3]: (node, children: any) => (
        <h3
          dir={getDirection(children)}
          id={hasLocalID(node as Inline)}
          className={classNames('mb-2 text-xl leading-snug', 'lg:text-2xl', headingClasses)}
        >
          {children}
        </h3>
      ),
      [BLOCKS.HEADING_4]: (node, children: any) => (
        <h4
          dir={getDirection(children)}
          id={hasLocalID(node as Inline)}
          className={classNames('mb-2 text-md leading-snug', 'lg:text-xl', headingClasses)}
        >
          {children}
        </h4>
      ),
      [BLOCKS.HR]: (_node, _children) => (
        <hr className={classNames('mx-auto w-24 border-gray-300 pb-6')} />
      ),
      [BLOCKS.OL_LIST]: (_node, children: any) => {
        const textDirection =
          typeof children[0] === 'object'
            ? recursiveTextDirectionFromNode(children[0])
            : getDirection(children);

        return (
          <ol
            dir={textDirection}
            className={classNames('list-decimal pb-5', textDirection === 'rtl' ? 'mr-10' : 'ml-10')}
          >
            {children}
          </ol>
        );
      },
      [BLOCKS.UL_LIST]: (_node, children: any) => {
        const textDirection =
          typeof children[0] === 'object'
            ? recursiveTextDirectionFromNode(children[0])
            : getDirection(children);
        return (
          <ul
            dir={textDirection}
            className={classNames('list-disc pb-5', textDirection === 'rtl' ? 'mr-10' : 'ml-10')}
          >
            {children}
          </ul>
        );
      },
      [BLOCKS.LIST_ITEM]: (_node, children: any) => {
        const renderChildren = Children.map(children, (child: any) => {
          if (child.type === 'p') {
            const newProps = {
              ...child.props,
              className: 'leading-relaxed pb-1',
            };

            return cloneElement(child, newProps);
          }
        });

        return <li dir={getTextDirectionFromNode(children)}>{renderChildren}</li>;
      },
      [BLOCKS.QUOTE]: (_node, children: any) => (
        <div
          dir={getDirection(children)}
          className={classNames('mr-4 mb-6 ml-10 border-gray-100 border-l-6 px-4 py-6')}
        >
          <blockquote
            dir={getDirection(children)}
            className={classNames('-mb-6 text-base text-black italic', 'lg:text-lg')}
          >
            {children}
          </blockquote>
        </div>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node, _children) => {
        return renderEmbeddedEntry(
          { node: node as Inline },
          getDirection(node.data.target.fields.caption)
        );
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node, _children) => {
        return renderEmbeddedEntry(
          { node: node as Inline },
          getDirection(node.data.target.fields.caption)
        );
      },
    },
  };

  const richBody = documentToReactComponents(body, options);
  return <div className={classNames('rich-content', classes)}>{richBody}</div>;
}
