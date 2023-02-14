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
  YOUR_VOTING_POWER_TIP,
} from "src/ui/vaults/tooltips";

interface LockingVaultStatsRowProps {
  accountVotingPower: string;
  accountPercentOfTVP: number;
  delegatedToAccount: number;
  participants: number;
  tokenAddress: string;
  tokenSymbol: string;
}

export function LockingVaultStatsRow({
  accountVotingPower,
  accountPercentOfTVP,
  delegatedToAccount,
  participants,
  tokenAddress,
  tokenSymbol,
}: LockingVaultStatsRowProps): ReactElement {
  const chainId = useChainId();
  return (
    <div className="flex flex-wrap gap-4">
      {accountVotingPower && (
        <Stat
          label={
            <DefinitionTooltip content={YOUR_VOTING_POWER_TIP}>
              Your voting power
            </DefinitionTooltip>
          }
          value={
            +accountVotingPower ? formatBalance(accountVotingPower) : "None"
          }
        />
      )}

      {accountPercentOfTVP >= 0 && (
        <Stat
          label={
            <>
              % of total{" "}
              <DefinitionTooltip content={TVP_TIP}>TVP</DefinitionTooltip>
            </>
          }
          value={`${formatBalance(accountPercentOfTVP, 2)}%`}
        />
      )}

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
