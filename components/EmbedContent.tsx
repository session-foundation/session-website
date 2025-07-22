/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Used as intended */
import classNames from 'classnames';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { type ReactElement, useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { TOS } from '@/constants';
import { type IEmbed, type INoembed, isNoembed } from '@/services/embed';

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
        <div className={classNames('embed-content', classes)} ref={htmlRef}></div>
      ) : (
        <div
          className={classNames(
            'embed-content mx-auto my-6 w-full max-w-sm border border-gray-300 bg-white p-6'
          )}
        >
          <p className={classNames('mb-2 font-bold text-black leading-relaxed')}>
            This content is hosted by {content.site_name}.
          </p>
          <p className={classNames('mb-4 font-normal text-gray-500 text-sm leading-relaxed')}>
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
          <div data-video-site={content.site_name} className="showExternalVideoButton">
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
      return <div className={classNames('embed-content', classes)} ref={htmlRef}></div>;
    }
  } else {
    return (
      <Link href={content.url} dir={textDirection} target="_blank">
        <div
          className={classNames(
            'embed-content',
            'mx-auto my-6 max-w-sm border border-gray-300 bg-white',
            classes
          )}
        >
          {content.image && (
            <div className={classNames('relative h-36 w-full', 'md:h-48')}>
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
            {content.description && <p dangerouslySetInnerHTML={{ __html: content.description }} />}
            {content.site_name && (
              <p
                className={classNames('font-normal text-gray-500')}
                dangerouslySetInnerHTML={{ __html: content.site_name }}
              />
            )}
          </div>
        </div>
      </Link>
    );
  }
}
