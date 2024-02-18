import { ReactElement } from "react";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip";
import { formatUnitsBalance } from "src/ui/base/formatting/formatUnitsBalance";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import {
  PARTICIPANTS_TIP,
  WALLETS_DELEGATED_TIP,
  YOUR_VOTING_POWER_TIP,
} from "src/ui/vaults/tooltips";
import { makeEtherscanAddressURL } from "src/utils/etherscan/makeEtherscanAddressURL";

interface LockingVaultStatsRowProps {
  accountVotingPower: bigint;
  delegatedToAccount: number;
  participants: number;
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  decimals: number;
}

export function LockingVaultStatsRow({
  accountVotingPower,
  delegatedToAccount,
  participants,
  tokenAddress,
  tokenSymbol,
  decimals,
}: LockingVaultStatsRowProps): ReactElement {
  const chainId = useSupportedChainId();
  const votingPowerFormatted = formatUnitsBalance({
    balance: accountVotingPower,
    decimals,
  });

  return (
    <div className="flex flex-wrap gap-4">
      <Stat
        label={
          <DefinitionTooltip content={YOUR_VOTING_POWER_TIP}>
            Your voting power
          </DefinitionTooltip>
        }
        value={votingPowerFormatted}
      />

      {delegatedToAccount >= 0 && (
        <Stat
          label={
            <DefinitionTooltip content={WALLETS_DELEGATED_TIP}>
              Wallets delegated to you
            </DefinitionTooltip>
          }
          value={delegatedToAccount || "None"}
        />
      )}

      {participants >= 0 && (
        <Stat
          label={
            <DefinitionTooltip content={PARTICIPANTS_TIP}>
              Participants
            </DefinitionTooltip>
          }
          value={participants}
        />
      )}

      <Stat
        label={
          <DefinitionTooltip content="The specific token native to this vault">
            Vault token
          </DefinitionTooltip>
        }
        value={
          <ExternalLink href={makeEtherscanAddressURL(tokenAddress, chainId)}>
            {tokenSymbol}
          </ExternalLink>
        }
      />
    </div>
  );
}
