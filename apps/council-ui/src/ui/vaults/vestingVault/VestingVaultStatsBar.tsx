import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeEtherscanAddressURL } from "src/etherscan/makeEtherscanAddressURL";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { Stat } from "src/ui/base/Stat";

interface VestingVaultStatsBarProps {
  activeProposalCount: number;
  accountVotingPower: string;
  accountPercentOfTVP: number;
  delegatedToAccount: number;
  participants: number;
  tokenAddress: string;
  tokenSymbol: string;
}

export function VestingVaultStatsBar({
  activeProposalCount,
  accountVotingPower,
  accountPercentOfTVP,
  delegatedToAccount,
  participants,
  tokenAddress,
  tokenSymbol,
}: VestingVaultStatsBarProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      {activeProposalCount >= 0 && (
        <Stat label="Active Proposals" value={activeProposalCount} />
      )}

      {accountVotingPower && (
        <Stat
          label="Your Voting Power"
          value={formatBalance(accountVotingPower)}
        />
      )}

      {accountPercentOfTVP >= 0 && (
        <Stat
          label="% of Total TVP"
          value={`${formatBalance(accountPercentOfTVP, 2)}%`}
        />
      )}

      {delegatedToAccount >= 0 && (
        <Stat label="Delegated to You" value={delegatedToAccount} />
      )}

      {participants >= 0 && <Stat label="Participants" value={participants} />}

      <Stat
        label="Vault token"
        value={
          <ExternalLink href={makeEtherscanAddressURL(tokenAddress)}>
            {tokenSymbol}
          </ExternalLink>
        }
      />
    </div>
  );
}

// ================ Skeletons ================

export function VaultStatsBarSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Active Proposals" value={<Skeleton width={90} />} />
      <Stat label="% of Total TVP" value={<Skeleton width={90} />} />
      <Stat label="Your Voting Power" value={<Skeleton width={90} />} />
      <Stat label="Delegated to You" value={<Skeleton width={90} />} />
      <Stat label="Participants" value={<Skeleton width={90} />} />
      <Stat label="Vault token" value={<Skeleton width={90} />} />
    </div>
  );
}
