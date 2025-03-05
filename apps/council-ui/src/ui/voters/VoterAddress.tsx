import { BuildingLibraryIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { ReactElement } from "react";
import { Tooltip } from "src/ui/base/Tooltip";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useIsGscMember } from "src/ui/vaults/gscVault/hooks/useIsGscMember";
import { useDelegatesByVault } from "src/ui/vaults/hooks/useDelegatesByVault";
import { useAccount } from "wagmi";

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
  const { data: isGscMember } = useIsGscMember(address);
  const config = useCouncilConfig();
  const { address: account } = useAccount();
  const { data: delegatesByVault } = useDelegatesByVault({ account });
  const allVaults = config.coreVoting.vaults.slice();
  if (config.gscVoting) {
    allVaults.push(config.gscVoting.vaults[0]);
  }

  const delegateVaultNames = allVaults
    .map((vaultConfig) => {
      if (delegatesByVault?.[vaultConfig.address] === address) {
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
      {delegateVaultNames.map((vaultName) => {
        return (
          <Tooltip key={vaultName} content={`Your Delegate (${vaultName})`}>
            <UserCircleIcon className="ml-1 size-5 fill-accent" />
          </Tooltip>
        );
      })}
    </span>
  );
}
