import { IEmbed, INoembed, isNoembed } from '@/services/embed';
import { ReactElement, useEffect, useRef, useState } from 'react';

import Image from 'next/legacy/image';
import Link from 'next/link';
import { TOS } from '@/constants';
import classNames from 'classnames';
import Button from '@/components/ui/Button';

interface Props {
  content: IEmbed | INoembed; // is sanitized in embed service
  classes?: string;
  textDirection: string;
}

export default function EmbedContent(props: Props): ReactElement {
  const { content, classes, textDirection } = props;
  const htmlRef = useRef<HTMLDivElement>(null);
  const [allowExternalContent, setAllowExternalContent] = useState(false);

  useEffect(() => {
    if (isNoembed(content) && null !== htmlRef.current) {
      htmlRef.current.innerHTML = content.html;
    }
    if (allowExternalContent) {
      if (isNoembed(content) && null !== htmlRef.current) {
        htmlRef.current.innerHTML = content.html;
      }
    }
  }, [allowExternalContent, content]);

  if (isNoembed(content)) {
    if (content.isExternalVideo) {
      return allowExternalContent ? (
        <div
          className={classNames('embed-content', classes)}
          ref={htmlRef}
        ></div>
      ) : (
        <div
          className={classNames(
            'embed-content bg-white w-full border border-gray-300 my-6 mx-auto max-w-sm p-6'
          )}
        >
          <p
            className={classNames('text-black font-bold mb-2 leading-relaxed')}
          >
            This content is hosted by {content.site_name}.
          </p>
          <p
            className={classNames(
              'text-sm text-gray-500 font-normal leading-relaxed mb-4'
            )}
          >
            By showing the external content you accept their{' '}
            {TOS[content.site_name] && TOS[content.site_name].length > 0 ? (
              <a
                href={TOS[content.site_name]}
                target="_blank"
                rel="noreferrer"
                className={classNames('text-primary-dark')}
              >
                Terms and Conditions
              </a>
            ) : (
              'Terms and Conditions'
            )}
            .
          </p>
          <div
            data-video-site={content.site_name}
            className="showExternalVideoButton"
          >
            <Button
              fontWeight="bold"
              size="large"
              onClick={() => {
                setAllowExternalContent(true);
              }}
              classes={'block ml-auto'}
            >
              Show
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={classNames('embed-content', classes)}
          ref={htmlRef}
        ></div>
      );
    }
  } else {
    return (
      <Link href={content.url} dir={textDirection} target="_blank">
        <div
          className={classNames(
            'embed-content',
            'bg-white border border-gray-300 my-6 mx-auto max-w-sm',
            classes
          )}
        >
          {content.image && (
            <div className={classNames('relative w-full h-36', 'md:h-48')}>
              <Image
                src={content.image}
                alt="link thumbnail image"
                layout="fill"
                priority={true}
                className={classNames('object-cover')}
              />
            </div>
          )}
          <div className={classNames('p-3 text-black text-sm')}>
            <p
              className={classNames('font-bold')}
              dangerouslySetInnerHTML={{ __html: content.title }}
            />
            {content.description && (
              <p dangerouslySetInnerHTML={{ __html: content.description }} />
            )}
            {content.site_name && (
              <p
                className={classNames('text-gray-500 font-normal')}
                dangerouslySetInnerHTML={{ __html: content.site_name }}
              />
            )}
          </div>
        </div>
      </Link>
    );
  }
}
