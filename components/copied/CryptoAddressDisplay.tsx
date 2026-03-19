import cn from 'classnames';
import { ArbitrumIcon } from './ArbitrumIcon';
import { BitcoinIcon } from './BitcoinIcon';
import { BNBIcon } from './BNBIcon';
import { CopyableInputDisplay } from './CopyableInputDisplay';
import { EthIcon } from './EthIcon';
import type { InputVariantProps } from './input';
import { BitcoinCashIcon } from './BitcoinCashIcon';

type CryptoAddressDisplaySchemaType = {
  cryptoAddress: {
    icon: string;
    name: string;
    address: string;
  };
};

function getIcon(value: CryptoAddressDisplaySchemaType) {
  if (!value.cryptoAddress?.icon) {
    return EthIcon;
  }
  switch (value.cryptoAddress.icon) {
    case 'Bitcoin':
      return BitcoinIcon;
    case 'Bitcoin Cash':
      return BitcoinCashIcon;
    case 'BNB':
      return BNBIcon;
    case 'Arbitrum':
      return ArbitrumIcon;
    default:
      return EthIcon;
  }
}

export function SanityCryptoAddressDisplay({
  value,
  variant,
}: {
  value: CryptoAddressDisplaySchemaType;
} & InputVariantProps) {
  if (!value.cryptoAddress) {
    console.warn('Missing crypto address for crypto display');
    return null;
  }

  const IconComp = getIcon(value);

  return (
    <div
      className={cn(
        'group',
        'flex w-full flex-col align-middle md:flex-row md:items-center',
        'my-4 gap-2'
      )}
    >
      <div className="flex flex-row items-start gap-1 align-middle md:hidden">
        <IconComp className="h-5 w-5" />
        <span className="font-semibold text-base md:text-lg">{value.cryptoAddress.name}</span>
      </div>
      <IconComp className="hidden h-9 w-9 md:block" />
      <CopyableInputDisplay
        className="text-black bg-white"
        value={value.cryptoAddress.address}
        copyToClipboardProps={{
          textToCopy: value.cryptoAddress.address,
          className: 'hover:bg-transparent hover:stroke-primary hover:text-primary',
        }}
        variant={variant}
      />
    </div>
  );
}
