/** biome-ignore-all lint/a11y/useKeyWithClickEvents: TODO: refactor this to be more accessible */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: TODO: makes it work, but its not good, we want to remove the need to use js for this */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: TODO: refactor this to be more accessible */

import type { Document } from '@contentful/rich-text-types';
import classNames from 'classnames';
import Link from 'next/link';
import { type ReactElement, useEffect, useRef, useState } from 'react';
import { ReactComponent as LinkSVG } from '@/assets/svgs/link.svg';
import { ReactComponent as MinusSVG } from '@/assets/svgs/minus.svg';
import { ReactComponent as PlusSVG } from '@/assets/svgs/plus.svg';
import RichBody from '@/components/RichBody';

interface Props {
  id: string;
  question: string;
  answer: Document;
  expand?: boolean;
  classes?: string;
}

const handleNewHeight = (e: Event, container: HTMLElement, id: string) => {
  const oldHeight = Number(container?.style.height.slice(0, -2));
  if (document.querySelector(`#${id}container .showExternalVideoButton`) !== null) {
    const target = e.currentTarget as HTMLButtonElement;
    // adding the height of the video (500|240) - the height of the disappearing button's component (185.5) = 314.5|54.5
    const isYoutube = target.getAttribute('data-video-site') === 'YouTube';
    container.style.height = `${oldHeight + (isYoutube ? 314.5 : 54.5)}px`;
  }
};

export default function Accordion(props: Props): ReactElement {
  const { id, question, answer, expand, classes } = props;
  const content = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [height, setHeight] = useState(`${content?.current?.scrollHeight}px`);
  const [loaded, setLoaded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    setHeight(isExpanded ? '0px' : `${content?.current?.scrollHeight}px`);
  };
  const svgClasses = classNames('w-3 h-3 fill-current mb-1 mr-2');

  useEffect(() => {
    const buttons = window?.document.querySelectorAll('.showExternalVideoButton');
    const container = window?.document.getElementById(`${id}container`);

    if (!container) {
      return;
    }

    buttons.forEach((button) => {
      button?.addEventListener('click', (e: Event) => handleNewHeight(e, container, id));
    });

    return () => {
      buttons.forEach((button) => {
        button?.removeEventListener('click', (e: Event) => handleNewHeight(e, container, id));
      });
    };
  }, [id]);

  useEffect(() => {
    if (!expand) {
      handleExpand();
    } else {
      setHeight(`${content?.current?.scrollHeight}px`);
    }
    setLoaded(true);
  }, [expand]);

  useEffect(() => {
    if (loaded && expand) {
      handleExpand();
    }
  }, [expand, loaded]);

  return (
    <div
      id={id}
      className={classNames('border-gray-300 border-r border-l text-sm', 'first:border-t', classes)}
    >
      <div
        className={classNames(
          'border-gray-300 border-b px-4 py-2 font-bold',
          'lg:text-base',
          'transition-colors duration-700 ease-in-out',
          loaded && isExpanded ? 'bg-gray-dark text-primary' : 'bg-gray-100 text-gray-dark'
        )}
        onClick={handleExpand}
      >
        {loaded && (
          <>
            <MinusSVG className={classNames(svgClasses, isExpanded ? 'inline' : 'hidden')} />
            <PlusSVG className={classNames(svgClasses, isExpanded ? 'hidden' : 'inline')} />
          </>
        )}
        {question}
        <Link href={`#${id}`} title={`Direct link to "${question}"`} className="focus:outline-none">
          <LinkSVG
            className={classNames(
              'mt-0.5 mr-2 mb-1 ml-2 inline h-4 w-4 fill-current',
              'transition-opacity duration-500',
              'hover:opacity-100',
              loaded && isExpanded ? 'opacity-100' : 'opacity-20'
            )}
          />
        </Link>
      </div>
      <div
        className={classNames(
          'overflow-hidden px-4 leading-loose',
          'transition-all duration-500 ease-in-out',
          isExpanded && 'border-gray-300 border-b'
        )}
        ref={content}
        style={{ height: height }}
        id={`${id}container`}
      >
        <RichBody body={answer} classes={classNames('text-sm text-black py-2', 'lg:text-base')} />
      </div>
    </div>
  );
}
