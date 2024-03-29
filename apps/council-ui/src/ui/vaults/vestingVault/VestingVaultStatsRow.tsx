import { ReactElement } from "react";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import {
  PARTICIPANTS_TIP,
  WALLETS_DELEGATED_TIP,
  YOUR_VOTING_POWER_TIP,
} from "src/ui/vaults/tooltips";
import { makeEtherscanAddressURL } from "src/utils/etherscan/makeEtherscanAddressURL";

interface VestingVaultStatsRowProps {
  accountVotingPower: bigint;
  unvestedMultiplier: bigint;
  delegatedToAccount: number;
  participants: number;
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
}

export function VestingVaultStatsRow({
  accountVotingPower,
  unvestedMultiplier,
  delegatedToAccount,
  participants,
  tokenAddress,
  tokenSymbol,
}: VestingVaultStatsRowProps): ReactElement {
  const chainId = useSupportedChainId();
  return (
    <div className="flex flex-wrap gap-4">
      <Stat
        label={
          <DefinitionTooltip content={YOUR_VOTING_POWER_TIP}>
            Your voting power
          </DefinitionTooltip>
        }
        value={
          accountVotingPower > 0
            ? formatVotingPower(accountVotingPower)
            : "None"
        }
      />

      <Stat
        label={
          <DefinitionTooltip content="The voting power of each unvested token as a percentage of a vested token.">
            Unvested multiplier
          </DefinitionTooltip>
        }
        value={`${unvestedMultiplier}%`}
      />

      <Stat
        label={
          <DefinitionTooltip content={WALLETS_DELEGATED_TIP}>
            Wallets delegated to you
          </DefinitionTooltip>
        }
        value={delegatedToAccount || "None"}
      />

      {participants && (
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
