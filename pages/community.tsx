import classNames from 'classnames';
import Image from 'next/legacy/image';
import { type ReactElement, useState } from 'react';
import Container from '@/components/Container';
import { CustomQRCode } from '@/components/CustomQRCode';
import Button from '@/components/ui/Button';
import Headline from '@/components/ui/Headline';
import Layout from '@/components/ui/Layout';
import { LINKS } from '@/constants';
import METADATA from '@/constants/metadata';
import { copyToClipboard } from '@/utils/clipboard';

export default function Community(): ReactElement {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    if (isCopied) {
      setIsCopied(false);
      return;
    }
    copyToClipboard(LINKS.SESSION.COMMUNITY_SERVER, setIsCopied);
  };

  return (
    <Layout title="Session Community" metadata={METADATA.COMMUNITY_PAGE}>
      <section>
        <Headline
          color="gray-dark"
          classes={classNames(
            'font-mono py-8 justify-center',
            'md:text-lg md:mx-0 md:justify-start',
            'lg:pt-4 lg:pb-16'
          )}
          containerWidths={{
            small: '100%',
            medium: '34rem',
            large: '62rem',
          }}
        >
          Session Community
        </Headline>
        <Container
          classes={classNames('text-center pt-0 px-4 pb-12', 'md:pt-4 md:pb-16', 'lg:pb-16')}
        >
          <h1
            className={classNames(
              'mb-6 font-helvetica font-semibold text-2xl text-gray-dark',
              'md:text-4xl'
            )}
          >
            Scan this QR code on Session to join our community
          </h1>
          <div className={classNames('mb-8 font-semibold text-gray-dark')}>
            <span>To join, open Session and tap and hold on the </span>
            <span className={classNames('mx-1 inline-block h-7 w-7 align-middle')}>
              <Image
                src="/assets/images/session-ui-add.png"
                alt="session add chat button"
                title="session add chat button"
                width={121}
                height={121}
              />
            </span>
            <span> icon, then tap on the </span>
            <span className={classNames('mx-1 inline-block h-7 w-7 align-middle')}>
              <Image
                src="/assets/images/session-ui-community.png"
                alt="session community button"
                title="session community button"
                width={121}
                height={121}
              />
            </span>
            <span> option.</span>
          </div>

          <div className={classNames('mx-auto mb-8 flex items-center justify-center')}>
            <CustomQRCode
              id="session-community-qr-code"
              value={LINKS.SESSION.COMMUNITY_SERVER}
              size={300}
              logoImage="/assets/images/qr-logo.png"
              logoSize={896}
            />
          </div>

          <p className={classNames('font-semibold text-gray-dark')}>
            Otherwise you can click the button below and copy our group chat URL to your clipboard.
          </p>

          <Button
            bgColor={isCopied ? 'black' : 'primary'}
            textColor={isCopied ? 'primary' : 'black'}
            fontWeight="bold"
            animate={true}
            hoverEffect={false}
            classes={classNames('w-40 px-0 mt-8')}
            onClick={handleCopy}
          >
            {isCopied ? 'Copied!' : 'Copy URL'}
          </Button>
        </Container>
      </section>
    </Layout>
  );
}
