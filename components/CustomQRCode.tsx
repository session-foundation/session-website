import classNames from 'classnames';
import { type KeyboardEvent, type MouseEvent, useEffect, useRef, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';

type SessionQRCodeProps = {
  id: string;
  value: string;
  size: number;
  backgroundColor?: string;
  foregroundColor?: string;
  logoImage?: string;
  logoSize?: number;
};

export function CustomQRCode(props: SessionQRCodeProps) {
  const {
    id,
    value,
    size,
    backgroundColor = '#FFF',
    foregroundColor = '#000',
    logoImage,
    logoSize,
  } = props;
  const [logo, setLogo] = useState(logoImage);
  const [bgColor, setBgColor] = useState(backgroundColor);
  const [fgColor, setFgColor] = useState(foregroundColor);

  const qrRef = useRef<QRCode>(null);
  const qrCanvasSize = 1000;
  const canvasLogoSize = logoSize ? (qrCanvasSize * 0.3 * logoSize) / logoSize : 250;

  const handleOnClick = () => {
    qrRef.current?.download('png', 'session-community-qr-code.png');
  };

  useEffect(() => {
    // Don't pass the component props to the QR component directly instead update it's props in the next render cycle to prevent janky renders

    if (bgColor !== backgroundColor) {
      setBgColor(backgroundColor);
    }

    if (fgColor !== foregroundColor) {
      setFgColor(foregroundColor);
    }

    if (logoImage && logo !== logoImage) {
      setLogo(logoImage);
    }
  }, [backgroundColor, bgColor, fgColor, foregroundColor, logo, logoImage]);

  return (
    <div
      id={id}
      role="img"
      aria-label="Session Community QR Code"
      title="Click to download"
      className={classNames(
        'flex cursor-pointer items-center justify-center overflow-hidden rounded-sm'
      )}
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        void handleOnClick();
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        void handleOnClick();
      }}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <QRCode
        ref={qrRef}
        id={`${id}-canvas`}
        value={value}
        ecLevel={'H'}
        size={qrCanvasSize}
        bgColor={bgColor}
        fgColor={fgColor}
        quietZone={40}
        logoImage={logo}
        logoWidth={canvasLogoSize}
        logoHeight={canvasLogoSize}
        removeQrCodeBehindLogo={true}
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
}
