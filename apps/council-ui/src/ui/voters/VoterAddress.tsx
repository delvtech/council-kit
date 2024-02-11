import { BuildingLibraryIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { ReactElement } from "react";
import { Tooltip } from "src/ui/base/Tooltip/Tooltip";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useIsGscMember } from "src/ui/vaults/gscVault/hooks/useIsGscMember";
import { useDelegatesByVault } from "src/ui/vaults/hooks/useDelegatesByVault";
import { getAllVaultConfigs } from "src/vaults/vaults";

interface VoterAddressProps {
  address: `0x${string}`;
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
  const chainId = useSupportedChainId();
  const { isGscMember } = useIsGscMember(address);
  const coreVotingVaults = useReadCoreVoting();
  const { delegatesByVault } = useDelegatesByVault({
    vaults: coreVotingVaults.vaults,
  });
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
      {isGscMember && (
        <Tooltip content="GSC Member">
          <BuildingLibraryIcon className="ml-1 size-5 fill-warning" />
        </Tooltip>
      )}
      {vaultNames.map((vaultName) => {
        return (
          <Tooltip key={vaultName} content={`Your Delegate (${vaultName})`}>
            <UserCircleIcon className="ml-1 size-5 fill-accent" />
          </Tooltip>
        );
      })}
    </span>
  );
}
