import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/etherscan/makeEtherscanAddressURL";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import { useChainId } from "src/ui/network/useChainId";
import {
  PARTICIPANTS_TIP,
  TVP_TIP,
  WALLETS_DELEGATED_TIP,
} from "src/ui/vaults/tooltips";

interface VestingVaultStatsRowProps {
  accountVotingPower: string;
  accountPercentOfTVP: number;
  unvestedMultiplier: number;
  delegatedToAccount: number;
  participants: number;
  tokenAddress: string;
  tokenSymbol: string;
}

export function VestingVaultStatsRow({
  accountVotingPower,
  accountPercentOfTVP,
  unvestedMultiplier,
  delegatedToAccount,
  participants,
  tokenAddress,
  tokenSymbol,
}: VestingVaultStatsRowProps): ReactElement {
  const chainId = useChainId();
  return (
    <div className="flex flex-wrap gap-4">
      {accountVotingPower && (
        <Stat
          label="Your Voting Power"
          value={formatBalance(accountVotingPower)}
        />
      )}

      {accountPercentOfTVP >= 0 && (
        <Stat
          label={
            <>
              % of Total{" "}
              <DefinitionTooltip content={TVP_TIP}>TVP</DefinitionTooltip>
            </>
          }
          value={`${formatBalance(accountPercentOfTVP, 2)}%`}
        />
      )}

      <Stat
        label={
          <DefinitionTooltip content="The voting power of each unvested token as a percentage of a vested token.">
            Unvested multiplier
          </DefinitionTooltip>
        }
        value={`${unvestedMultiplier}%`}
      />

      {delegatedToAccount >= 0 && (
        <Stat
          label={
            <DefinitionTooltip content={WALLETS_DELEGATED_TIP}>
              Delegated to You
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
        label="Vault token"
        value={
          <ExternalLink href={makeEtherscanAddressURL(tokenAddress, chainId)}>
            {tokenSymbol}
          </ExternalLink>
        }
      />
    </div>
  );
}
