import { createContext, type ReactElement, type ReactNode, useContext } from 'react';
import { useScreenSize } from '@/hooks/screen';

interface IScreen {
  width: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isHuge: boolean;
  isEnormous: boolean;
}

const ScreenContext = createContext<IScreen>({
  width: 0,
  isSmall: true,
  isMedium: false,
  isLarge: false,
  isHuge: false,
  isEnormous: false,
});

export function useScreen() {
  return useContext(ScreenContext);
}

interface Props {
  children: ReactNode;
}
export function ScreenProvider(props: Props): ReactElement {
  const { children } = props;

  const value: IScreen = useScreenSize();

  return <ScreenContext.Provider value={value}>{children}</ScreenContext.Provider>;
}
