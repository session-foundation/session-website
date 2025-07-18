/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, useEffect, useRef, useState } from 'react';

import { ReactComponent as LinkSVG } from '@/assets/svgs/link.svg';
import { Document } from '@contentful/rich-text-types';
import Link from 'next/link';
import { ReactComponent as MinusSVG } from '@/assets/svgs/minus.svg';
import { ReactComponent as PlusSVG } from '@/assets/svgs/plus.svg';
import RichBody from '@/components/RichBody';
import classNames from 'classnames';

interface Props {
  id: string;
  question: string;
  answer: Document;
  expand?: boolean;
  classes?: string;
}

const handleNewHeight = (e: Event, container: HTMLElement, id: string) => {
  const oldHeight = Number(container?.style.height.slice(0, -2));
  if (
    document.querySelector(`#${id}container .showExternalVideoButton`) !== null
  ) {
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
    const buttons = window?.document.querySelectorAll(
      '.showExternalVideoButton'
    );
    const container = window?.document.getElementById(id + 'container')!;

    buttons.forEach((button) => {
      button?.addEventListener('click', (e: Event) =>
        handleNewHeight(e, container, id)
      );
    });

    return () => {
      buttons.forEach((button) => {
        button?.removeEventListener('click', (e: Event) =>
          handleNewHeight(e, container, id)
        );
      });
    };
  }, []);

  useEffect(() => {
    if (!expand) {
      handleExpand();
    } else {
      setHeight(`${content?.current?.scrollHeight}px`);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && expand) {
      handleExpand();
    }
  }, [expand]);

  return (
    <div
      id={id}
      className={classNames(
        'border-l border-r border-gray-300 text-sm',
        'first:border-t',
        classes
      )}
    >
      <div
        className={classNames(
          'py-2 px-4 font-bold border-gray-300 border-b',
          'lg:text-base',
          'transition-colors duration-700 ease-in-out',
          loaded && isExpanded
            ? 'bg-gray-dark text-primary'
            : 'bg-gray-100 text-gray-dark'
        )}
        onClick={handleExpand}
      >
        {loaded && (
          <>
            <MinusSVG
              className={classNames(
                svgClasses,
                isExpanded ? 'inline' : 'hidden'
              )}
            />
            <PlusSVG
              className={classNames(
                svgClasses,
                isExpanded ? 'hidden' : 'inline'
              )}
            />
          </>
        )}
        {question}
        <Link legacyBehavior href={`#${id}`}>
          <a
            title={`Direct link to "${question}"`}
            className="focus:outline-none"
          >
            <LinkSVG
              className={classNames(
                'inline w-4 h-4 fill-current mb-1 mr-2 mt-0.5 ml-2',
                'transition-opacity duration-500',
                'hover:opacity-100',
                loaded && isExpanded ? 'opacity-100' : 'opacity-20'
              )}
            />
          </a>
        </Link>
      </div>
      <div
        className={classNames(
          'leading-loose px-4 overflow-hidden',
          'transition-all ease-in-out duration-500',
          isExpanded && 'border-gray-300 border-b'
        )}
        ref={content}
        style={{ height: height }}
        id={id + 'container'}
      >
        <RichBody
          body={answer}
          classes={classNames('text-sm text-black py-2', 'lg:text-base')}
        />
      </div>
    </div>
  );
}
