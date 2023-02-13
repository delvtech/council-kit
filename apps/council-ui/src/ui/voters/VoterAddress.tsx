import { BuildingLibraryIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { Tooltip } from "src/ui/base/Tooltip/Tooltip";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { useChainId } from "src/ui/network/useChainId";
import { useIsGSCMember } from "src/ui/vaults/gscVault/useIsGSCMember";
import { useDelegatesByVault } from "src/ui/vaults/hooks/useDelegatesByVault";
import { getAllVaultConfigs } from "src/vaults/vaults";

interface VoterAddressProps {
  address: string;
  ensName?: string | null;
  /**
   * If provided this will be rendered instead of the formatted address or ens.
   */
  label?: string;
  className?: string;
  iconSize?: number;
}

export function VoterAddress({
  address,
  ensName,
  label,
  className,
  iconSize,
}: VoterAddressProps): ReactElement {
  const chainId = useChainId();
  const { data: isGSCMember } = useIsGSCMember(address);
  const { data: delegatesByVault } = useDelegatesByVault();
  const allVaults = getAllVaultConfigs(chainId);
  const vaultNames = allVaults
    .map((vaultConfig) => {
      if (delegatesByVault?.[vaultConfig.address]?.address === address) {
        return vaultConfig.name;
      }
    })
    .filter((v) => !!v) as string[];

  let addressLabel = formatAddress(address);
  if (label) {
    addressLabel = label;
  } else if (ensName) {
    addressLabel = ensName;
  }
  return (
    <span className={classNames("flex items-center", className)}>
      <WalletIcon size={iconSize} address={address} className="mr-2" />
      {addressLabel}
      {isGSCMember && (
        <Tooltip content="GSC Member">
          <BuildingLibraryIcon className="w-5 h-5 ml-1 fill-warning" />
        </Tooltip>
      )}
      {vaultNames.map((vaultName) => {
        return (
          <Tooltip key={vaultName} content={`Your Delegate (${vaultName})`}>
            <UserCircleIcon className="w-5 h-5 ml-1 fill-accent" />
          </Tooltip>
        );
      })}
    </span>
  );
}
