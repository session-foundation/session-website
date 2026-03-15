import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import { UI } from '@/constants';

export function useScreenSize() {
  const { width } = useWindowSize();

  // Mobile first
  const [isSmall, setIsSmall] = useState(true);
  const [isMedium, setIsMedium] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [isHuge, setIsHuge] = useState(false);
  const [isEnormous, setIsEnormous] = useState(false);

  useEffect(() => {
    const _isSmall = width < UI.MEDIUM_BREAKPOINT;
    const _isMedium = width >= UI.MEDIUM_BREAKPOINT && width < UI.LARGE_BREAKPOINT;
    const _isLarge = width >= UI.LARGE_BREAKPOINT && width < UI.HUGE_BREAKPOINT;
    const _isHuge = width >= UI.HUGE_BREAKPOINT && width < UI.ENORMOUS_BREAKPOINT;
    const _isEnormous = width >= UI.ENORMOUS_BREAKPOINT;

    setIsSmall(_isSmall);
    setIsMedium(_isMedium);
    setIsLarge(_isLarge);
    setIsHuge(_isHuge);
    setIsEnormous(_isEnormous);
  }, [width]);

  return {
    width,
    isSmall,
    isMedium,
    isLarge,
    isHuge,
    isEnormous,
  };
}
